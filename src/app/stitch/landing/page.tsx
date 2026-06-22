import React from "react";
import Link from "next/link";

export default function StitchLanding() {
  return (
    <main className="min-h-screen relative overflow-x-hidden stitch-font-inter" style={{ backgroundColor: "#faf9f6" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-loop {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee-loop:hover {
          animation-play-state: paused;
        }
        .stitch-font-inter {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
      <header className="fixed top-0 left-0 w-full z-50 pt-8 px-4 md:px-8 pointer-events-none">
        <div className="max-w-6xl mx-auto w-full bg-white/40 backdrop-blur-2xl border border-white/60 rounded-3xl py-3 px-8 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.04)] pointer-events-auto">
          <div className="flex items-center gap-10">
            <Link className="flex items-center gap-3 cursor-pointer group" href="/">
              <div className="w-10 h-10 rounded-2xl bg-[#505f78] flex items-center justify-center text-white font-serif font-bold text-xl shadow-sm transition-transform group-hover:scale-105">i</div>
              <span className="text-2xl font-bold tracking-tight text-on-background">intrst</span>
            </Link>
            <nav className="hidden md:flex items-center gap-10 text-[14px] font-semibold text-on-surface-variant">
              <a className="hover:text-[#505f78] transition-colors" href="#features">Features</a>
              <a className="hover:text-[#505f78] transition-colors" href="#how-it-works">Process</a>
              <a className="hover:text-[#505f78] transition-colors" href="#communities">Communities</a>
              <a className="hover:text-[#505f78] transition-colors" href="#testimonials">Vibes</a>
            </nav>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/signin">
              <button className="text-[14px] font-bold text-on-background hover:text-[#505f78] transition-colors">Sign In</button>
            </Link>
            <Link href="/signup">
              <button className="text-white rounded-full px-7 h-11 text-[13px] font-bold tracking-tight hover:bg-[#505f78]/90 transition-all active:scale-[0.98] shadow-md bg-black">Find My People</button>
            </Link>
          </div>
        </div>
      </header>
      <section className="relative pt-64 pb-32 px-6 max-w-7xl mx-auto min-h-[90vh] grid lg:grid-cols-12 gap-16 items-center z-10">
        <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/60 border border-white/80 mb-8 shadow-sm backdrop-blur-md">
            <svg className="w-4 h-4 text-[#855300]" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /><path d="M20 2v4" /><path d="M22 4h-4" /><circle cx="4" cy="20" r="2" /></svg>
            <span className="text-[12px] font-bold tracking-widest uppercase text-on-surface-variant">AI-Powered Campus Matching</span>
          </div>
          <h1 className="text-6xl sm:text-7xl xl:text-[6.5rem] font-bold tracking-tighter text-on-background leading-[1.02] mb-8">
            Find your <br /><span className="bg-gradient-to-r from-[#505f78] to-[#855300] bg-clip-text text-transparent font-serif italic font-normal pr-4">Actual</span> people.
          </h1>
          <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed mb-12">
            Skip the algorithmic noise. Meet students who share your genuine vibe, latent creative passions, and niche campus lifestyles effortlessly.
          </p>
          <div className="flex flex-wrap items-center gap-6 mb-16 w-full sm:w-auto relative z-20">
            <Link className="w-full sm:w-auto" href="/discover">
              <button className="text-white rounded-full px-9 h-14 text-base font-bold hover:bg-[#505f78]/90 shadow-xl shadow-[#505f78]/20 transition-all flex items-center gap-2 w-full justify-center hover:translate-y-[-2px] bg-black">
                Discover My Vibe
                <svg className="w-5 h-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>
              </button>
            </Link>
            <Link className="w-full sm:w-auto" href="/signup">
              <button className="bg-white text-on-background border border-outline-variant rounded-full px-9 h-14 text-base font-bold hover:bg-surface-container shadow-sm transition-all w-full sm:w-auto hover:translate-y-[-2px]">Join Campus</button>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-12 border-t border-outline-variant/30 pt-10 w-full max-w-xl">
            <div>
              <p className="text-3xl font-bold tracking-tight text-on-background">98%</p>
              <p className="text-[13px] font-semibold text-ink-muted mt-1">Match Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight text-on-background">12k+</p>
              <p className="text-[13px] font-semibold text-ink-muted mt-1">Verified Students</p>
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight text-on-background">40+</p>
              <p className="text-[13px] font-semibold text-ink-muted mt-1">Niche Hubs</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[500px] z-10">
          <div className="w-[330px] h-[640px] rounded-[56px] border-[10px] border-on-background bg-white shadow-[0_40px_100px_rgba(0,0,0,0.12),0_15px_40px_rgba(0,0,0,0.06)] relative p-5 flex flex-col justify-between overflow-hidden">
            <div className="w-32 h-[22px] rounded-full absolute top-3 left-1/2 -translate-x-1/2 z-30"></div>
            <div className="flex items-center justify-between pt-6 border-b border-surface-container pb-4">
              <span className="text-[12px] font-bold uppercase tracking-widest text-ink-muted">Discover Matrix</span>
              <div className="w-2.5 h-2.5 rounded-full bg-soft-mint animate-pulse"></div>
            </div>
            <div className="flex-1 flex flex-col gap-4 justify-center py-6">
              <div className="p-4 rounded-3xl bg-surface-container-low border border-surface-container flex items-center gap-4 cursor-pointer hover:bg-surface-container transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center font-bold text-[#505f78] text-lg">A</div>
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-24 bg-surface-variant/50 rounded-full"></div>
                  <div className="h-2.5 w-36 bg-surface-variant/30 rounded-full"></div>
                </div>
              </div>
              <div className="p-4 rounded-3xl text-white flex items-center gap-4 shadow-xl cursor-pointer hover:scale-[1.02] transition-transform bg-black">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-white text-lg">R</div>
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-20 bg-white/20 rounded-full"></div>
                  <div className="h-2.5 w-28 bg-white/10 rounded-full"></div>
                </div>
              </div>
              <div className="p-4 rounded-3xl bg-surface-container-low border border-surface-container flex items-center gap-4 opacity-60 cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-tertiary-container flex items-center justify-center font-bold text-tertiary text-lg">M</div>
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-28 bg-surface-variant/50 rounded-full"></div>
                  <div className="h-2.5 w-20 bg-surface-variant/30 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="h-16 border-t border-surface-container flex items-center justify-around text-ink-muted">
              <svg className="w-5 h-5 text-on-background cursor-pointer" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" /><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" /></svg>
              <svg className="w-5 h-5 cursor-pointer hover:text-[#505f78] transition-colors" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" /></svg>
              <svg className="w-5 h-5 cursor-pointer hover:text-[#505f78] transition-colors" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M16 3.128a4 4 0 0 1 0 7.744" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" /></svg>
            </div>
          </div>
          <div className="absolute top-20 -left-12 bg-white/95 backdrop-blur-xl border border-white/80 p-4 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] flex items-center gap-3 z-20 cursor-pointer hover:translate-y-[-4px] transition-transform">
            <div className="w-3 h-3 rounded-full bg-[#505f78]"></div>
            <span className="text-[13px] font-bold text-on-background">98% Compatibility Match</span>
          </div>
          <div className="absolute bottom-32 -right-12 bg-white/95 backdrop-blur-xl border border-white/80 p-4 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] flex items-center gap-3 z-20 cursor-pointer hover:translate-y-[-4px] transition-transform">
            <svg className="w-5 h-5 text-[#855300] fill-[#855300]/10" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>
            <span className="text-[13px] font-bold text-on-background">AI Icebreaker Ready</span>
          </div>
        </div>
      </section>
      <div className="relative bg-surface-container-lowest overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[180%] h-[400px] bg-surface-container-lowest rounded-b-[100%] z-0"></div>
        <section className="relative pt-64 pb-32 px-6 z-10 bg-surface-container-lowest rounded-t-[140px] mt-[-80px]" id="features">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-[-200px] top-[20%] w-[600px] h-[600px] rounded-full bg-primary-container/20 blur-[150px] opacity-60"></div>
            <div className="absolute right-[-200px] bottom-[10%] w-[600px] h-[600px] rounded-full bg-secondary-fixed/20 blur-[150px] opacity-50"></div>
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-32">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-on-background">Built for Real Connections</h2>
              <p className="text-on-surface-variant text-xl max-w-2xl mx-auto font-medium leading-relaxed">Everything you need to find your structural sub-communities and core peers on campus.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-16">
              <div className="text-center group cursor-pointer">
                <div className="w-36 h-36 rounded-full bg-primary-container/30 border border-white flex items-center justify-center mb-10 mx-auto shadow-inner transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:bg-primary-container/40">
                  <svg className="w-16 h-16 text-[#505f78]" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" /></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight text-on-background">Interest Matching</h3>
                <p className="text-ink-muted text-base leading-relaxed max-w-sm mx-auto">Discover hidden subcultures and shared interests across campus with hyper-precise structural data mapping.</p>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="w-36 h-36 rounded-full bg-tertiary-container/30 border border-white flex items-center justify-center mb-10 mx-auto shadow-inner transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:bg-tertiary-container/40">
                  <svg className="w-16 h-16 text-[#505f78]" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight text-on-background">AI Icebreakers</h3>
                <p className="text-ink-muted text-base leading-relaxed max-w-sm mx-auto">Kickstart meaningful chat networks using context-aware dialogue suggestions generated by our core match engine.</p>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="w-36 h-36 rounded-full bg-secondary-fixed/30 border border-white flex items-center justify-center mb-10 mx-auto shadow-inner transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:bg-secondary-fixed/40">
                  <svg className="w-16 h-16 text-[#505f78]" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" /><path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path d="M10 2v2" /><path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" /></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight text-on-background">Communities</h3>
                <p className="text-ink-muted text-base leading-relaxed max-w-sm mx-auto">Bridge individual connection channels into collaborative hubs constructed dynamically around organic lifestyles.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="relative z-10 overflow-hidden bg-gradient-to-r from-primary-container/10 via-white to-tertiary-container/10 py-20" id="communities">
          <div className="max-w-7xl mx-auto px-6 mb-20 text-center relative z-10">
            <p className="uppercase tracking-[0.3em] text-[11px] font-bold text-[#505f78] mb-6">Hubs &amp; Circles</p>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-on-background">Find your setup.</h2>
            <p className="text-ink-muted text-lg max-w-2xl mx-auto leading-relaxed">From collaborative hackathons to late-night studio sessions, connect with specific groups organically.</p>
          </div>
          <div className="relative w-full overflow-hidden py-8">
            <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>
            <div className="animate-marquee-loop gap-6">
              <div className="inline-flex items-center gap-3.5 px-10 py-5 rounded-full border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-on-background"><svg className="w-6 h-6 text-on-background" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg><span className="text-lg font-bold text-on-background">Photography</span></div>
              <div className="inline-flex items-center gap-3.5 px-10 py-5 rounded-full border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-on-background"><svg className="w-6 h-6 text-on-background" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg><span className="text-lg font-bold text-on-background">Photography</span></div>
              <div className="inline-flex items-center gap-3.5 px-10 py-5 rounded-full border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-on-background"><svg className="w-6 h-6 text-on-background" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg><span className="text-lg font-bold text-on-background">Photography</span></div>
              <div className="inline-flex items-center gap-3.5 px-10 py-5 rounded-full border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-on-background"><svg className="w-6 h-6 text-on-background" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg><span className="text-lg font-bold text-on-background">Photography</span></div>
              <div className="inline-flex items-center gap-3.5 px-10 py-5 rounded-full border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-on-background"><svg className="w-6 h-6 text-on-background" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg><span className="text-lg font-bold text-on-background">Photography</span></div>
              <div className="inline-flex items-center gap-3.5 px-10 py-5 rounded-full border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-on-background"><svg className="w-6 h-6 text-on-background" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg><span className="text-lg font-bold text-on-background">Photography</span></div>
              <div className="inline-flex items-center gap-3.5 px-10 py-5 rounded-full border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-on-background"><svg className="w-6 h-6 text-on-background" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg><span className="text-lg font-bold text-on-background">Photography</span></div>
              <div className="inline-flex items-center gap-3.5 px-10 py-5 rounded-full border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-on-background"><svg className="w-6 h-6 text-on-background" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg><span className="text-lg font-bold text-on-background">Photography</span></div>
              <div className="inline-flex items-center gap-3.5 px-10 py-5 rounded-full border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-on-background"><svg className="w-6 h-6 text-on-background" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg><span className="text-lg font-bold text-on-background">Photography</span></div>
            </div>
          </div>
        </section>
        <section className="relative px-6 z-10 bg-gradient-to-b from-white to-surface-container-low pt-20 pb-40" id="how-it-works">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <p className="uppercase tracking-[0.3em] text-[11px] font-bold text-[#505f78] mb-6">The Protocol</p>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-on-background">How it plays out.</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div className="group h-full">
                <div className="bg-white/80 backdrop-blur-xl border rounded-[40px] p-10 h-full shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all duration-500 hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] hover:-translate-y-2 border-[#505f78]/10">
                  <div>
                    <div className="text-5xl mb-10 select-none grayscale group-hover:grayscale-0 transition-all">✨</div>
                    <h3 className="text-xl font-bold tracking-tight text-on-background mb-4">Pick Interests</h3>
                    <p className="text-on-surface-variant text-[15px] leading-relaxed">Select the specific niches you genuinely enjoy.</p>
                  </div>
                  <div className="text-[13px] font-bold text-ink-muted/30 mt-12 tracking-widest uppercase">Phase 01</div>
                </div>
              </div>
              <div className="group h-full">
                <div className="bg-white/80 backdrop-blur-xl border rounded-[40px] p-10 h-full shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all duration-500 hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] hover:-translate-y-2 border-[#505f78]/10">
                  <div>
                    <div className="text-5xl mb-10 select-none grayscale group-hover:grayscale-0 transition-all">🤖</div>
                    <h3 className="text-xl font-bold tracking-tight text-on-background mb-4">AI Matching</h3>
                    <p className="text-on-surface-variant text-[15px] leading-relaxed">Our engine maps out structural profile alignments.</p>
                  </div>
                  <div className="text-[13px] font-bold text-ink-muted/30 mt-12 tracking-widest uppercase">Phase 02</div>
                </div>
              </div>
              <div className="group h-full">
                <div className="bg-white/80 backdrop-blur-xl border rounded-[40px] p-10 h-full shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all duration-500 hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] hover:-translate-y-2 border-[#505f78]/10">
                  <div>
                    <div className="text-5xl mb-10 select-none grayscale group-hover:grayscale-0 transition-all">💬</div>
                    <h3 className="text-xl font-bold tracking-tight text-on-background mb-4">Start Talking</h3>
                    <p className="text-on-surface-variant text-[15px] leading-relaxed">Initiate natural alignment with context-driven text triggers.</p>
                  </div>
                  <div className="text-[13px] font-bold text-ink-muted/30 mt-12 tracking-widest uppercase">Phase 03</div>
                </div>
              </div>
              <div className="group h-full">
                <div className="bg-white/80 backdrop-blur-xl border rounded-[40px] p-10 h-full shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all duration-500 hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] hover:-translate-y-2 border-[#505f78]/10">
                  <div>
                    <div className="text-5xl mb-10 select-none grayscale group-hover:grayscale-0 transition-all">🎉</div>
                    <h3 className="text-xl font-bold tracking-tight text-on-background mb-4">Meet IRL</h3>
                    <p className="text-on-surface-variant text-[15px] leading-relaxed">Take it to actual campus spaces and safe assemblies.</p>
                  </div>
                  <div className="text-[13px] font-bold text-ink-muted/30 mt-12 tracking-widest uppercase">Phase 04</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="relative z-10 py-40 px-6 bg-gradient-to-b from-surface-container-low to-white" id="testimonials">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-on-background mb-6">Real Stories, Real Connections</h2>
              <p className="text-ink-muted text-lg max-w-xl mx-auto font-medium">Hear from students who bypassed the algorithmic noise and found their actual people.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              <div className="group">
                <div className="relative h-full flex flex-col justify-between p-10 rounded-[48px] border border-white/60 bg-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-500">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-low border border-surface-container flex items-center justify-center mb-8 shadow-inner">
                      <span className="text-[14px] font-bold text-[#505f78]">P</span>
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-on-background mb-4">Priya</h3>
                    <p className="text-on-surface-variant text-base leading-relaxed font-medium italic">“I talked to someone for 2 weeks before we revealed. Now they are one of my closest friends.”</p>
                  </div>
                  <div className="text-[12px] font-bold text-ink-muted/30 mt-10 tracking-widest uppercase">Student Story 01</div>
                </div>
              </div>
              <div className="group">
                <div className="relative h-full flex flex-col justify-between p-10 rounded-[48px] border border-white/60 bg-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-500">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-low border border-surface-container flex items-center justify-center mb-8 shadow-inner">
                      <span className="text-[14px] font-bold text-[#505f78]">A</span>
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-on-background mb-4">Arjun</h3>
                    <p className="text-on-surface-variant text-base leading-relaxed font-medium italic">“The AI matched me with someone who had the exact same niche interests.”</p>
                  </div>
                  <div className="text-[12px] font-bold text-ink-muted/30 mt-10 tracking-widest uppercase">Student Story 02</div>
                </div>
              </div>
              <div className="group">
                <div className="relative h-full flex flex-col justify-between p-10 rounded-[48px] border border-white/60 bg-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-500">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-low border border-surface-container flex items-center justify-center mb-8 shadow-inner">
                      <span className="text-[14px] font-bold text-[#505f78]">R</span>
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-on-background mb-4">Riya</h3>
                    <p className="text-on-surface-variant text-base leading-relaxed font-medium italic">“Found my entire friend group through the Photography Club.”</p>
                  </div>
                  <div className="text-[12px] font-bold text-ink-muted/30 mt-10 tracking-widest uppercase">Student Story 03</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="relative py-48 px-6 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-10 text-on-background">Your campus is full of <br /><span className="bg-gradient-to-r from-[#505f78] to-[#855300] bg-clip-text text-transparent font-serif italic font-normal">your people</span></h2>
            <p className="text-on-surface-variant text-xl mb-12 max-w-xl mx-auto leading-relaxed">Meet peers who truly fit your day-to-day profile and operational lifestyle, not just your program major.</p>
            <Link href="/discover">
              <button className="text-white rounded-full px-12 h-16 text-lg font-bold shadow-2xl shadow-[#505f78]/30 hover:bg-[#505f78]/90 transition-all hover:translate-y-[-4px] flex items-center gap-3 mx-auto bg-black">
                Get Started Free
                <svg className="w-6 h-6" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>
              </button>
            </Link>
          </div>
        </section>
        <footer className="relative border-t border-outline-variant/30 bg-white/60 backdrop-blur-2xl py-16 px-6 z-10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#505f78] flex items-center justify-center text-white font-serif font-bold text-base">i</div>
              <span className="text-xl font-bold tracking-tight text-on-background">intrst</span>
            </div>
            <div className="flex items-center gap-10 text-[13px] font-bold text-ink-muted">
              <Link className="hover:text-[#505f78] transition-colors" href="#">Privacy Policy</Link>
              <Link className="hover:text-[#505f78] transition-colors" href="#">Terms of Service</Link>
              <a className="hover:text-[#505f78] transition-colors" href="mailto:support@intrst.com">Contact</a>
            </div>
            <p className="text-[12px] font-bold text-ink-muted tracking-wide">© 2026 INTRST. WORKSPACE MAPPING CALIBRATED.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
