"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUpIcon, MessageCircleIcon, BookmarkIcon, TrashIcon, MoreVertical, FlagIcon } from "lucide-react";
import { apiFetch } from "@/lib/apiClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostCardProps {
  post: any;
  user_id: string | null;
  onDelete?: () => void;
  isSaved?: boolean;
  onSave?: () => void;
}

export function PostCard({ post, user_id, onDelete, isSaved, onSave }: PostCardProps) {
  const [localPost, setLocalPost] = useState(post);
  const [isExpanded, setIsExpanded] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    setLocalPost(post);
  }, [post]);

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

  const handleLike = async () => {
    const isLiked = localPost.user_has_liked;
    setLocalPost((prev: any) => ({
      ...prev,
      user_has_liked: !isLiked,
      likes_count: (prev.likes_count || 0) + (isLiked ? -1 : 1)
    }));

    try {
      await apiFetch(`/posts/${localPost.id}/like`, { method: 'POST' });
    } catch (error) {
      console.error("Failed to like post:", error);
      // Revert on error
      setLocalPost(post);
    }
  };

  const toggleComments = async () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
      if (comments.length === 0) {
        fetchComments();
      }
    }
  };

  const fetchComments = async () => {
    try {
      setCommentLoading(true);
      const data = await apiFetch(`/comments/${localPost.id}`);
      setComments(data || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;

    try {
      const response = await apiFetch("/comments", {
        method: "POST",
        body: JSON.stringify({ postId: localPost.id, comment: commentInput })
      });

      if (response && response.comment) {
        setCommentInput("");
        fetchComments(); // Refresh comment list
        
        // Update comment count locally
        setLocalPost((prev: any) => ({
          ...prev,
          post_comments: [{ count: (prev.post_comments?.[0]?.count || 0) + 1 }]
        }));
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;

    try {
      await apiFetch(`/comments/${commentId}`, { method: "DELETE" });
      
      // Optimistically remove from list
      setComments(prev => prev.filter(c => c.id !== commentId));
      
      // Update comment count locally
      setLocalPost((prev: any) => ({
        ...prev,
        post_comments: [{ count: Math.max(0, (prev.post_comments?.[0]?.count || 0) - 1) }]
      }));
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Failed to delete comment.");
    }
  };

  return (
    <Card className="p-5 sm:p-6 bg-white/80 backdrop-blur-sm border border-black/5 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:bg-white hover:border-black/10 transition-all duration-300">
      <div className="flex gap-3 mb-3">
        <Avatar className="w-10 h-10 border border-black/5">
          <AvatarFallback className="bg-neutral-100 text-neutral-600 font-semibold">
            {localPost.is_anonymous ? "A" : ((localPost.profiles?.name || "U")[0])}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-[#0f0f10] text-sm">{localPost.is_anonymous ? "Anonymous" : (localPost.profiles?.name || "Student")}</h4>
              <p className="text-xs text-neutral-500">
                {localPost.is_anonymous ? "Hidden Identity" : (localPost.profiles?.department || "General")} &middot; {localPost.is_anonymous ? "Unknown" : (localPost.profiles?.year_of_study ? `${localPost.profiles.year_of_study}${localPost.profiles.year_of_study === 1 ? 'st' : localPost.profiles.year_of_study === 2 ? 'nd' : localPost.profiles.year_of_study === 3 ? 'rd' : 'th'} Year` : "Member")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getTagColor(localPost.post_type)} variant="outline">
                {localPost.post_type || "General"}
              </Badge>

              <DropdownMenu>
                {/* @ts-expect-error - asChild type issue */}
                <DropdownMenuTrigger asChild>
                  <button className="text-neutral-500 hover:text-black hover:bg-neutral-100 p-1.5 rounded-full transition-colors outline-none">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-xl border-black/5 shadow-lg bg-white/95 backdrop-blur-md">
                  {localPost.user_id === user_id ? (
                    onDelete && (
                      <DropdownMenuItem onClick={onDelete} variant="destructive" className="cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600 font-medium">
                        <TrashIcon className="w-4 h-4 mr-2" /> Delete Post
                      </DropdownMenuItem>
                    )
                  ) : (
                    <DropdownMenuItem onClick={() => console.log("Report clicked")} className="cursor-pointer text-neutral-600 focus:bg-neutral-100 font-medium">
                      <FlagIcon className="w-4 h-4 mr-2" /> Report Post
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <p className="text-foreground text-[15px] leading-relaxed mb-4 ml-[52px]">
        {localPost.content}
      </p>

      <div className="flex items-center gap-6 ml-[52px] text-neutral-500">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors group ${localPost.user_has_liked ? 'text-[#855300]' : 'hover:text-black'}`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${localPost.user_has_liked ? 'bg-[#855300]/10' : 'group-hover:bg-neutral-100'}`}>
            <ThumbsUpIcon className={`w-4 h-4 ${localPost.user_has_liked ? 'fill-[#855300] text-[#855300]' : ''}`} />
          </div>
          {localPost.likes_count || 0}
        </button>
        <button
          onClick={toggleComments}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors group ${isExpanded ? 'text-[#505f78]' : 'hover:text-black'}`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${isExpanded ? 'bg-[#505f78]/10' : 'group-hover:bg-neutral-100'}`}>
            <MessageCircleIcon className="w-4 h-4" />
          </div>
          {localPost.post_comments?.[0]?.count || localPost.comments_count || 0}
        </button>
        <div className="flex-1"></div>
        <div className="text-xs">{new Date(localPost.created_at).toLocaleDateString()}</div>
        
        {onSave && (
          <button
            onClick={onSave}
            className={`p-1.5 rounded-full transition-colors ${isSaved
              ? "text-[#855300] bg-[#855300]/10"
              : "hover:bg-neutral-100 hover:text-black"
              }`}
          >
            <BookmarkIcon
              className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
            />
          </button>
        )}
      </div>

      {/* Comment Section */}
      {isExpanded && (
        <div className="mt-4 ml-[52px] space-y-4 pt-4 border-t border-black/5 animate-in slide-in-from-top-2 duration-200">
          <div className="flex gap-2">
            <Avatar className="w-8 h-8 border border-black/5">
              <AvatarFallback className="bg-neutral-100 text-[10px] text-neutral-600">ME</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                className="flex-1 bg-white/60 border border-black/5 rounded-full px-4 py-1.5 text-xs focus:outline-none focus:border-neutral-300 transition-colors placeholder:text-neutral-400"
              />
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={!commentInput.trim()}
                className="bg-black text-white hover:bg-[#505f78] h-8 px-4 text-xs font-bold rounded-full"
              >
                Post
              </Button>
            </div>
          </div>

          {commentLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : comments.length === 0 ? (
            <p className="text-xs text-neutral-500 text-center py-2">No comments yet. Start the conversation!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="w-7 h-7 border border-black/5">
                    <AvatarFallback className="bg-neutral-100 text-[9px] text-neutral-600">
                      {comment.profiles?.name?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-white/60 border border-black/5 rounded-[20px] p-3 px-4 relative group">
                      <div className="flex justify-between items-start">
                        <h5 className="text-[11px] font-bold text-[#0f0f10]">{comment.profiles?.name || "Anonymous"}</h5>
                        {comment.user_id === user_id && (
                          <button 
                            onClick={() => handleDeleteComment(comment.id)} 
                            className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100"
                            title="Delete comment"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-neutral-800 mt-1">{comment.comment}</p>
                    </div>
                    <div className="flex gap-2 mt-1 ml-2">
                      <span className="text-[10px] text-neutral-500">Just now</span>
                      <span className="text-[10px] text-neutral-400">&middot;</span>
                      <span className="text-[10px] text-neutral-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
