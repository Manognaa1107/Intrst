"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, MoreVerticalIcon, SparkleIcon, MicIcon, TypeIcon, ChevronDownIcon, ShieldIcon } from "lucide-react";
import { useUser } from "@/context/UserContext";

// ─── Waveform bubble ────────────────────────────────────────────────────────
const messages = [
  { id: 1, own: false, duration: "0:47", timestamp: "Yesterday", waveHeights: [3, 6, 8, 5, 9, 4, 7, 10, 6, 3, 8, 5, 4, 9, 7, 6, 4, 8, 5, 3] },
  { id: 2, own: true, duration: "1:23", timestamp: "Yesterday", heard: true, waveHeights: [5, 9, 6, 4, 10, 7, 3, 8, 5, 9, 4, 6, 8, 3, 7, 5, 9, 4, 6, 8] },
  { id: 3, own: false, duration: "0:52", timestamp: "2h ago", waveHeights: [4, 7, 5, 9, 3, 8, 6, 4, 10, 5, 7, 3, 9, 6, 4, 8, 5, 7, 3, 6] },
  { id: 4, own: true, duration: "1:04", timestamp: "2h ago", heard: true, waveHeights: [8, 4, 6, 9, 5, 3, 7, 10, 4, 6, 8, 3, 5, 9, 7, 4, 6, 8, 3, 5] },
  { id: 5, own: false, duration: "0:38", timestamp: "Just now", waveHeights: [3, 5, 8, 6, 9, 4, 7, 5, 10, 3, 6, 8, 4, 7, 5, 9, 3, 6, 8, 4] },
];

function GeometricAvatar({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const sizeMap = { sm: "w-9 h-9", md: "w-12 h-12", lg: "w-20 h-20" };
  const innerMap = { sm: "w-5 h-5", md: "w-7 h-7", lg: "w-12 h-12" };
  return (
    <div className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-[#505f78] to-[#855300] flex items-center justify-center shrink-0 shadow-sm`}>
      <svg viewBox="0 0 40 40" className={`${innerMap[size]} fill-white/20`}>
        <polygon points="20,3 37,34 3,34" />
        <circle cx="20" cy="20" r="7" className="fill-white/15" />
      </svg>
    </div>
  );
}

function Waveform({ heights, own }: { heights: number[]; own: boolean }) {
  return (
    <div className="flex items-center gap-[2px] h-8">
      {heights.map((h, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full ${own ? "bg-white/70" : "bg-[#505f78]/30"}`}
          style={{ height: `${h * 2.8}px` }}
        />
      ))}
    </div>
  );
}

export default function MatchPage() {
  const { name } = useUser();
  const [isRecording, setIsRecording] = useState(false);
  const [promptExpanded, setPromptExpanded] = useState(false);
  const exchangeCount = messages.length;

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
        <div className="absolute -right-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
      </div>

      {/* ─── Header ─── */}
      <header className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-black/5 relative z-20 bg-background/90 backdrop-blur-md shrink-0 md:ml-[80px] lg:ml-[240px]">
        <Link href="/connect">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-black">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
        </Link>

        {/* Anonymous identity — no real name, only codename */}
        <div className="flex flex-col items-center gap-1">
          <GeometricAvatar size="md" />
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-dmserif font-semibold text-[#0f0f10]">Ember</span>
            <div className="flex items-center gap-1 bg-[#505f78]/5 border border-[#505f78]/10 rounded-full px-2 py-0.5">
              <ShieldIcon className="w-2.5 h-2.5 text-[#505f78]" />
              <span className="text-[10px] text-[#505f78] font-semibold">Anonymous</span>
            </div>
          </div>
        </div>

        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-black">
          <MoreVerticalIcon className="w-5 h-5" />
        </button>
      </header>

      {/* Shared interest + anonymity disclaimer */}
      <div className="flex flex-col items-center gap-1.5 pt-4 pb-2 relative z-20 shrink-0 md:ml-[80px] lg:ml-[240px]">
        <span className="text-xs bg-[#855300]/5 text-[#855300] border border-[#855300]/10 px-3 py-1 rounded-full font-medium">
          📷 Both into Photography
        </span>
        <span className="text-[11px] text-neutral-400 font-medium">
          No names · No photos · No pressure
        </span>
      </div>

      {/* ─── Voice Message Thread ─── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 relative z-20 pb-[220px] md:ml-[80px] lg:ml-[240px]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.own ? "justify-end" : "justify-start"} items-end gap-2.5`}>
            {!msg.own && <GeometricAvatar size="sm" />}

            <div className={`max-w-[270px] flex flex-col gap-1 ${msg.own ? "items-end" : "items-start"}`}>
              <div
                className={`px-4 py-3 rounded-2xl flex items-center gap-3 shadow-sm border ${msg.own
                    ? "bg-[#505f78] border-[#505f78] text-white rounded-tr-sm"
                    : "bg-white border-black/5 text-[#0f0f10] rounded-tl-sm"
                  }`}
              >
                {/* Play button */}
                <button
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 ${msg.own ? "bg-white/20 hover:bg-white/30 text-white" : "bg-[#505f78]/10 hover:bg-[#505f78]/20 text-[#505f78]"
                    }`}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current ml-0.5">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </button>

                <div className="flex flex-col gap-1.5">
                  <Waveform heights={msg.waveHeights} own={msg.own} />
                  <span className={`text-xs font-mono ${msg.own ? "text-white/60" : "text-neutral-400"}`}>
                    {msg.duration}
                  </span>
                </div>
              </div>

              <div className={`flex items-center gap-2 px-1 ${msg.own ? "flex-row-reverse" : "flex-row"}`}>
                <span className="text-[11px] text-neutral-400 font-medium">{msg.timestamp}</span>
                {msg.own && msg.heard && (
                  <span className="text-[11px] text-[#855300] font-semibold">Heard ✓</span>
                )}
              </div>
            </div>

            {/* Self side: show a blurred circle (no real photo) */}
            {msg.own && (
              <div className="w-9 h-9 rounded-full bg-[#855300]/15 border border-[#855300]/20 flex items-center justify-center shrink-0 text-[#855300] text-xs font-bold shadow-sm">
                {name?.[0] || 'U'}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ─── Bottom Bar ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-xl border-t border-black/5 px-4 pt-3 pb-8 md:pl-[calc(80px+1rem)] lg:pl-[calc(240px+1rem)]">
        {/* Reveal button if ≥5 exchanges */}
        {exchangeCount >= 5 && (
          <Link href="/connect/reveal/match-ember">
            <button className="w-full mb-3 py-3 rounded-2xl bg-black hover:bg-[#505f78] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all">
              <SparkleIcon className="w-4 h-4 text-[#855300] fill-[#855300]" />
              Ready to reveal? · 5 exchanges done
            </button>
          </Link>
        )}

        {/* Weekly Prompt */}
        <button
          onClick={() => setPromptExpanded(!promptExpanded)}
          className="w-full flex items-center justify-between bg-white border border-black/5 rounded-xl px-4 py-2.5 mb-3 hover:bg-neutral-50 hover:border-neutral-300 transition-all"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <SparkleIcon className="w-3.5 h-3.5 text-[#855300] shrink-0" />
            <span className="text-xs text-[#0f0f10] font-medium truncate">
              {promptExpanded
                ? "What's something you're genuinely good at that nobody knows about?"
                : "This week's prompt — tap to expand"
              }
            </span>
          </div>
          <ChevronDownIcon className={`w-4 h-4 text-neutral-400 shrink-0 ml-2 transition-transform ${promptExpanded ? "rotate-180" : ""}`} />
        </button>

        {/* Recording controls */}
        <div className="flex items-center gap-3">
          <button className="w-11 h-11 flex items-center justify-center rounded-full bg-white border border-black/5 hover:bg-neutral-50 text-neutral-500 transition-all">
            <MicIcon className="w-5 h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className="relative">
              <button
                onMouseDown={() => setIsRecording(true)}
                onMouseUp={() => setIsRecording(false)}
                onTouchStart={() => setIsRecording(true)}
                onTouchEnd={() => setIsRecording(false)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-150 select-none ${isRecording
                    ? "bg-red-600 scale-105 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                    : "bg-black shadow-sm hover:bg-[#505f78] active:scale-95"
                  }`}
              >
                <MicIcon className="w-7 h-7 text-white" />
              </button>
              {isRecording && (
                <span className="absolute inset-0 rounded-full border border-red-500 animate-ping pointer-events-none" />
              )}
            </div>
            <span className="text-[11px] text-neutral-400 font-medium">
              {isRecording ? "Recording… release to send" : "Hold to record"}
            </span>
          </div>

          <button className="w-11 h-11 flex items-center justify-center rounded-full bg-white border border-black/5 hover:bg-neutral-50 text-neutral-500 transition-all">
            <TypeIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
