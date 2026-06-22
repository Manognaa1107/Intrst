"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EyeIcon, SparkleIcon, MicIcon, HeartHandshakeIcon } from "lucide-react";

export default function ConnectPage() {
  return (
    <div className="min-h-screen bg-background pb-28 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
        <div className="absolute -right-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
        <div className="absolute top-[40%] left-[-150px] w-[400px] h-[400px] rounded-full bg-[#f3f1eb] blur-[120px] opacity-40" />
      </div>

      <div className="max-w-lg mx-auto px-4 sm:px-6 pt-6 relative z-10">
        {/* Header */}
        <div className="mb-8 mt-2">
          <h1 className="text-4xl font-dmserif font-bold text-[#0f0f10]">Connect</h1>
          <p className="text-neutral-500 text-sm mt-1">Talk before you see. Reveal when you&apos;re ready.</p>
        </div>

        {/* Active Match Card */}
        <div className="relative mb-8">
          <Card className="relative bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#505f78] to-[#855300]" />

            <div className="p-6 sm:p-8 space-y-6">
              {/* Codename + Avatar */}
              <div className="flex items-center gap-5">
                {/* Geometric anonymous avatar */}
                <div className="relative w-20 h-20 shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#505f78] to-[#855300] flex items-center justify-center shadow-md">
                    <svg viewBox="0 0 60 60" className="w-12 h-12 fill-white/20">
                      <polygon points="30,5 55,50 5,50" />
                      <circle cx="30" cy="30" r="12" className="fill-white/10" />
                    </svg>
                  </div>
                  {/* Pulse ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-[#505f78]/20 animate-ping" style={{ animationDuration: '3s' }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-dmserif font-bold text-[#0f0f10]">Ember</span>
                    <span className="text-[10px] bg-[#505f78]/5 text-[#505f78] border border-[#505f78]/10 px-2.5 py-0.5 rounded-full font-medium">Anonymous</span>
                  </div>
                  <div className="text-xs text-[#855300] font-medium flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
                    Both into: Photography
                  </div>
                  {/* AI Vibe Teaser */}
                  <div className="inline-flex items-center gap-1.5 bg-[#505f78]/5 border border-[#505f78]/10 rounded-lg px-2.5 py-1.5 mt-1">
                    <SparkleIcon className="w-3.5 h-3.5 text-[#505f78]" />
                    <span className="text-[11px] text-[#505f78] leading-tight font-medium">
                      AI Vibe: <span className="font-semibold italic">&ldquo;The Creative Minimalist&rdquo;</span> — Connect over abstract frames and deep focus.
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-50 border border-black/5 rounded-xl p-3 text-center">
                  <div className="text-xl font-dmserif font-bold text-[#0f0f10]">4</div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 mt-0.5">Voice messages</div>
                </div>
                <div className="bg-neutral-50 border border-black/5 rounded-xl p-3 text-center">
                  <div className="text-xl font-dmserif font-bold text-[#0f0f10]">2h ago</div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 mt-0.5">Last heard</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-3">
                <Link href="/connect/match-ember" className="flex-1">
                  <Button className="w-full h-12 bg-black hover:bg-[#505f78] font-bold text-white rounded-xl shadow-sm transition-all">
                    Open Conversation
                  </Button>
                </Link>
                <Button variant="outline" className="h-12 px-4 border border-black/10 bg-white text-neutral-600 hover:bg-neutral-50 transition-colors rounded-xl">
                  <SparkleIcon className="w-4 h-4 text-[#505f78]" />
                </Button>
              </div>

              {/* Weekly Prompt */}
              <div className="bg-neutral-50 border border-black/5 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-[#855300] font-bold tracking-wider uppercase">
                  <SparkleIcon className="w-3 h-3 text-[#855300]" />
                  This Week&apos;s Prompt
                </div>
                <p className="text-[#0f0f10] text-xs leading-relaxed italic font-serif">
                  &ldquo;What&rsquo;s something you&rsquo;re genuinely good at that nobody on campus knows about?&rdquo;
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* How It Works */}
        <div className="space-y-4">
          <h2 className="text-xs uppercase font-bold tracking-widest text-neutral-400">How it works</h2>
          <div className="space-y-3">
            {[
              { icon: HeartHandshakeIcon, title: "Get matched on a shared interest", desc: "We pair you with someone who shares your vibe." },
              { icon: MicIcon, title: "Exchange voice messages anonymously", desc: "No names, no photos. Just voices and words." },
              { icon: EyeIcon, title: "Reveal when you both feel ready", desc: "After 5+ exchanges, you can choose to reveal." },
            ].map((step, i) => (
              <div key={i} className="flex gap-4 bg-white border border-black/5 rounded-2xl p-4 hover:shadow-sm transition-all duration-300">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#505f78]/5 border border-[#505f78]/10 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-[#505f78]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0f0f10] text-sm">{step.title}</h4>
                  <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
