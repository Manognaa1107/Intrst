"use client";

import Link from "next/link";
import { BookOpen, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const buttonClickInteraction = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.98, y: 0 },
  transition: { type: "spring" as const, stiffness: 400, damping: 15 }
};

export default function ProfessorReviewsComingSoonPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-4 md:p-8">
      {/* Background blobs for premium depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
        <div className="absolute -right-40 bottom-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg z-10"
      >
        <Card className="bg-white border border-black/5 shadow-[0_24px_48px_rgba(0,0,0,0.04)] rounded-[28px] p-8 md:p-12 text-center relative overflow-hidden">
          {/* Subtle inside glow */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-[#855300]/5 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#855300]/10 border border-[#855300]/10 shadow-[0_1px_2px_rgba(0,0,0,0.02)] mb-8">
              <Sparkles className="w-3 h-3 text-[#855300] fill-[#855300]/25" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#855300]">
                Coming Soon
              </span>
            </div>

            {/* Illustration Icon */}
            <div className="w-20 h-20 rounded-3xl bg-neutral-50 border border-neutral-100 flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.02)] mb-6 relative">
              <BookOpen className="w-9 h-9 text-[#855300]" />
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-white shadow-sm border-2 border-white animate-pulse">
                !
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-dmserif font-bold text-[#0f0f10] tracking-tight mb-3">
              Professor Reviews
            </h1>

            {/* Subtitle */}
            <p className="text-neutral-500 text-sm leading-relaxed mb-4 max-w-sm">
              We are currently developing this feature to ensure a secure, verified, and constructive review space.
            </p>

            {/* Description */}
            <div className="bg-[#faf9f6] border border-black/5 rounded-2xl p-5 mb-8 text-left text-xs text-neutral-500 leading-relaxed">
              Professor Reviews will be available in a future update. Students will be able to share anonymous academic feedback and insights.
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <Link href="/communities" className="w-full sm:w-auto">
                <motion.div {...buttonClickInteraction}>
                  <Button className="w-full sm:w-auto h-11 px-6 rounded-full border border-black/10 bg-white text-black font-bold text-xs hover:bg-[#faf9f6] flex items-center justify-center gap-2">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Communities
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
