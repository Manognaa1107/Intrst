"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/apiClient";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUpIcon, MessageCircleIcon, BookmarkIcon, PlusIcon, XIcon, LockIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/UserContext";
import { PersonalityPrompt } from "@/components/PersonalityPrompt";

const tabs = ["All", "Tips", "Questions", "Events", "Utilities", "Opinions"];

export default function HomePage() {
  const { user_id, has_completed_personality, setHasCompletedPersonality, role, isAuthLoading, interests } = useUser();
  const [activeTab, setActiveTab] = useState("All");
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [postTag, setPostTag] = useState("QUESTION");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [postComments, setPostComments] = useState<Record<string, any[]>>({});
  const [commentLoading, setCommentLoading] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const showPersonalityPrompt = !isAuthLoading && !has_completed_personality && !!user_id;

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const data = await apiFetch("/posts");
      setPosts(data?.posts || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeaturedEvents = async () => {
    try {
      setEventsLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select(`
          event_id,
          title,
          poster_url,
          clubs (
            club_name,
            logo_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setFeaturedEvents(data || []);
    } catch (err) {
      console.error("Error fetching featured events:", err);
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchSavedPosts = async () => {
    if (!user_id) return;

    const { data, error } = await supabase
      .from("saved_posts")
      .select("post_id")
      .eq("user_id", user_id);

    if (!error && data) {
      setSavedPosts(data.map(item => item.post_id));
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchFeaturedEvents();
    fetchSavedPosts();
  }, [user_id]);

  const handleCreatePost = async () => {
    if (!postContent.trim() || !postTag) return;

    try {
      setIsPosting(true);
      const response = await apiFetch("/posts", {
        method: "POST",
        body: JSON.stringify({
          content: postContent,
          post_type: postTag,
          title: postTitle || "New Post",
          is_anonymous: isAnonymous
        }),
      });

      if (response && response.post) {
        setPostContent("");
        setPostTitle("");
        setIsAnonymous(false);
        setIsFabOpen(false);
        fetchPosts(); // Refresh feed
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    // Optimistic Update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = p.user_has_liked;
        return {
          ...p,
          user_has_liked: !isLiked,
          likes_count: (p.likes_count || 0) + (isLiked ? -1 : 1)
        };
      }
      return p;
    }));

    try {
      await apiFetch(`/posts/${postId}/like`, { method: 'POST' });
    } catch (error) {
      console.error("Failed to like post:", error);
      // Rollback if failed
      fetchPosts();
    }
  };

  const handleDeletePost = async (postId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      await apiFetch(`/posts/${postId}`, {
        method: "DELETE",
      });

      setPosts(prev =>
        prev.filter(post => post.id !== postId)
      );

      fetchPosts();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const toggleSavePost = async (postId: string) => {
    if (!user_id) return;
        console.log("Saving post:", postId);
        console.log("User:", user_id);

    try {
      const isSaved = savedPosts.includes(postId);

      if (isSaved) {
        const { error } = await supabase
          .from("saved_posts")
          .delete()
          .eq("user_id", user_id)
          .eq("post_id", postId);
        

        if (error) throw error;
        console.log("Insert success");
        
        setSavedPosts(prev =>
          prev.filter(id => id !== postId)
        );
      } else {
        const { error } = await supabase
          .from("saved_posts")
          .insert({
            user_id,
            post_id: postId,
          });

        if (error) throw error;

        setSavedPosts(prev => [...prev, postId]);
      }
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const toggleComments = async (postId: string) => {
    const isExpanded = expandedComments.has(postId);
    const newExpanded = new Set(expandedComments);

    if (isExpanded) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      // Fetch data if not already fetched
      if (!postComments[postId]) {
        fetchComments(postId);
      }
    }
    setExpandedComments(newExpanded);
  };

  const fetchComments = async (postId: string) => {
    try {
      setCommentLoading(prev => ({ ...prev, [postId]: true }));
      const data = await apiFetch(`/comments/${postId}`);
      setPostComments(prev => ({ ...prev, [postId]: data || [] }));
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setCommentLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;

    try {
      const response = await apiFetch("/comments", {
        method: "POST",
        body: JSON.stringify({ postId, comment: text })
      });

      if (response && response.comment) {
        setCommentInputs(prev => ({ ...prev, [postId]: "" }));
        fetchComments(postId); // Refresh comment list
        // Update comment count locally
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, post_comments: [{ count: (p.post_comments?.[0]?.count || 0) + 1 }] } : p));
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment.");
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "EVENT": return "bg-[#505f78]/10 text-[#505f78] border border-[#505f78]/20";
      case "QUESTION": return "bg-[#855300]/10 text-[#855300] border border-[#855300]/20";
      case "TIP": return "bg-emerald-600/10 text-emerald-700 border border-emerald-600/20";
      case "UTILITY": return "bg-blue-600/10 text-blue-700 border border-blue-600/20";
      case "OPINION": return "bg-rose-600/10 text-rose-700 border border-rose-600/20";
      default: return "bg-neutral-100 text-neutral-600 border border-black/5";
    }
  };

  const filteredPosts = activeTab === "All" ? posts : posts.filter(p => p.post_type === activeTab.toUpperCase().replace(/S$/, ''));

  return (
    <div className="w-full min-h-screen bg-background relative flex flex-col md:flex-row overflow-hidden">
      {showPersonalityPrompt && (
        <PersonalityPrompt
          user_id={user_id}
          onComplete={() => setHasCompletedPersonality(true)}
        />
      )}
      <div className="flex-1 max-w-full md:max-w-3xl mx-auto w-full min-w-0 border-l border-border/40 min-h-screen relative pb-20 overflow-x-hidden">  {/* Top Header - Mobile */}
        <div className="md:hidden sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40 pt-[calc(env(safe-area-inset-top)+64px)] px-4 pb-3 overflow-x-auto hide-scrollbar flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${activeTab === tab ? 'bg-black text-white' : 'bg-white/80 text-neutral-500 hover:bg-neutral-100 border border-black/5'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Top Header - Desktop */}
        <div className="hidden md:flex sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40 px-6 py-4 gap-3 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${activeTab === tab ? 'bg-black text-white' : 'bg-white/80 text-neutral-500 hover:bg-neutral-100 border border-black/5'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="p-4 sm:p-6 space-y-4">

          {/* Pinned Posts Section (Clubs/Events) - Dynamic Form */}
          <div className="mb-10 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Featured Events</span>
              <Badge variant="outline" className="text-[9px] border-emerald-600/20 bg-emerald-500/5 text-emerald-700 px-1.5 py-0">LIVE</Badge>
            </div>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
              {eventsLoading ? (
                <div className="w-full h-[180px] rounded-[32px] border border-dashed border-black/10 bg-white/40 animate-pulse" />
              ) : featuredEvents.length === 0 ? (
                <div className="w-full py-10 bg-white/40 border border-dashed border-black/10 rounded-[32px] flex flex-col items-center justify-center text-center px-6">

                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-300">
                    📅
                  </div>

                  <p className="text-[11px] text-neutral-400 uppercase tracking-[0.15em] font-bold">
                    No Featured Events Today
                  </p>

                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1">
                  {featuredEvents.map((evt) => (
                    <Link
                      key={evt.event_id}
                      href={`/events/${evt.event_id}`}
                    >
                      <div className="min-w-[240px] bg-white border border-black/5 rounded-[24px] p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">

                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-xl bg-neutral-100 overflow-hidden border border-black/5">
                            {evt.clubs?.logo_url ? (
                              <img
                                src={evt.clubs.logo_url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                📅
                              </div>
                            )}
                          </div>

                          <span className="text-xs font-semibold text-neutral-700 truncate">
                            {evt.clubs?.club_name || "Campus Event"}
                          </span>
                        </div>

                        <h4 className="text-sm font-semibold text-[#0f0f10] line-clamp-2">
                          {evt.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-8 md:block flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-dmserif font-semibold text-[#0f0f10]">Campus Pulse</h1>
              <p className="text-neutral-500">What&apos;s happening on campus right now.</p>
            </div>
            {activeTab !== "All" && (
              <Badge className="bg-[#505f78]/10 text-[#505f78] border-[#505f78]/20">Showing {activeTab}s</Badge>
            )}
          </div>

          {/* Fallback prompt banner when no interests selected */}
          {(!interests || interests.length === 0) && (
            <Card className="p-6 bg-[#855300]/5 border border-[#855300]/10 rounded-2xl shadow-sm space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#855300]/10 border border-[#855300]/20 flex items-center justify-center text-[#855300] shrink-0">
                  <span className="text-lg">✨</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-dmserif font-bold text-lg text-[#0f0f10]">Personalize Your Feed</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    You haven&apos;t selected any interests yet. Setup your interests to see discussions, events, and clubs custom-tailored to your exact vibe!
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pl-[52px]">
                <Link href="/profile/me">
                  <Button className="h-9 px-5 bg-black hover:bg-[#505f78] text-white font-semibold rounded-xl text-xs transition-colors">
                    Set Interests
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>Loading your campus pulse...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p>No posts yet. Be the first to post something!</p>
            </div>
          ) : filteredPosts.map((post) => (
            <Card key={post.id} className="p-4 sm:p-5 bg-white border border-black/5 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="flex gap-3 mb-3">
                <Avatar className="w-10 h-10 border border-border">
                  <AvatarFallback className="bg-neutral-100 text-neutral-600 font-semibold">
                    {post.is_anonymous ? "A" : ((post.profiles?.name || "U")[0])}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-[#0f0f10] text-sm">{post.is_anonymous ? "Anonymous" : (post.profiles?.name || "Student")}</h4>
                      <p className="text-xs text-neutral-500">
                        {post.is_anonymous ? "Hidden Identity" : (post.profiles?.department || "General")} &middot; {post.is_anonymous ? "Unknown" : (post.profiles?.year_of_study ? `${post.profiles.year_of_study}${post.profiles.year_of_study === 1 ? 'st' : post.profiles.year_of_study === 2 ? 'nd' : post.profiles.year_of_study === 3 ? 'rd' : 'th'} Year` : "Member")}
                      </p>
                    </div>
                    {/* <Badge className={getTagColor(post.post_type)} variant="outline">
                      {post.post_type}
                    </Badge> */}
                    <div className="flex items-center gap-2">
                      <Badge className={getTagColor(post.post_type)} variant="outline">
                        {post.post_type}
                      </Badge>

                      {post.user_id === user_id && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-foreground text-[15px] leading-relaxed mb-4 ml-[52px]">
                {post.content}
              </p>

              <div className="flex items-center gap-6 ml-[52px] text-neutral-500">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors group ${post.user_has_liked ? 'text-[#855300]' : 'hover:text-black'}`}
                >
                  <div className={`p-1.5 rounded-full transition-colors ${post.user_has_liked ? 'bg-[#855300]/10' : 'group-hover:bg-neutral-100'}`}>
                    <ThumbsUpIcon className={`w-4 h-4 ${post.user_has_liked ? 'fill-[#855300] text-[#855300]' : ''}`} />
                  </div>
                  {post.likes_count || 0}
                </button>
                <button
                  onClick={() => toggleComments(post.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors group ${expandedComments.has(post.id) ? 'text-[#505f78]' : 'hover:text-black'}`}
                >
                  <div className={`p-1.5 rounded-full transition-colors ${expandedComments.has(post.id) ? 'bg-[#505f78]/10' : 'group-hover:bg-neutral-100'}`}>
                    <MessageCircleIcon className="w-4 h-4" />
                  </div>
                  {post.post_comments?.[0]?.count || 0}
                </button>
                <div className="flex-1"></div>
                <div className="text-xs">{new Date(post.created_at).toLocaleDateString()}</div>
                {/* <button className="p-1.5 rounded-full hover:bg-neutral-100 hover:text-black transition-colors">
                  <BookmarkIcon className="w-4 h-4" />
                </button> */}
                <button
                  onClick={() => toggleSavePost(post.id)}
                  className={`p-1.5 rounded-full transition-colors ${
                    savedPosts.includes(post.id)
                      ? "text-[#855300] bg-[#855300]/10"
                      : "hover:bg-neutral-100 hover:text-black"
                  }`}
                >
                  <BookmarkIcon
                    className={`w-4 h-4 ${
                      savedPosts.includes(post.id)
                        ? "fill-current"
                        : ""
                    }`}
                  />
                </button>
              </div>

              {/* Comment Section */}
              {expandedComments.has(post.id) && (
                <div className="mt-4 ml-[52px] space-y-4 pt-4 border-t border-black/5 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex gap-2">
                    <Avatar className="w-8 h-8 border border-border">
                      <AvatarFallback className="bg-neutral-100 text-[10px] text-neutral-600">ME</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentInputs[post.id] || ""}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                        className="flex-1 bg-neutral-50 border border-black/5 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-neutral-300 transition-colors"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentInputs[post.id]?.trim()}
                        className="bg-black text-white hover:bg-[#505f78] h-8 px-4 text-xs font-bold rounded-full"
                      >
                        Post
                      </Button>
                    </div>
                  </div>

                  {commentLoading[post.id] ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : postComments[post.id]?.length === 0 ? (
                    <p className="text-xs text-neutral-500 text-center py-2">No comments yet. Start the conversation!</p>
                  ) : (
                    <div className="space-y-4">

                      {postComments[post.id]?.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="w-7 h-7 border border-border">
                            <AvatarFallback className="bg-neutral-100 text-[9px] text-neutral-600">
                              {comment.profiles?.name?.[0] || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-neutral-50 border border-black/5 rounded-2xl p-2.5 px-3">
                              <h5 className="text-[11px] font-bold text-[#0f0f10]">{comment.profiles?.name || "Anonymous"}</h5>
                              <p className="text-sm text-neutral-800">{comment.comment}</p>
                            </div>
                            <span className="text-[10px] text-neutral-500 ml-2">Just now</span>
                            <div className="text-xs">{new Date(post.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setIsFabOpen(true)}
        className="fixed bottom-[100px] md:bottom-8 right-4 md:right-8 w-14 h-14 bg-black hover:bg-[#505f78] active:scale-95 transition-all text-white rounded-full shadow-md flex items-center justify-center z-40"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      {/* Create Post Modal */}
      {isFabOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white border border-black/5 sm:rounded-2xl rounded-t-2xl shadow-xl safe-area-bottom animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 duration-300">
            <div className="flex justify-between items-center p-4 border-b border-black/5">
              <h3 className="text-lg font-dmserif font-semibold text-[#0f0f10]">Create Post</h3>
              <button onClick={() => { setIsFabOpen(false); setIsAnonymous(false); }} className="p-2 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-full transition-colors">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                {["TIP", "QUESTION", "EVENT", "UTILITY", "OPINION"].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setPostTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${postTag === tag ? getTagColor(tag) : 'bg-transparent text-neutral-500 border-black/5 hover:border-neutral-400'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <Textarea
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="min-h-[150px] bg-white border border-black/5 rounded-xl p-3 focus-visible:ring-0 text-base resize-none placeholder:text-neutral-400"
              />

              {/* Media Upload for Clubs */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <button className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${role === 'club' ? 'border-[#505f78]/30 bg-[#505f78]/5 text-[#505f78] hover:bg-[#505f78]/10' : 'border-black/5 bg-neutral-50 text-neutral-400 cursor-not-allowed'}`}>
                    <PlusIcon className="w-4 h-4" /> Add Photo/Video
                  </button>
                  {role !== 'club' && (
                    <p className="text-[10px] text-muted-foreground italic">Only clubs can post media for now.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${isAnonymous ? 'bg-black text-white border border-black/10' : 'text-neutral-700 hover:bg-neutral-100'}`}
                >
                  <LockIcon className="w-4 h-4" /> {isAnonymous ? 'Posting Anonymously' : 'Anonymous'}
                </button>
                <Button
                  className={`px-6 rounded-xl font-semibold ${postTag && postContent.trim() ? 'bg-black text-white hover:bg-[#505f78]' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    }`}
                  disabled={!postTag || !postContent.trim() || isPosting}
                  onClick={handleCreatePost}
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}