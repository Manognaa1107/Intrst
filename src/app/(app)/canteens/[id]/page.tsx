"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  ArrowLeft,
  Clock,
  Menu,
  MessageSquare,
  ChevronRight,
  Send,
  Quote,
  TrendingUp,
  AlertCircle,
  Trash2,
  Edit2
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { apiFetch } from "@/lib/apiClient";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";

const buttonClickInteraction = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.98, y: 0 },
  transition: { type: "spring" as const, stiffness: 400, damping: 15 }
};

export default function CanteenDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { role: userRole, user_id } = useUser();
  const [canteen, setCanteen] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const canManageCanteen = userRole === 'super_admin' || userRole === 'founder' || userRole === 'junior_moderator' || userRole === 'moderator';

  const fetchCanteen = async () => {
    try {
      const data = await apiFetch(`/canteens/${id}`);
      setCanteen(data);
      setEditForm({ name: data.name, description: data.description, location: data.location });
    } catch (err) {
      console.error("Failed to fetch canteen:", err);
      toast.error("Error loading canteen details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCanteen();
  }, [id]);

  const handleSubmitReview = async () => {
    if (rating === 0) return toast.error("Please select a rating");
    if (!review.trim()) return toast.error("Please add a comment");

    setIsSubmitting(true);
    try {
      await apiFetch(`/canteens/${id}/review`, {
        method: 'POST',
        body: JSON.stringify({
          rating,
          comment: review,
          is_anonymous: isAnonymous
        })
      });
      toast.success("Review submitted! You earned 1 point.");
      setReview("");
      setRating(0);
      fetchCanteen();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await apiFetch(`/canteens/review/${reviewId}`, { method: 'DELETE' });
      toast.success("Review deleted successfully");
      fetchCanteen();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete review");
    }
  };

  const handleDeleteCanteen = async () => {
    if (!confirm("Are you sure you want to delete this canteen? This action cannot be undone.")) return;
    try {
      await apiFetch(`/admin/canteens/${id}`, { method: 'DELETE' });
      toast.success("Canteen deleted successfully");
      router.push("/canteens");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete canteen");
    }
  };

  const handleEditCanteen = async () => {
    try {
      await apiFetch(`/admin/canteens/${id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });
      toast.success("Canteen updated successfully");
      setIsEditing(false);
      fetchCanteen();
    } catch (err: any) {
      toast.error(err.message || "Failed to update canteen");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#505f78] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!canteen) return <div className="p-20 text-center text-neutral-500 font-medium">Canteen not found</div>;

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-12 animate-in fade-in duration-700 bg-background">
      {/* Back Button & Header Actions */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <motion.div {...buttonClickInteraction}>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="w-fit rounded-full h-10 px-5 border border-black/10 bg-white text-black hover:bg-[#f3f1eb] font-bold flex items-center gap-2 shadow-sm transition-all text-xs"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Listings
            </Button>
          </motion.div>

          {canManageCanteen && (
            <div className="flex gap-2">
              <Button onClick={() => setIsEditing(true)} variant="outline" className="border-black/10 rounded-full h-10 px-5 text-xs font-bold hover:bg-[#f3f1eb] transition-all text-black">
                <Edit2 className="w-3.5 h-3.5 mr-2 text-[#505f78]" /> Edit Details
              </Button>
              <Button onClick={handleDeleteCanteen} variant="destructive" className="rounded-full h-10 px-5 text-xs font-bold transition-all">
                <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Canteen
              </Button>
            </div>
          )}
        </div>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-8 border-b border-black/5 pb-8">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-4">
              <Badge className="bg-[#ece9e3] text-neutral-700 border-black/5 rounded-full px-4 h-8 uppercase tracking-widest text-[9px] font-bold">
                {canteen.average_rating > 4 ? "Student Favorite" : "Daily Classic"}
              </Badge>
              <div className="flex items-center gap-2 text-neutral-500 font-semibold text-sm">
                <MapPin className="w-4 h-4 text-[#505f78]" /> {canteen.location}
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-dmserif font-bold tracking-tight text-[#0f0f10] leading-tight">
              {canteen.name}
            </h1>

            <p className="text-neutral-500 text-base max-w-3xl font-medium leading-relaxed">
              {canteen.description || "The heart of campus dining. Authenticated student reviews and the most accurate menus for this outlet."}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Canteen Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-black/5 rounded-[2rem] p-6 shadow-2xl relative">
            <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-black font-bold">✕</button>
            <h3 className="text-xl font-dmserif font-bold text-[#0f0f10] mb-4">Edit Canteen</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block w-full">Name</label>
                <input
                  className="w-full bg-neutral-50 border border-black/10 rounded-xl px-4 py-2.5 mt-1 focus:bg-white text-xs outline-none focus:border-black transition-all text-neutral-800"
                  value={editForm.name || ""}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block w-full">Location</label>
                <input
                  className="w-full bg-neutral-50 border border-black/10 rounded-xl px-4 py-2.5 mt-1 focus:bg-white text-xs outline-none focus:border-black transition-all text-neutral-800"
                  value={editForm.location || ""}
                  onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block w-full">Description</label>
                <textarea
                  className="w-full bg-neutral-50 border border-black/10 rounded-xl px-4 py-2.5 mt-1 focus:bg-white text-xs outline-none focus:border-black transition-all text-neutral-800 h-20 resize-none"
                  value={editForm.description || ""}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <Button onClick={handleEditCanteen} className="w-full bg-black hover:bg-[#505f78] text-white rounded-full h-11 text-xs font-bold shadow-sm mt-2">Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Layout */}
      <Tabs defaultValue="menu" className="w-full">
        <TabsList className="bg-[#faf9f6] border border-black/5 p-1 rounded-xl mb-8 flex w-full max-w-md">
          <TabsTrigger value="menu" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#0f0f10] text-neutral-500 rounded-lg py-2 font-semibold text-sm">
            Details & Menu
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#0f0f10] text-neutral-500 rounded-lg py-2 font-semibold text-sm">
            Student Reviews ({canteen.review_count || 0})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Details & Menu */}
        <TabsContent value="menu" className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Menu Highlights */}
            <div className="lg:col-span-2">
              <Card className="rounded-[2rem] bg-white border border-black/5 overflow-hidden shadow-sm">
                <CardHeader className="p-8 border-b border-black/5 bg-neutral-50/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-[#ece9e3] text-[#505f78]">
                      <Menu className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-dmserif font-bold text-[#0f0f10]">The Menu Highlights</CardTitle>
                      <CardDescription className="text-neutral-500 text-sm">Student recommended items and price points.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {canteen.menu && canteen.menu.length > 0 ? (
                      canteen.menu.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-black/5 group hover:border-black/10 hover:bg-white transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#ece9e3] text-[#505f78] flex items-center justify-center font-bold text-xs">{idx + 1}</div>
                            <span className="font-bold text-sm text-[#0f0f10]">{item}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-10 text-neutral-500 font-medium italic text-sm">Menu data is being finalized by students</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar: Hours & Hygiene */}
            <div className="space-y-6">
              <Card className="rounded-[2rem] bg-white border border-black/5 p-8 space-y-6 overflow-hidden relative shadow-sm">
                <div className="flex items-center gap-2.5 text-[#505f78] font-bold uppercase tracking-widest text-xs">
                  <Clock className="w-4 h-4" /> Operational Hours
                </div>
                <div className="space-y-4 relative z-10 font-semibold text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500">Mon - Fri</span>
                    <span className="text-[#0f0f10]">8:30 AM - 7:30 PM</span>
                  </div>
                  <div className="flex justify-between items-center opacity-70">
                    <span className="text-neutral-500">Saturday</span>
                    <span className="text-[#0f0f10]">9:30 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center text-rose-600">
                    <span>Sunday</span>
                    <span className="uppercase tracking-widest text-[9px] font-bold">Closed</span>
                  </div>
                </div>
              </Card>

              <Card className="rounded-[2rem] bg-white border border-black/5 p-8 space-y-6 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-dmserif font-bold text-[#0f0f10]">Hygiene Report</h3>
                <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                  Notice anything off? Reporting hygiene issues anonymously sends an instant alert to the platform curators.
                </p>
                <Button variant="outline" className="w-full rounded-full h-11 border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs">Report Anonymously</Button>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Student Reviews */}
        <TabsContent value="reviews" className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left: Write Review & Reviews List */}
            <div className="lg:col-span-2 space-y-8">
              {/* Add Review Box */}
              <Card className="rounded-[2rem] bg-white border border-black/5 overflow-hidden shadow-sm">
                <CardContent className="p-8 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-lg font-dmserif font-bold text-[#0f0f10]">How was your meal?</h3>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => setRating(s)}
                          className="focus:outline-none transition-transform active:scale-90"
                        >
                          <Star className={`w-6 h-6 ${rating >= s ? 'text-[#855300] fill-[#855300]' : 'text-neutral-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Tell the truth... how was the wait? the taste? the hygiene?"
                    className="w-full bg-[#faf9f6] border border-black/10 rounded-2xl p-5 h-36 outline-none focus:border-black focus:bg-white transition-all text-neutral-850 text-sm font-medium resize-none"
                  />

                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsAnonymous(!isAnonymous)}
                        className={`w-10 h-5.5 rounded-full transition-colors relative ${isAnonymous ? 'bg-black' : 'bg-neutral-200'}`}
                        style={{ width: "40px", height: "22px" }}
                      >
                        <div className={`absolute top-[3px] w-4 h-4 bg-white rounded-full transition-all ${isAnonymous ? 'left-[21px]' : 'left-[3px]'}`} />
                      </button>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Post Anonymously</span>
                    </div>
                    <motion.div {...buttonClickInteraction}>
                      <Button
                        onClick={handleSubmitReview}
                        disabled={isSubmitting}
                        className="bg-black hover:bg-[#505f78] text-white rounded-full px-8 h-11 text-xs font-bold shadow-sm gap-2"
                      >
                        {isSubmitting ? "Submitting..." : "Drop the Review"}
                        <Send className="w-3.5 h-3.5" />
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="space-y-6">
                {canteen.canteen_reviews && canteen.canteen_reviews.length > 0 ? (
                  canteen.canteen_reviews.map((rev: any) => {
                    const isAuthor = user_id === rev.user_id;
                    const isPrivileged = userRole === 'super_admin' || userRole === 'founder' || userRole === 'moderator';
                    const canDelete = isAuthor || isPrivileged;

                    return (
                      <Card key={rev.id} className="rounded-[2rem] bg-white border border-black/5 hover:border-black/10 hover:shadow-sm transition-all p-8 space-y-6 relative group">
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="absolute top-6 right-6 p-2 rounded-full bg-rose-50 text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-100"
                            title="Delete Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12 border border-black/5">
                              {rev.is_anonymous ? (
                                <AvatarFallback className="bg-[#ece9e3] text-[#505f78] font-bold text-sm">A</AvatarFallback>
                              ) : (
                                <>
                                  <AvatarImage src={rev.profiles?.profile_image_url} />
                                  <AvatarFallback className="bg-[#ece9e3] text-[#505f78] font-bold uppercase text-sm">{rev.profiles?.name?.[0] || '?'}</AvatarFallback>
                                </>
                              )}
                            </Avatar>
                            <div>
                              <div className="font-bold text-sm text-[#0f0f10]">{rev.is_anonymous ? "Anonymous Student" : rev.profiles?.name}</div>
                              <div className="text-[11px] text-neutral-400 font-semibold">{new Date(rev.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-[#f7f5f0] px-3.5 py-1.5 rounded-full border border-[#855300]/20 mr-10">
                            <Star className="w-3.5 h-3.5 text-[#855300] fill-[#855300]" />
                            <span className="font-bold text-xs text-[#855300]">{rev.rating}</span>
                          </div>
                        </div>
                        <div className="relative">
                          <Quote className="absolute -left-6 -top-4 w-10 h-10 text-neutral-105 rotate-180 opacity-40" />
                          <p className="text-base text-neutral-700 leading-relaxed font-serif italic pl-4 pr-6">
                            {rev.comment}
                          </p>
                        </div>
                        {rev.tips && (
                          <div className="pt-4 border-t border-black/5 flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                              <TrendingUp className="w-3.5 h-3.5" />
                            </div>
                            <p className="text-xs font-semibold text-emerald-700"><span className="font-bold uppercase tracking-widest text-[9px] mr-2">Top Tip</span> {rev.tips}</p>
                          </div>
                        )}
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-black/5">
                    <div className="text-neutral-400 font-semibold text-sm">No reviews yet. Be the first to tell the truth!</div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Truth Rating Aggregation */}
            <div>
              <Card className="rounded-[2rem] bg-white border border-black/5 p-8 shadow-sm sticky top-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400">Truth Rating</div>
                  <TrendingUp className="w-5 h-5 text-[#855300]" />
                </div>
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-7xl font-bold text-[#855300] leading-none">{canteen.average_rating || 0}</span>
                  <span className="text-xl font-medium text-neutral-400 mb-1">/5.0</span>
                </div>
                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-neutral-500">Student Satisfaction</span>
                    <span className="text-[#0f0f10]">{(canteen.average_rating * 20).toFixed(0)}%</span>
                  </div>
                  <Progress value={canteen.average_rating * 20} className="h-2 bg-[#ece9e3]" />
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider pt-2">Based on {canteen.review_count || 0} verified reviews</div>
                </div>
              </Card>
            </div>

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
