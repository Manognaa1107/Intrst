"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Star,
  MessageSquare,
  AlertTriangle,
  Flag,
  Plus,
  Sparkles,
  ArrowUpDown,
  BookOpen,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface Review {
  id: string;
  professor_name: string;
  department: string;
  rating: number;
  difficulty: number;
  content: string;
  is_anonymous: boolean;
  author_name?: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  reported: boolean;
  user_voted?: 'up' | 'down' | null;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    professor_name: "Dr. Ramesh Kumar",
    department: "Computer Science",
    rating: 5,
    difficulty: 3,
    content: "Excellent professor! His lectures on Algorithms are clear and engaging. The exams are quite challenging but very fair. If you attend office hours, he explains concepts with great patience. Highly recommended for CS majors.",
    is_anonymous: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 18,
    downvotes: 1,
    reported: false
  },
  {
    id: "rev-2",
    professor_name: "Prof. Sarah Jenkins",
    department: "Mathematics",
    rating: 2,
    difficulty: 5,
    content: "Extremely difficult grading system. Lectures are mostly proofs and move too fast to take useful notes. Homework assignments take 10+ hours a week. Make sure you read the textbook ahead of time or you will get lost easily.",
    is_anonymous: false,
    author_name: "Alex Rivera",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 32,
    downvotes: 4,
    reported: false
  },
  {
    id: "rev-3",
    professor_name: "Dr. Amit Patel",
    department: "Physics",
    rating: 4,
    difficulty: 4,
    content: "Dr. Patel is passionate about Physics and incorporates a lot of real-world examples. However, his exams require a deep understanding of concepts beyond just memorizing equations. Study hard and you can get an A.",
    is_anonymous: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 14,
    downvotes: 2,
    reported: false
  }
];

export default function ProfessorReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [user, setUser] = useState<any>(null);

  // Form State
  const [professorName, setProfessorName] = useState("");
  const [department, setDepartment] = useState("Computer Science");
  const [rating, setRating] = useState(5);
  const [difficulty, setDifficulty] = useState(3);
  const [reviewContent, setReviewContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load reviews from localStorage or set initial
  useEffect(() => {
    const stored = localStorage.getItem("professor_reviews");
    if (stored) {
      try {
        setReviews(JSON.parse(stored));
      } catch (e) {
        setReviews(INITIAL_REVIEWS);
      }
    } else {
      setReviews(INITIAL_REVIEWS);
      localStorage.setItem("professor_reviews", JSON.stringify(INITIAL_REVIEWS));
    }

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };
    checkUser();
  }, []);

  const saveReviews = (updated: Review[]) => {
    setReviews(updated);
    localStorage.setItem("professor_reviews", JSON.stringify(updated));
  };

  const handleVote = (id: string, type: 'up' | 'down') => {
    const updated = reviews.map(r => {
      if (r.id !== id) return r;

      let upDelta = 0;
      let downDelta = 0;
      let newVote: 'up' | 'down' | null = type;

      if (r.user_voted === type) {
        // Undo vote
        if (type === 'up') upDelta = -1;
        if (type === 'down') downDelta = -1;
        newVote = null;
      } else {
        // Toggle vote
        if (r.user_voted === 'up') upDelta = -1;
        if (r.user_voted === 'down') downDelta = -1;

        if (type === 'up') upDelta += 1;
        if (type === 'down') downDelta += 1;
      }

      return {
        ...r,
        upvotes: Math.max(0, r.upvotes + upDelta),
        downvotes: Math.max(0, r.downvotes + downDelta),
        user_voted: newVote
      };
    });
    saveReviews(updated);
  };

  const handleReport = (id: string) => {
    const updated = reviews.map(r => {
      if (r.id === id) {
        return { ...r, reported: true };
      }
      return r;
    });
    saveReviews(updated);
    toast.success("Review reported", {
      description: "Our moderators will review this submission within 24 hours."
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!professorName.trim()) {
      return toast.error("Please enter a professor name.");
    }
    if (reviewContent.trim().length < 50) {
      return toast.error("Review must be at least 50 characters long.", {
        description: `Current length: ${reviewContent.trim().length} characters.`
      });
    }

    setIsSubmitting(true);

    try {
      const newReview: Review = {
        id: `rev-${Date.now()}`,
        professor_name: professorName.trim(),
        department,
        rating,
        difficulty,
        content: reviewContent.trim(),
        is_anonymous: isAnonymous,
        author_name: isAnonymous ? undefined : (user?.email?.split('@')[0] || "Student"),
        created_at: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        reported: false
      };

      const updated = [newReview, ...reviews];
      saveReviews(updated);

      toast.success("Review submitted!", {
        description: "Thank you for sharing your feedback anonymously."
      });

      // Reset form
      setProfessorName("");
      setReviewContent("");
      setRating(5);
      setDifficulty(3);
      setIsAnonymous(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtering reviews
  const filteredReviews = reviews.filter(r => {
    if (r.reported) return false; // Hide reported reviews in UI

    const matchesSearch =
      r.professor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.content.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (ratingFilter === "high") return r.rating >= 4;
    if (ratingFilter === "low") return r.rating <= 2;
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-dmserif font-bold text-[#0f0f10] flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-[#855300]" />
          Professor Reviews
        </h1>
        <p className="text-neutral-500">
          Share and view anonymous ratings and course experiences for university faculty.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Submit a Review Form */}
        <div className="lg:col-span-4">
          <Card className="p-6 bg-white border border-black/5 rounded-2xl shadow-sm sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#855300]/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#855300]" />
              </div>
              <h2 className="font-dmserif font-bold text-lg text-[#0f0f10]">Write a Review</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Professor Name</label>
                <Input
                  type="text"
                  value={professorName}
                  onChange={(e) => setProfessorName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Kumar"
                  className="bg-[#faf9f6] border border-black/5 rounded-xl text-[#0f0f10] placeholder-neutral-400 h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#faf9f6] border border-black/5 rounded-xl text-[#0f0f10] h-10 px-3 text-sm outline-none focus:border-neutral-300"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Business & Finance">Business & Finance</option>
                  <option value="Humanities">Humanities</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Rating (1-5)</label>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-0.5 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? "fill-[#855300] text-[#855300]" : "text-neutral-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Difficulty (1-5)</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(Number(e.target.value))}
                    className="w-full bg-[#faf9f6] border border-black/5 rounded-xl text-[#0f0f10] h-10 px-3 text-sm outline-none focus:border-neutral-300 mt-0.5"
                  >
                    <option value="1">1 - Very Easy</option>
                    <option value="2">2 - Easy</option>
                    <option value="3">3 - Moderate</option>
                    <option value="4">4 - Hard</option>
                    <option value="5">5 - Extreme</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Course Review</label>
                  <span className={`text-[10px] font-bold ${reviewContent.trim().length >= 50 ? "text-emerald-600" : "text-amber-700"}`}>
                    {reviewContent.trim().length} / 50 min chars
                  </span>
                </div>
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Share details about grading, homework load, classroom style, and exams (minimum 50 characters)..."
                  className="w-full h-32 bg-[#faf9f6] border border-black/5 rounded-xl p-3 text-sm text-[#0f0f10] placeholder-neutral-400 resize-none outline-none focus:border-neutral-300"
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="anonymous-review"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 accent-black rounded border-black/5"
                />
                <label htmlFor="anonymous-review" className="text-xs font-semibold text-neutral-600 cursor-pointer select-none">
                  Submit anonymously
                </label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-[#505f78] text-white rounded-xl font-semibold h-11 transition-all"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column: Reviews List & Filters */}
        <div className="lg:col-span-8 space-y-6">

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white border border-black/5 p-4 rounded-2xl shadow-sm">
            <div className="relative w-full sm:max-w-xs text-neutral-400 focus-within:text-black">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search professor or dept..."
                className="pl-9 bg-[#faf9f6] border border-black/5 rounded-xl text-sm h-10 w-full placeholder-neutral-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider shrink-0">Filter:</span>
              {[
                { key: "all", label: "All Reviews" },
                { key: "high", label: "High Rated (4-5★)" },
                { key: "low", label: "Low Rated (1-2★)" }
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setRatingFilter(opt.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${ratingFilter === opt.key
                      ? "bg-black text-white"
                      : "bg-[#faf9f6] text-neutral-500 hover:bg-neutral-100 border border-black/5"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews Stream */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <Card className="p-12 flex flex-col items-center justify-center bg-white border border-black/5 border-dashed text-center rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-[#855300]">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-dmserif font-bold text-[#0f0f10] mb-1">No Reviews Found</h3>
                <p className="text-sm text-neutral-500 max-w-sm">No professor reviews match your search or filters. Be the first to add one!</p>
              </Card>
            ) : (
              filteredReviews.map((rev) => (
                <Card key={rev.id} className="p-5 bg-white border border-black/5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-3">

                    {/* Top Row: Info & Stats */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-dmserif font-bold text-lg text-[#0f0f10] hover:text-[#855300] transition-colors leading-snug">
                          {rev.professor_name}
                        </h3>
                        <p className="text-xs text-neutral-500 font-semibold mt-0.5">{rev.department}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 bg-[#855300]/10 px-2 py-0.5 rounded-md">
                          <Star className="w-3.5 h-3.5 fill-[#855300] text-[#855300]" />
                          <span className="text-xs font-bold text-[#855300]">{rev.rating}.0</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                          Diff: {rev.difficulty}/5
                        </span>
                      </div>
                    </div>

                    {/* Review content */}
                    <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                      {rev.content}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-black/5 text-[11px] text-neutral-400 gap-2">
                      <div className="flex items-center gap-2">
                        <span>
                          {rev.is_anonymous ? "Submitted anonymously" : `By ${rev.author_name}`}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(rev.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 border border-black/5 bg-[#faf9f6] rounded-xl px-2 py-1">
                          <button
                            onClick={() => handleVote(rev.id, 'up')}
                            className={`p-0.5 rounded-md hover:bg-neutral-100 transition-colors ${rev.user_voted === 'up' ? 'text-emerald-600' : 'text-neutral-500'}`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-[#0f0f10] text-[10px] min-w-[8px] text-center">
                            {rev.upvotes - rev.downvotes}
                          </span>
                          <button
                            onClick={() => handleVote(rev.id, 'down')}
                            className={`p-0.5 rounded-md hover:bg-neutral-100 transition-colors ${rev.user_voted === 'down' ? 'text-red-500' : 'text-neutral-500'}`}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleReport(rev.id)}
                          className="flex items-center gap-1 font-bold text-neutral-400 hover:text-red-500 transition-colors py-1"
                        >
                          <Flag className="w-3 h-3" />
                          Report
                        </button>
                      </div>
                    </div>

                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
