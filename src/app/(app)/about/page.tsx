"use client";

import React from "react";
import { MailIcon, SparklesIcon, UsersIcon, ShieldCheckIcon, GlobeIcon, Share2Icon } from "lucide-react";
import { motion } from "framer-motion";

const buttonClickInteraction = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.98, y: 0 },
  transition: { type: "spring" as const, stiffness: 400, damping: 15 }
};

const AboutPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center py-20 px-6" style={{ backgroundColor: "#faf9f6" }}>
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#e9e6df] rounded-full blur-[120px] pointer-events-none opacity-40"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-[#f3f1eb] rounded-full blur-[100px] pointer-events-none opacity-50"></div>

      <div className="max-w-4xl w-full z-10 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-black/5 shadow-sm text-neutral-600 text-xs font-semibold uppercase tracking-wider mb-2 animate-fade-in">
            <SparklesIcon className="w-3.5 h-3.5 text-[#505f78]" />
            <span>The Honest Campus Layer</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#0f0f10] animate-slide-up">
            About <span className="bg-gradient-to-r from-[#505f78] to-[#855300] bg-clip-text text-transparent font-serif italic font-normal">intrst</span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100">
            For 13,000+ GITAM students, there was no single honest platform.
            Official channels are curated. WhatsApp groups are chaotic.
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up delay-200">
          <div className="p-8 rounded-[2rem] bg-white border border-black/5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
            <div className="w-14 h-14 rounded-full bg-[#ece9e3] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <UsersIcon className="w-6 h-6 text-[#505f78]" />
            </div>
            <h3 className="text-xl font-bold text-[#0f0f10] mb-3">By Students</h3>
            <p className="text-neutral-500 leading-relaxed text-sm">
              Built and run entirely by students who understand what campus life actually needs.
            </p>
          </div>

          <div className="p-8 rounded-[2rem] bg-white border border-black/5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
            <div className="w-14 h-14 rounded-full bg-[#efece6] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <ShieldCheckIcon className="w-6 h-6 text-[#505f78]" />
            </div>
            <h3 className="text-xl font-bold text-[#0f0f10] mb-3">Honest Truth</h3>
            <p className="text-neutral-500 leading-relaxed text-sm">
              Real reviews, real ratings. No corporate filters, just raw student perspectives.
            </p>
          </div>

          <div className="p-8 rounded-[2rem] bg-white border border-black/5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
            <div className="w-14 h-14 rounded-full bg-[#e9e6df] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <SparklesIcon className="w-6 h-6 text-[#505f78]" />
            </div>
            <h3 className="text-xl font-bold text-[#0f0f10] mb-3">Utility First</h3>
            <p className="text-neutral-500 leading-relaxed text-sm">
              From canteens to professors, we provide the tools you need to navigate GITAM.
            </p>
          </div>
        </div>

        {/* The Why Section */}
        <div className="rounded-[2.5rem] bg-gradient-to-br from-[#505f78]/10 to-[#855300]/10 p-px shadow-sm">
          <div className="bg-white rounded-[calc(2.5rem-1px)] p-10 md:p-16 space-y-8">
            <h2 className="text-3xl md:text-4xl font-dmserif font-bold text-[#0f0f10]">Why intrst?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <p className="text-neutral-500 leading-relaxed text-sm">
                  We found that institutional knowledge at GITAM was trapped in fragmented silos. Seniors knew which electives were easy, which canteens had the best meals, and which clubs were worth joining—but juniors had to learn this the hard way.
                </p>
                <p className="text-neutral-500 leading-relaxed text-sm">
                  intrst was born to democratize this knowledge. We are the digital commons where students share, connect, and grow without the noise.
                </p>
              </div>
              <div className="space-y-6">
                <blockquote className="border-l-4 border-[#505f78] pl-6 py-2 italic text-lg text-[#0f0f10]/80 font-serif">
                  &quot;intrst is the honest campus layer that should have existed from day one.&quot;
                </blockquote>
                <div className="flex items-center gap-4 pt-4 border-t border-black/5">
                  <div className="w-12 h-12 rounded-full bg-[#ece9e3] flex items-center justify-center font-bold text-[#505f78]">F</div>
                  <div>
                    <div className="text-[#0f0f10] font-bold text-sm">The Founders</div>
                    <div className="text-xs text-neutral-500">Class of &apos;26</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 rounded-[2rem] border border-black/5 bg-white shadow-sm">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold text-[#0f0f10]">Have questions?</h3>
            <p className="text-neutral-500 text-sm">We&apos;re always open to feedback and collaboration.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.a
              href="mailto:intrst2026@gmail.com"
              {...buttonClickInteraction}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-black text-white text-xs font-bold hover:bg-[#505f78] transition-all shadow-md"
            >
              <MailIcon className="w-4 h-4" />
              <span>Contact Us</span>
            </motion.a>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com/intrst.in" target="_blank" className="p-3 rounded-full border border-black/10 text-neutral-500 hover:bg-[#f3f1eb] hover:text-[#505f78] transition-colors">
                <Share2Icon className="w-5 h-5" />
              </a>
              <a href="https://github.com/Sampath04x/hmu-platform" target="_blank" className="p-3 rounded-full border border-black/10 text-neutral-500 hover:bg-[#f3f1eb] hover:text-[#505f78] transition-colors">
                <GlobeIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="mt-20 flex flex-col items-center gap-2 text-neutral-400 animate-bounce opacity-70">
        <span className="text-[9px] uppercase tracking-widest font-bold">Built for GITAM</span>
        <div className="w-0.5 h-8 bg-[#505f78]/25 rounded-full"></div>
      </div>
    </div>
  );
};

export default AboutPage;
