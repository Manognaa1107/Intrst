"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Users,
  ArrowUpRight,
  Compass,
  MessageCircle,
  Headphones,
  Lightbulb,
  Wand2,
  Zap,
  Code,
  Music,
  Palette,
} from "lucide-react";
import { FaInstagram, FaGithub } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const MotionCard = motion(Card);

// =========================
// MOCK DATA & CONFIGS
// =========================
const hoverSpringConfig = { type: "spring" as const, stiffness: 300, damping: 20 };

// Standard micro-interactions for links & buttons
const buttonClickInteraction = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.98, y: 0 },
  transition: { type: "spring" as const, stiffness: 400, damping: 15 }
};

const communityPills = [
  { title: "Hackathons", icon: Code },
  { title: "Late-night Studio", icon: Palette },
  { title: "Indie Music Jam", icon: Music },
  { title: "AI Explorers", icon: Zap },
  { title: "Design Critiques", icon: Wand2 },
];

// =========================
// PAGE
// =========================
export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main
      className="min-h-screen text-[#0f0f10] antialiased font-sans relative overflow-x-hidden"
      style={{ backgroundColor: "#faf9f6" }}
    >
      {/* Dynamic Marquee Keyframe Injector */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-infinite {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee-infinite:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* =========================
          BACKGROUND BLOBS (SOFT BEIGE)
      ========================= */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-30" />
        <div className="absolute -right-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-30" />
        <div className="absolute top-[35%] left-[-150px] w-[400px] h-[400px] rounded-full bg-[#f3f1eb] blur-[120px] opacity-40" />
        <div className="absolute top-[60%] right-[-150px] w-[400px] h-[400px] rounded-full bg-[#f0ede6] blur-[110px] opacity-35" />
      </div>

      {/* =========================
          NAVBAR
      ========================= */}
      <header className="fixed top-0 left-0 w-full z-50 pt-4 px-4 md:px-8 pointer-events-none">
        <div className="max-w-5xl mx-auto w-full bg-white/40 backdrop-blur-xl border border-black/5 rounded-2xl py-2.5 px-5 flex items-center justify-between shadow-sm pointer-events-auto">

          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold text-sm">
                i
              </div>
              <span className="text-lg font-bold text-[#0f0f10]">intrst</span>
            </Link>

            <nav className="hidden md:flex gap-6 text-xs font-semibold text-neutral-500">
              <a href="#features" className="hover:text-black transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-black transition-colors">Process</a>
              <a href="#communities" className="hover:text-black transition-colors">Communities</a>
              <a href="#testimonials" className="hover:text-black transition-colors">Vibes</a>
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs font-bold text-black hover:text-[#505f78] transition-colors px-2 py-1"
              >
                Sign In
              </motion.button>
            </Link>

            <Link href="/signup">
              <motion.div {...buttonClickInteraction}>
                <Button className="rounded-full px-5 h-9 text-xs font-bold bg-black text-white hover:bg-neutral-800 shadow-sm">
                  Find My People
                </Button>
              </motion.div>
            </Link>
          </div>

        </div>
      </header>

      {/* =========================
          HERO SECTION
      ========================= */}
      <section className="relative pt-32 pb-16 px-6 max-w-6xl mx-auto min-h-[80vh] grid lg:grid-cols-12 gap-8 items-center z-10">

        {/* LEFT CONTENT */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="lg:col-span-7 flex flex-col items-start"
        >

          {/* Badge */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/5 shadow-sm mb-4"
          >
            <Sparkles className="w-3 h-3 text-[#505f78]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
              AI-Powered Campus Matching
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-[#0f0f10] leading-[1.1] mb-4"
          >
            Find your <br />
            <span className="bg-gradient-to-r from-[#505f78] to-[#855300] bg-clip-text text-transparent font-serif italic font-normal">
              Actual
            </span>{" "}
            people.
          </motion.h1>

          {/* Paragraph */}
          <motion.p
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            className="text-base text-neutral-500 max-w-lg leading-relaxed mb-8"
          >
            Skip the algorithmic noise. Meet students who share your genuine vibe,
            latent creative passions, and niche campus lifestyles effortlessly.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="flex flex-wrap gap-3 mb-10"
          >
            {/* Primary */}
            <Link href="/discover">
              <motion.div {...buttonClickInteraction}>
                <Button className="h-12 px-7 rounded-full text-sm font-bold bg-black text-white hover:bg-neutral-800 shadow-md flex items-center gap-2">
                  Discover My Vibe <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </motion.div>
            </Link>

            {/* Secondary */}
            <Link href="/signup">
              <motion.div {...buttonClickInteraction}>
                <Button className="h-12 px-7 rounded-full border border-black/10 bg-white text-black font-bold hover:bg-[#f3f1eb] transition-all">
                  Join Campus
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div className="grid grid-cols-3 gap-8 border-t border-black/10 pt-6 w-full max-w-md">
            <div>
              <p className="text-xl font-bold">98%</p>
              <p className="text-[11px] text-neutral-400">Match Accuracy</p>
            </div>
            <div>
              <p className="text-xl font-bold">12k+</p>
              <p className="text-[11px] text-neutral-400">Verified Students</p>
            </div>
            <div>
              <p className="text-xl font-bold">40+</p>
              <p className="text-[11px] text-neutral-400">Niche Hubs</p>
            </div>
          </motion.div>

        </motion.div>

        {/* RIGHT PHONE MOCKUP PANEL */}
        <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[400px] z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 70, damping: 15, delay: 0.2 }}
            className="w-[280px] h-[500px] rounded-[38px] border-[6px] border-neutral-900 bg-white shadow-[0_24px_48px_rgba(0,0,0,0.06)] relative p-3.5 flex flex-col justify-between overflow-hidden"
          >
            {/* Dynamic Island / Notch */}
            <div className="w-24 h-[15px] bg-neutral-900 rounded-full absolute top-2 left-1/2 -translate-x-1/2 z-30" />

            {/* Header Track inside mockup */}
            <div className="flex items-center justify-between pt-3 border-b border-neutral-100 pb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Discover Matrix</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Content List Block */}
            <div className="flex-1 flex flex-col gap-2.5 justify-center py-3">

              {/* Item A */}
              <motion.div whileHover={{ scale: 1.02, x: 2 }} transition={hoverSpringConfig} className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center gap-2.5 cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-xs shrink-0">A</div>
                <div className="flex-1 space-y-1">
                  <div className="h-2.5 w-16 bg-neutral-200 rounded" />
                  <div className="h-2 w-24 bg-neutral-100 rounded" />
                </div>
              </motion.div>

              {/* Item R (Active State) */}
              <motion.div whileHover={{ scale: 1.02, x: 2 }} transition={hoverSpringConfig} className="p-2.5 rounded-xl bg-neutral-900 text-white flex items-center gap-2.5 shadow-sm cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center font-bold text-white text-xs shrink-0">R</div>
                <div className="flex-1 space-y-1">
                  <div className="h-2.5 w-12 bg-neutral-700 rounded" />
                  <div className="h-2 w-20 bg-neutral-800 rounded" />
                </div>
              </motion.div>

              {/* Item M */}
              <motion.div whileHover={{ scale: 1.02, x: 2 }} transition={hoverSpringConfig} className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center gap-2.5 opacity-60 cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center font-bold text-violet-600 text-xs shrink-0">M</div>
                <div className="flex-1 space-y-1">
                  <div className="h-2.5 w-20 bg-neutral-200 rounded" />
                  <div className="h-2 w-14 bg-neutral-100 rounded" />
                </div>
              </motion.div>
            </div>

            {/* Bottom Nav inside mockup */}
            <div className="h-10 border-t border-neutral-100 flex items-center justify-around text-neutral-400">
              <Compass className="w-3.5 h-3.5 text-neutral-900 cursor-pointer" />
              <MessageCircle className="w-3.5 h-3.5 cursor-pointer hover:text-neutral-600" />
              <Users className="w-3.5 h-3.5 cursor-pointer hover:text-neutral-600" />
            </div>
          </motion.div>

          {/* FLOATING DECORATIVE BADGES */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            className="absolute top-12 -left-4 bg-white/90 backdrop-blur-md border border-neutral-200/60 p-2.5 rounded-xl shadow-[0_8px_16px_rgba(0,0,0,0.02)] flex items-center gap-2 z-20 cursor-pointer whitespace-nowrap"
          >
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-[11px] font-semibold text-neutral-800">98% Compatibility</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            className="absolute bottom-20 -right-4 bg-white/90 backdrop-blur-md border border-neutral-200/60 p-2.5 rounded-xl shadow-[0_8px_16px_rgba(0,0,0,0.02)] flex items-center gap-2 z-20 cursor-pointer whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" />
            <span className="text-[11px] font-semibold text-neutral-800">AI Icebreaker Ready</span>
          </motion.div>
        </div>

      </section>

      {/* =========================
          FEATURES SECTION
      ========================= */}
      <section
        id="features"
        className="relative py-16 px-6 z-10 bg-[#faf9f6] border-y border-black/5"
      >
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0f0f10] mb-3">
              Built for Real Connections
            </h2>
            <p className="text-neutral-500 text-sm max-w-xl mx-auto">
              Everything you need to find your structural sub-communities and core peers on campus.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <motion.div
              whileHover={{ scale: 1.01, y: -2 }}
              className="text-center bg-white border border-black/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#ece9e3] flex items-center justify-center">
                <Headphones className="w-8 h-8 text-[#505f78]" />
              </div>
              <h3 className="text-lg font-bold mb-1.5">Interest Matching</h3>
              <p className="text-neutral-500 text-xs leading-relaxed">
                Discover hidden subcultures and shared interests across campus with hyper-precise structural data mapping.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              whileHover={{ scale: 1.01, y: -2 }}
              className="text-center bg-white border border-black/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#efece6] flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-[#505f78]" />
              </div>
              <h3 className="text-lg font-bold mb-1.5">AI Icebreakers</h3>
              <p className="text-neutral-500 text-xs leading-relaxed">
                Kickstart meaningful chat networks using context-aware dialogue suggestions generated by our match engine.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              whileHover={{ scale: 1.01, y: -2 }}
              className="text-center bg-white border border-black/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#e9e6df] flex items-center justify-center">
                <Wand2 className="w-8 h-8 text-[#505f78]" />
              </div>
              <h3 className="text-lg font-bold mb-1.5">Communities</h3>
              <p className="text-neutral-500 text-xs leading-relaxed">
                Bridge individual connection channels into collaborative hubs built around organic lifestyles.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* COMMUNITIES INFINITE MARQUEE ROW                       */}
      {/* ====================================================== */}
      <section
        id="communities"
        className="relative py-16 z-10 overflow-hidden bg-gradient-to-r from-[#eef4ff]/30 via-transparent to-[#f7f1ff]/30"
      >
        <div className="max-w-6xl mx-auto px-6 mb-8 text-center relative z-10">
          <p className="uppercase tracking-widest text-[10px] font-semibold text-neutral-400 mb-2">
            Hubs & Circles
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-neutral-900">
            Find your setup.
          </h2>
          <p className="text-neutral-500 text-sm max-w-lg mx-auto">
            From collaborative hackathons to late-night studio sessions, connect with specific groups organically.
          </p>
        </div>

        <div className="relative w-full overflow-hidden py-2">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#faf9f6] to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#faf9f6] to-transparent z-20 pointer-events-none" />

          {/* FIXED INFINITE MARQUEE CONTAINER */}
          <div className="animate-marquee-infinite gap-3">
            {/* Duplicated 3 times to guarantee continuous loop width without empty breaks */}
            {[...communityPills, ...communityPills, ...communityPills].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={`marquee-${item.title}-${index}`}
                  whileHover={{ scale: 1.04, y: -1 }}
                  transition={hoverSpringConfig}
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/60 border border-black/[0.03] backdrop-blur-sm shadow-[0_1px_8px_rgba(0,0,0,0.01)] cursor-pointer whitespace-nowrap mx-1.5"
                >
                  <IconComponent className="w-3.5 h-3.5 text-neutral-700" />
                  <span className="text-xs font-medium text-neutral-800 tracking-tight">
                    {item.title}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================
          HOW IT WORKS
      ========================= */}
      <section
        id="how-it-works"
        className="relative py-16 px-6 bg-[#faf9f6] border-t border-black/5"
      >
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase mb-2">
              The Protocol
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f0f10]">
              How it plays out.
            </h2>
          </div>

          {/* Steps */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Step 1 */}
            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="text-3xl mb-4">✨</div>
              <h3 className="text-base font-bold mb-1 text-[#0f0f10]">Pick Interests</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Select the specific niches you genuinely enjoy.
              </p>
              <div className="mt-4 text-[10px] font-bold tracking-widest text-neutral-300">
                STEP 01
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-base font-bold mb-1 text-[#0f0f10]">AI Matching</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Our system maps structural profile alignments across campus.
              </p>
              <div className="mt-4 text-[10px] font-bold tracking-widest text-neutral-300">
                STEP 02
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-base font-bold mb-1 text-[#0f0f10]">Start Talking</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Begin conversations with context-aware AI icebreakers.
              </p>
              <div className="mt-4 text-[10px] font-bold tracking-widest text-neutral-300">
                STEP 03
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="text-3xl mb-4">🎉</div>
              <h3 className="text-base font-bold mb-1 text-[#0f0f10]">Meet IRL</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Take connections into real campus spaces safely.
              </p>
              <div className="mt-4 text-[10px] font-bold tracking-widest text-neutral-300">
                STEP 04
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================
          TESTIMONIALS SECTION
      ========================= */}
      <section
        id="testimonials"
        className="relative py-16 px-6 z-10 bg-[#f7f5f0] border-y border-black/5"
      >
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0f0f10] mb-3">
              What Students Say
            </h2>
            <p className="text-neutral-500 text-sm max-w-xl mx-auto">
              Real experiences from students who found their people through the platform.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* Testimonial 1 */}
            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <p className="text-neutral-600 text-xs leading-relaxed mb-4">
                “I never thought I’d find people who are into the same niche things as me on campus.
                This actually helped me connect beyond my department.”
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#e9e6df]" />
                <div>
                  <h4 className="font-semibold text-xs text-[#0f0f10]">Aaradhya</h4>
                  <p className="text-[10px] text-neutral-500">CSE Student</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <p className="text-neutral-600 text-xs leading-relaxed mb-4">
                “The AI icebreakers are honestly underrated. I used them and instantly had
                conversations that didn’t feel forced.”
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#ece9e3]" />
                <div>
                  <h4 className="font-semibold text-xs text-[#0f0f10]">Rahul</h4>
                  <p className="text-[10px] text-neutral-500">AI & DS Student</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <p className="text-neutral-600 text-xs leading-relaxed mb-4">
                “Feels like the missing layer of campus life. You don’t just meet people,
                you actually find your kind of community.”
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#e3e0d8]" />
                <div>
                  <h4 className="font-semibold text-xs text-[#0f0f10]">Sneha</h4>
                  <p className="text-[10px] text-neutral-500">Design Student</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================
          CTA SECTION
      ========================= */}
      <section className="relative py-20 px-6 z-10 bg-[#faf9f6]">
        <div className="max-w-3xl mx-auto text-center">

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0f0f10] leading-tight mb-4">
            Your campus is full of <br />
            <span className="bg-gradient-to-r from-[#505f78] to-[#855300] bg-clip-text text-transparent font-serif italic font-normal">
              your people
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-neutral-500 text-sm mb-8 max-w-md mx-auto leading-relaxed">
            Meet peers who truly fit your day-to-day vibe and lifestyle — not just your academic program.
          </p>

          {/* CTA Button */}
          <Link href="/discover">
            <motion.div {...buttonClickInteraction}>
              <Button className="h-12 px-8 rounded-full bg-black text-white text-sm font-bold shadow-md hover:bg-neutral-800 transition-all flex items-center gap-2 mx-auto">
                Get Started Free
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </Link>

          <p className="mt-4 text-[10px] text-neutral-400 tracking-wide">
            No spam. No noise. Just real connections.
          </p>

        </div>
      </section>

      {/* =========================
          CLUB CTA SECTION
      ========================= */}
      <section className="relative pb-24 px-6 z-10 bg-[#faf9f6]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full bg-white border border-black/5 rounded-3xl p-8 md:p-12 text-center shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            {/* Soft decorative background glow inside the card */}
            <div className="absolute inset-0 pointer-events-none opacity-50">
              <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-[#505f78]/5 blur-3xl" />
              <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-[#855300]/5 blur-3xl" />
            </div>

            <div className="relative z-10 max-w-xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#faf9f6] border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] mb-6">
                <Users className="w-3.5 h-3.5 text-[#505f78]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  For Campus Clubs
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f0f10] leading-tight mb-4">
                Bring Your Club to INTRST
              </h2>

              {/* Subtext */}
              <p className="text-neutral-500 text-xs sm:text-sm mb-8 leading-relaxed">
                Reach more students, promote events, and build your community on campus.
              </p>

              {/* CTA Button */}
              <Link href="/auth/club-request">
                <motion.div {...buttonClickInteraction} className="inline-block">
                  <Button className="h-11 px-8 rounded-full bg-black text-white text-xs font-bold shadow-md hover:bg-neutral-800 transition-all flex items-center gap-2">
                    Request Club Access
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================= */}
      <footer className="relative border-t border-black/10 bg-[#faf9f6] py-10 px-6 z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white font-bold text-xs">
              i
            </div>
            <span className="text-base font-bold tracking-tight text-[#0f0f10]">
              intrst
            </span>
          </div>

          {/* Center Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-medium text-neutral-500">
            <Link href="#" className="hover:text-black transition-colors">
              Privacy Policy
            </Link>

            <Link href="#" className="hover:text-black transition-colors">
              Terms of Service
            </Link>

            <a
              href="mailto:support@intrst.com"
              className="hover:text-black transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Social Icons + Copyright */}
          <div className="flex flex-col items-center gap-3">

            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/intrst.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-black/10 bg-white flex items-center justify-center hover:scale-105 transition-all"
              >
                <FaInstagram className="w-5 h-5 text-black" />
              </a>

              <a
                href="https://github.com/Sampath04x/hmu-platform"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-black/10 bg-white flex items-center justify-center hover:scale-105 transition-all"
              >
                <FaGithub className="w-5 h-5 text-black" />
              </a>
            </div>

            <p className="text-[10px] text-neutral-400 tracking-wide text-center">
              © 2026 intrst. Workspace mapping calibrated.
            </p>

          </div>

        </div>
      </footer>

    </main>
  );
}