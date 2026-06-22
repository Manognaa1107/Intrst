"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2Icon, ChevronLeftIcon } from "lucide-react";

export default function RevealPage({ params }: { params: { matchId: string } }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
        <div className="absolute -right-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
      </div>

      {/* Back */}
      <Link href={`/connect/${params.matchId}`} className="absolute top-6 left-4 z-20">
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
      </Link>

      {!revealed ? (
        /* --- Pre-reveal --- */
        <div className="flex flex-col items-center text-center gap-8 max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">
          {/* Pulsing avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#505f78] to-[#855300] flex items-center justify-center shadow-md">
              <svg viewBox="0 0 60 60" className="w-20 h-20 fill-white/20">
                <polygon points="30,5 55,50 5,50" />
                <circle cx="30" cy="30" r="12" className="fill-white/10" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-full border border-[#505f78]/25 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-[-8px] rounded-full border border-[#855300]/15 animate-ping" style={{ animationDuration: '3s' }} />
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-dmserif font-bold text-[#0f0f10]">Ember</div>
            <p className="text-xl text-neutral-500 font-medium">wants to reveal.</p>
            <p className="text-sm text-neutral-400 font-medium leading-relaxed mt-4">
              Once you both accept, you&apos;ll see each other.<br />This can&apos;t be undone.
            </p>
          </div>

          <div className="w-full space-y-3 mt-2">
            <Button
              onClick={() => setRevealed(true)}
              className="w-full h-14 text-base font-bold rounded-2xl bg-black hover:bg-[#505f78] text-white shadow-sm transition-all"
            >
              Yes, reveal 🔥
            </Button>
            <Link href={`/connect/${params.matchId}`} className="w-full">
              <Button
                variant="ghost"
                className="w-full h-12 text-base text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-2xl transition-all"
              >
                Not yet
              </Button>
            </Link>
          </div>

          <p className="text-xs text-neutral-400 font-medium mt-4">
            You&apos;ve exchanged 5 voice messages over 12 days.
          </p>
        </div>
      ) : (
        /* --- Post-reveal --- */
        <div className="flex flex-col items-center text-center gap-6 max-w-sm w-full animate-in fade-in zoom-in-95 duration-700 z-10">
          {/* Confetti dots */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-ping"
                style={{
                  left: `${10 + (i * 4.2) % 80}%`,
                  top: `${5 + (i * 13) % 60}%`,
                  backgroundColor: ["#505f78", "#855300", "#10B981", "#e9e6df", "#efece6"][i % 5],
                  animationDuration: `${1 + (i % 3) * 0.5}s`,
                  animationDelay: `${(i * 0.1) % 1}s`,
                  opacity: 0.7,
                }}
              />
            ))}
          </div>

          {/* Revealed Profile Photo */}
          <div className="relative">
            <Avatar className="w-36 h-36 border-4 border-[#855300]/20 shadow-md">
              <AvatarFallback className="bg-gradient-to-br from-[#505f78] to-[#855300] text-white text-5xl font-dmserif font-bold">
                P
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-background shadow-md">
              <CheckCircle2Icon className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-dmserif font-bold text-[#0f0f10]">Priya Sharma</h2>
            <p className="text-neutral-500 font-medium text-sm">ECE &middot; 3rd Year</p>
            <div className="flex items-center justify-center gap-1.5 mt-2 bg-[#855300]/5 border border-[#855300]/15 rounded-full px-2.5 py-0.5 w-fit mx-auto">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
              <span className="text-[10px] text-[#855300] font-bold uppercase tracking-wider">Verified Student</span>
            </div>
          </div>

          <div className="bg-[#855300]/5 border border-[#855300]/10 rounded-2xl p-5 space-y-1 w-full text-center">
            <p className="text-lg font-dmserif font-semibold text-[#855300]">
              You matched with someone real.
            </p>
            <p className="text-xs text-neutral-500 font-medium">
              You&apos;ve been talking for 12 days.
            </p>
          </div>

          <Link href="/profile/arjun-k" className="w-full">
            <Button className="w-full h-14 text-base font-bold rounded-2xl bg-black hover:bg-[#505f78] text-white shadow-sm transition-all">
              View Full Profile →
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
