"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/UserContext";
import {
  SparkleIcon, ArrowRightIcon, ArrowLeftIcon,
  BrainIcon, HeartIcon, ZapIcon
} from "lucide-react";
import { motion } from "framer-motion";

// ─── Interest palette ─────────────────────────────────────────────────────────
const INTEREST_GROUPS = [
  {
    label: "Arts & Expression", emoji: "🎨",
    items: ["Photography", "Music", "Poetry", "Design", "Film", "Art", "Open Mic", "Writing", "Fashion", "Tattoos", "Sculpture"]
  },
  {
    label: "Tech & Mind", emoji: "💡",
    items: ["Coding", "AI / ML", "Startups", "Finance", "Psychology", "Philosophy", "Robotics", "Chess", "Cybersecurity", "UX/UI", "Web3"]
  },
  {
    label: "Social & Culture", emoji: "🌐",
    items: ["Debate", "Memes", "Anime", "Gaming", "Esports", "Books", "Cafe Hopping", "Night Owls", "K-Drama", "Stand-up", "Volunteering"]
  },
  {
    label: "Body & Movement", emoji: "⚡",
    items: ["Fitness", "Football", "Cricket", "Hiking", "Yoga", "Dance", "Cycling", "Badminton", "Swimming", "Basketball", "Skating"]
  },
  {
    label: "Lifestyle & Energy", emoji: "✨",
    items: ["Cooking", "Travel", "Journaling", "Sustainability", "Thrifting", "Plant Parent", "Astrology", "Spirituality", "Minimalism", "Early Bird", "Coffee Enthusiast"]
  },
];

// ─── Personality teaser descriptions ─────────────────────────────────────────
function TeaserSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-[#ece9e3] rounded-full w-2/3 mx-auto" />
      <div className="h-4 bg-black/5 rounded-full w-full" />
      <div className="h-4 bg-black/5 rounded-full w-4/5 mx-auto" />
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[1, 2, 3].map(i => <div key={i} className="h-16 bg-black/5 rounded-xl" />)}
      </div>
    </div>
  );
}

const buttonClickInteraction = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.98, y: 0 },
  transition: { type: "spring" as const, stiffness: 400, damping: 15 }
};

export default function DiscoverPage() {
  const router = useRouter();
  const [step, setStep] = useState<"interests" | "questions" | "reveal">("interests");
  const [selected, setSelected] = useState<string[]>([]);
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3: "" });
  const [loading, setLoading] = useState(false);
  const [aiProfile, setAiProfile] = useState<null | {
    personalityType: string;
    vibe: string;
    matchStyle: string;
    compatibleWith: string[];
    matchCodename: string;
    icebreaker: string;
    strengths: string[];
    peopleLookingFor: string;
  }>(null);
  const [isFallback, setIsFallback] = useState(false);

  const { setInterests: setGlobalInterests, setAiProfile: setGlobalAiProfile } = useUser();

  const toggle = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const runAI = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests: selected, answers }),
      });
      const data = await res.json();
      setAiProfile(data.profile);
      setIsFallback(!!data.fallback);
    } catch {
      setAiProfile({
        personalityType: "The Curious Explorer",
        vibe: "Someone who finds meaning in small details and deep conversations.",
        matchStyle: "You connect slowly but deeply, preferring real over small talk.",
        compatibleWith: ["Creative pursuits", "Intellectual curiosity", "Late-night adventures"],
        matchCodename: "Ember",
        icebreaker: "What's a hobby you picked up that completely changed how you see the world?",
        strengths: ["Deep listener", "Creative thinker", "Genuine connector"],
        peopleLookingFor: "Someone who stays curious and doesn't mind a bit of chaos.",
      });
      setIsFallback(true);
    }
    setLoading(false);
    setStep("reveal");
  };

  const handleNext = () => {
    if (step === "interests" && selected.length >= 3) {
      setStep("questions");
    } else if (step === "questions") {
      runAI();
    }
  };

  const proceed = () => {
    setGlobalInterests(selected);
    if (aiProfile) setGlobalAiProfile(aiProfile);
    router.push("/signup");
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: "#faf9f6" }}>
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
        <div className="absolute -right-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
      </div>

      {/* Nav */}
      <header className="flex justify-between items-center px-6 py-5 z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold text-sm">
            i
          </div>
          <span className="text-lg font-bold tracking-tight text-[#0f0f10]">intrst</span>
        </Link>
        <Link href="/signup" className="text-xs font-bold text-[#505f78] hover:text-black transition-colors">
          Skip →
        </Link>
      </header>

      <div className="flex-1 flex flex-col items-center justify-start z-10 px-4 pb-16 pt-4">
        <div className="w-full max-w-2xl">

          {/* ─── Step 1: Interests ─────────────────────────────────────────── */}
          {step === "interests" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/5 shadow-sm text-neutral-600 text-xs font-semibold uppercase tracking-wider mb-2">
                  <SparkleIcon className="w-3.5 h-3.5 text-[#505f78]" />
                  DISCOVER YOUR PEOPLE
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0f0f10] leading-[1.1] mb-2">
                  What makes you, <span className="bg-gradient-to-r from-[#505f78] to-[#855300] bg-clip-text text-transparent font-serif italic font-normal pr-1 inline-block">you?</span>
                </h1>
                <p className="text-base text-neutral-500 max-w-md mx-auto leading-relaxed">
                  Pick everything that resonates. Our AI uses this to build your match profile — before you even sign up.
                </p>
              </div>

              <div className="space-y-5">
                {INTEREST_GROUPS.map((group) => (
                  <div key={group.label}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base">{group.emoji}</span>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{group.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => {
                        const isSelected = selected.includes(item);
                        return (
                          <button
                            key={item}
                            onClick={() => toggle(item)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border ${isSelected
                              ? "bg-black text-white border-black hover:bg-[#505f78] shadow-sm"
                              : "bg-white border border-black/10 text-neutral-600 hover:border-black/30 hover:text-black shadow-sm"
                              }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="sticky bottom-6 pt-6">
                <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl border border-black/5 rounded-2xl px-5 py-4 shadow-md">
                  <div>
                    <span className="text-[#0f0f10] font-bold text-xs">{selected.length} selected</span>
                    {selected.length < 3 && (
                      <span className="text-neutral-400 text-xs ml-2 font-medium">(pick at least 3)</span>
                    )}
                  </div>
                  <motion.div {...buttonClickInteraction}>
                    <Button
                      onClick={handleNext}
                      disabled={selected.length < 3}
                      className="bg-black text-white hover:bg-[#505f78] disabled:opacity-40 font-bold rounded-full px-6 h-10 text-xs shadow-sm flex items-center gap-2 transition-all"
                    >
                      Continue <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Step 2: Personal Questions ──────────────────────────────── */}
          {step === "questions" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/5 shadow-sm text-neutral-600 text-xs font-semibold uppercase tracking-wider mb-2">
                  <BrainIcon className="w-3.5 h-3.5 text-[#505f78]" />
                  3 QUICK ONES
                </div>
                <h1 className="text-4xl font-bold text-[#0f0f10]">
                  Tell us a little more.
                </h1>
                <p className="text-base text-neutral-500 max-w-md mx-auto leading-relaxed">
                  Optional, but the AI gets <span className="text-black font-bold">much better</span> with these. Never shown publicly.
                </p>
              </div>

              <div className="space-y-5">
                {[
                  {
                    key: "q1" as const,
                    q: "What's something most people don't know about you?",
                    hint: "The thing that changes how people see you once they know..."
                  },
                  {
                    key: "q2" as const,
                    q: "What are you actually trying to figure out right now?",
                    hint: "Career, identity, relationships, purpose — any of it works"
                  },
                  {
                    key: "q3" as const,
                    q: "What kind of person do you naturally click with?",
                    hint: "Energy, interests, communication style — describe the vibe"
                  },
                ].map(({ key, q, hint }) => (
                  <div key={key} className="space-y-2">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">{q}</label>
                    <button className="hidden" /> {/* wrapper */}
                    <Textarea
                      placeholder={hint}
                      value={answers[key]}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [key]: e.target.value }))}
                      maxLength={200}
                      className="min-h-[90px] bg-white border border-black/10 focus-visible:border-black focus-visible:ring-black text-black placeholder:text-neutral-300 rounded-xl text-sm resize-none font-medium p-3"
                    />
                    <p className="text-[10px] text-right text-neutral-400 font-bold uppercase tracking-wider">{answers[key].length}/200</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <motion.div {...buttonClickInteraction}>
                  <Button
                    variant="outline"
                    onClick={() => setStep("interests")}
                    className="h-12 px-6 border-black/10 bg-white text-black hover:bg-[#f3f1eb] font-bold rounded-full text-xs shadow-sm flex items-center gap-2"
                  >
                    <ArrowLeftIcon className="w-3.5 h-3.5" /> Back
                  </Button>
                </motion.div>

                <motion.div {...buttonClickInteraction} className="flex-1">
                  <Button
                    onClick={handleNext}
                    className="w-full h-12 bg-black hover:bg-[#505f78] text-white font-bold rounded-full text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <ZapIcon className="w-3.5 h-3.5" />
                    Analyse My Vibe
                  </Button>
                </motion.div>
              </div>
            </div>
          )}

          {/* ─── Step 3: AI Reveal ───────────────────────────────────────── */}
          {(step === "reveal" || loading) && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-700 text-xs font-bold tracking-wider mb-2">
                  <SparkleIcon className="w-3.5 h-3.5" />
                  {loading ? "AI IS THINKING..." : "YOUR VIBE PROFILE"}
                </div>
                <h1 className="text-4xl font-bold text-[#0f0f10]">
                  {loading ? "Crunching your personality..." : "Here's what the AI sees."}
                </h1>
                {!loading && (
                  <p className="text-neutral-500 text-base font-semibold leading-relaxed">
                    This is how our algorithm will find your people.
                  </p>
                )}
              </div>

              {loading && <TeaserSkeleton />}

              {!loading && aiProfile && (
                <div className="space-y-5">
                  {isFallback && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-amber-700 text-xs text-center font-semibold">
                      ⚠️ Live AI analysis is temporarily simulated. Showing sample profile.
                    </div>
                  )}

                  {/* Personality Type + Codename */}
                  <Card className="bg-white border border-black/5 rounded-3xl overflow-hidden relative shadow-sm">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#505f78] to-[#855300]" />
                    <div className="p-7 text-center space-y-4">
                      {/* Anonymous avatar */}
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-black to-[#505f78] flex items-center justify-center shadow-sm">
                        <svg viewBox="0 0 50 50" className="w-8 h-8 fill-white/80">
                          <polygon points="25,4 48,43 2,43" />
                          <circle cx="25" cy="25" r="9" className="fill-white/20" />
                        </svg>
                      </div>

                      <div>
                        <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">
                          Your Match Codename
                        </div>
                        <div className="text-3xl font-bold text-[#0f0f10]">{aiProfile.matchCodename}</div>
                      </div>

                      <div className="bg-neutral-50 border border-black/5 rounded-2xl px-5 py-4">
                        <div className="text-lg font-bold text-[#505f78] mb-1">{aiProfile.personalityType}</div>
                        <p className="text-neutral-500 text-sm leading-relaxed font-medium">{aiProfile.vibe}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Match style + Strengths */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="bg-white border border-black/5 rounded-2xl p-5 space-y-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <HeartIcon className="w-4 h-4 text-rose-600" />
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">How you connect</span>
                      </div>
                      <p className="text-neutral-700 text-xs font-semibold leading-relaxed">{aiProfile.matchStyle}</p>
                    </Card>

                    <Card className="bg-white border border-black/5 rounded-2xl p-5 space-y-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <ZapIcon className="w-4 h-4 text-[#855300]" />
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Your strengths</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {aiProfile.strengths.map((s, i) => (
                          <span key={i} className="text-[10px] bg-amber-500/10 text-amber-700 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">{s}</span>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Compatible with */}
                  <Card className="bg-white border border-black/5 rounded-2xl p-5 space-y-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <SparkleIcon className="w-4 h-4 text-[#505f78]" />
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">You&apos;ll click over</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {aiProfile.compatibleWith.map((c, i) => (
                        <span key={i} className="text-xs bg-[#ece9e3] text-[#505f78] border border-black/5 px-3 py-1.5 rounded-full font-semibold">{c}</span>
                      ))}
                    </div>
                  </Card>

                  {/* Icebreaker */}
                  <Card className="bg-gradient-to-r from-[#505f78]/10 to-[#855300]/5 border border-black/5 rounded-2xl p-6 space-y-2">
                    <div className="text-[10px] font-bold text-[#505f78] uppercase tracking-widest">Your AI Icebreaker</div>
                    <p className="text-[#0f0f10] text-base italic leading-relaxed font-serif">&ldquo;{aiProfile.icebreaker}&rdquo;</p>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">This is how your anonymous match will open the conversation.</p>
                  </Card>

                  {/* People looking for */}
                  <Card className="bg-white border border-black/5 rounded-2xl p-5 space-y-2 shadow-sm">
                    <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">You&apos;re looking for</div>
                    <p className="text-neutral-600 text-xs font-semibold leading-relaxed">{aiProfile.peopleLookingFor}</p>
                  </Card>

                  {/* Selected interests summary */}
                  <div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">
                      Your interests ({selected.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selected.map(tag => (
                        <span key={tag} className="text-xs bg-white border border-black/10 text-neutral-600 px-3 py-1 rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="space-y-3 pt-2">
                    <motion.div {...buttonClickInteraction}>
                      <Button
                        onClick={proceed}
                        className="w-full h-12 text-xs font-bold rounded-full bg-black text-white hover:bg-[#505f78] shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        Claim My Spot on intrst <ArrowRightIcon className="w-4 h-4" />
                      </Button>
                    </motion.div>
                    <p className="text-[10px] text-center text-neutral-400 font-bold uppercase tracking-wider">
                      Your profile will be pre-filled with these interests. Verified students only.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
