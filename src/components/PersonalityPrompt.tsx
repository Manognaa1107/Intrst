"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Compass, Users, ChevronRight, Zap, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/apiClient";
import { toast } from "sonner";

interface Question {
  id: string;
  text: string;
  options: { label: string; value: string; icon: any }[];
}

const QUESTIONS: Question[] = [
  {
    id: "weekend",
    text: "How do you recharge after a chaotic week?",
    options: [
      { label: "Solitary flow state", value: "Introvert", icon: Brain },
      { label: "High intensity crowd", value: "Extrovert", icon: Users },
    ]
  },
  {
    id: "campus_spot",
    text: "Where are we most likely to find you?",
    options: [
      { label: "A quiet library corner", value: "Academic", icon: Compass },
      { label: "The loudest canteen", value: "Socialite", icon: Coffee },
    ]
  },
  {
    id: "decision_style",
    text: "When making a choice, you follow your...",
    options: [
      { label: "Logical patterns", value: "Rational", icon: Zap },
      { label: "Gut feeling", value: "Intuitive", icon: Sparkles },
    ]
  }
];

export function PersonalityPrompt({ user_id, onComplete }: { user_id: string, onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<any>({});
  const [isFinishing, setIsFinishing] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedStep = localStorage.getItem("personality_step");
    const savedResponses = localStorage.getItem("personality_responses");
    if (savedStep) setStep(parseInt(savedStep));
    if (savedResponses) setResponses(JSON.parse(savedResponses));
  }, []);

  // Save to localStorage whenever progress changes
  useEffect(() => {
    if (step > 0) localStorage.setItem("personality_step", step.toString());
    if (Object.keys(responses).length > 0) {
      localStorage.setItem("personality_responses", JSON.stringify(responses));
    }
  }, [step, responses]);

  const handleSelect = (value: string) => {
    const newResponses = { ...responses, [QUESTIONS[step].id]: value };
    setResponses(newResponses);
    
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      finishProfile(newResponses);
    }
  };

  const finishProfile = async (finalResponses: any) => {
    setIsFinishing(true);
    try {
      if (!user_id) {
        toast.error("User ID not found. Please log in again.");
        setIsFinishing(false);
        return;
      }

      const result = await apiFetch(`/profiles/${user_id}/personality`, {
        method: "POST",
        body: JSON.stringify({ responses: finalResponses })
      });

      // Clear persistence on success
      localStorage.removeItem("personality_step");
      localStorage.removeItem("personality_responses");

      toast.success("Character Profile Built!");
      onComplete();
    } catch (err: any) {
      toast.error(err.message || "Failed to save personality data. Please try again.");
      setStep(0);
      setResponses({});
      setIsFinishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#faf9f6]/95 backdrop-blur-xl">
      {/* Background Glow Decorations */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -left-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
        <div className="absolute -right-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
      </div>

      <Card className="w-full max-w-2xl bg-white border border-black/5 rounded-[32px] overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.04)] relative z-10">
        <CardContent className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            {!isFinishing ? (
              <motion.div 
                key={step} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-[#faf9f6] border border-black/5 text-[#505f78] shadow-sm">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <span className="font-bold tracking-widest text-[10px] uppercase text-neutral-400">Character Discovery</span>
                   </div>
                   <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">STEP {step + 1} / {QUESTIONS.length}</div>
                </div>

                <div className="space-y-3 text-center">
                  <h2 className="text-2xl sm:text-3xl font-dmserif font-bold text-[#0f0f10] leading-tight">
                    {QUESTIONS[step].text}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {QUESTIONS[step].options.map((opt) => (
                     <button
                       key={opt.value}
                       onClick={() => handleSelect(opt.value)}
                       className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-[#faf9f6] border border-black/5 hover:border-black/20 hover:bg-[#f3f1eb] transition-all duration-300 relative overflow-hidden h-40 shadow-sm"
                     >
                        <opt.icon className="w-8 h-8 mb-3 text-[#505f78] group-hover:text-black transition-colors" />
                        <span className="text-sm font-bold text-[#0f0f10] group-hover:text-black transition-colors">{opt.label}</span>
                     </button>
                   ))}
                </div>

                <div className="pt-2 flex justify-center">
                   <div className="flex gap-2">
                      {QUESTIONS.map((_, i) => (
                        <div key={i} className={`h-1.5 w-6 rounded-full transition-all ${i === step ? 'bg-black' : 'bg-neutral-200'}`} />
                      ))}
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center space-y-5 py-8"
              >
                 <div className="w-20 h-20 rounded-full bg-[#505f78]/10 flex items-center justify-center animate-pulse">
                    <Zap className="w-10 h-10 text-[#855300]" />
                  </div>
                 <h2 className="text-2xl sm:text-3xl font-dmserif font-bold text-[#0f0f10]">Analysing...</h2>
                 <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">Generating your campus identity based on your unique patterns.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper to check if need to show
export function usePersonalityGuard(profile: any) {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    if (profile && !profile.has_completed_personality) {
      // Small delay for UX
      setTimeout(() => setShow(true), 2000);
    }
  }, [profile]);

  return { show, setShow };
}

