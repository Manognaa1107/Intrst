"use client";

import React from "react";
import { ShieldCheckIcon, LockIcon, EyeOffIcon, DatabaseIcon, UserCheckIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const buttonClickInteraction = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.98, y: 0 },
  transition: { type: "spring" as const, stiffness: 400, damping: 15 }
};

const PrivacyPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center py-20 px-6" style={{ backgroundColor: "#faf9f6" }}>
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#e9e6df] rounded-full blur-[120px] pointer-events-none opacity-40"></div>

      <div className="max-w-3xl w-full z-10 space-y-12">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#ece9e3] flex items-center justify-center mx-auto mb-4 shadow-sm">
            <ShieldCheckIcon className="w-8 h-8 text-[#505f78]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f0f10] tracking-tight">Privacy Manifesto</h1>
          <p className="text-neutral-500 text-base font-semibold">We don&apos;t just protect your data. We respect your anonymity.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <section className="space-y-3 bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 text-[#505f78] mb-3">
              <EyeOffIcon className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#0f0f10]">Anonymity by Design</h2>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed">
              When using the &quot;Connect&quot; feature, your identity is completely hidden behind an AI-generated codename. No photos, no roll numbers, no social links—until you both choose to reveal.
            </p>
          </section>

          <section className="space-y-3 bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 text-[#505f78] mb-3">
              <DatabaseIcon className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#0f0f10]">Data Collection</h2>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed">
              We collect your Gitam email for verification purposes only. Your specific interest tags and AI profile answers are used to find relevant matches and content. We never sell your data to third parties.
            </p>
          </section>

          <section className="space-y-3 bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 text-[#505f78] mb-3">
              <LockIcon className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#0f0f10]">Security Infrastructure</h2>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed">
              All communications are handled through a secure backend layer with end-to-end encryption for sensitive profile data. Parallel logins are prohibited to prevent account hijacking.
            </p>
          </section>

          <section className="space-y-3 bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 text-[#505f78] mb-3">
              <UserCheckIcon className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#0f0f10]">Your Control</h2>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed">
              You can request data deletion at any time by contacting us. Admin logs track all sensitive moderator actions to ensure accountability.
            </p>
          </section>
        </div>

        <div className="text-center pt-8">
          <motion.div {...buttonClickInteraction} className="inline-block">
            <Link href="/" className="text-xs font-bold text-black hover:text-[#505f78] transition-all hover:underline">
              Return to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
