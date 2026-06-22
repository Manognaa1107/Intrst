"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2Icon, ShareIcon, UsersIcon, CalendarIcon, MapPinIcon, LinkIcon } from "lucide-react";
import { motion } from "framer-motion";

const buttonClickInteraction = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.98, y: 0 },
  transition: { type: "spring" as const, stiffness: 400, damping: 15 }
};

export default function ClubPage() {
  const [activeTab, setActiveTab] = useState("Posts");

  const club = {
    name: "Photography Club",
    category: "Media",
    members: 189,
    verified: true,
    description: "The official photography club of the campus. Capturing moments and teaching the art.",
    founded: 2018,
    advisor: "Dr. A. Verma",
    initials: "PC",
    isJoined: false
  };

  const tabs = ["Posts", "Events", "Members", "About"];

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#faf9f6" }}>
      {/* Cover Banner */}
      <div className="h-48 md:h-64 w-full bg-gradient-to-r from-[#505f78]/10 via-[#ece9e3]/30 to-[#855300]/10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#faf9f6] to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative -mt-16 md:-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="flex items-end gap-5">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-black to-[#505f78] text-white font-bold text-4xl md:text-5xl flex items-center justify-center border-[6px] border-[#faf9f6] shadow-[0_12px_24px_rgba(0,0,0,0.06)] shrink-0">
              {club.initials}
            </div>

            <div className="mb-2 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-[#ece9e3] text-neutral-700 hover:bg-[#ece9e3] font-semibold rounded-md text-xs">{club.category}</Badge>
                {club.verified && (
                  <Badge variant="outline" className="border-[#505f78]/30 text-[#505f78] gap-1 rounded-md text-xs bg-white">
                    <CheckCircle2Icon className="w-3.5 h-3.5" /> Verified
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0f0f10] leading-tight">{club.name}</h1>

              <div className="flex items-center gap-3 text-neutral-500 text-sm font-semibold">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <Avatar key={i} className="w-6 h-6 border-2 border-white">
                      <AvatarFallback className="bg-[#ece9e3] text-[9px] text-[#505f78] font-bold">P</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span>{club.members} members</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-2 shrink-0">
            <motion.div {...buttonClickInteraction} className="w-full md:w-32">
              <Button className="w-full bg-black hover:bg-[#505f78] text-white font-bold text-xs h-10 shadow-sm rounded-full">
                Join Club
              </Button>
            </motion.div>
            <motion.div {...buttonClickInteraction}>
              <Button variant="ghost" className="px-3 border border-black/10 text-neutral-500 hover:bg-[#f3f1eb] hover:text-[#505f78] transition-all bg-white rounded-full h-10 w-10 flex items-center justify-center">
                <ShareIcon className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar border-b border-black/5 mb-6 sticky top-[64px] md:top-0 bg-[#faf9f6]/90 backdrop-blur-md z-30 pt-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors relative ${activeTab === tab ? 'text-black' : 'text-neutral-500 hover:text-black'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {activeTab === "Posts" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Card className="p-6 bg-white border border-black/5 shadow-sm hover:shadow-md transition-all rounded-2xl">
                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#ece9e3] text-[#505f78] font-bold flex items-center justify-center text-sm">{club.initials}</div>
                  <div>
                    <h4 className="font-bold text-[#0f0f10] text-sm">Announcement</h4>
                    <p className="text-[11px] text-neutral-500 font-semibold">3h ago &middot; Admin</p>
                  </div>
                  <Badge className="ml-auto h-6 bg-[#ece9e3] text-neutral-700 border border-black/5 rounded-md text-xs font-semibold" variant="outline">
                    EVENT
                  </Badge>
                </div>

                <p className="text-neutral-700 text-sm leading-relaxed mb-4">
                  Photowalk this Saturday! We&apos;ll be covering the old campus architecture. Bring your DSLRs or just your phones. Everyone is welcome.
                </p>

                <div className="w-full h-48 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-400 font-semibold text-xs border border-black/5">
                  [Image Placeholder]
                </div>
              </Card>

              <Card className="p-6 bg-white border border-black/5 shadow-sm hover:shadow-md transition-all rounded-2xl">
                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#ece9e3] text-[#505f78] font-bold flex items-center justify-center text-sm">{club.initials}</div>
                  <div>
                    <h4 className="font-bold text-[#0f0f10] text-sm">Workshop</h4>
                    <p className="text-[11px] text-neutral-500 font-semibold">2d ago &middot; Admin</p>
                  </div>
                </div>
                <p className="text-neutral-700 text-sm leading-relaxed">
                  Thanks to everyone who joined the editing workshop yesterday! The Lightroom presets have been shared in the group chat.
                </p>
              </Card>
            </div>
          )}

          {activeTab === "Events" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {[1, 2].map((i) => (
                <Card key={i} className="overflow-hidden bg-white border border-black/5 shadow-sm hover:shadow-md hover:border-black/10 flex flex-col sm:flex-row group transition-all rounded-2xl">
                  <div className="w-full sm:w-48 h-32 sm:h-auto bg-gradient-to-br from-[#505f78]/10 to-[#855300]/5 flex items-center justify-center shrink-0 border-r border-black/5">
                    <CalendarIcon className="w-8 h-8 text-[#505f78]/40" />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <Badge className="bg-[#ece9e3] text-neutral-700 border border-black/5 rounded-md text-xs font-semibold">SAT, 6:00 AM</Badge>
                        <span className="text-[10px] text-neutral-500 font-bold bg-neutral-100 px-2.5 py-1 rounded-md uppercase tracking-wider">34 Going</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#0f0f10] group-hover:text-[#505f78] transition-colors">Weekly Campus Photowalk</h3>
                      <p className="text-xs font-semibold text-neutral-500 mt-1 flex items-center gap-1.5"><MapPinIcon className="w-3.5 h-3.5" /> Main Gate</p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <motion.div {...buttonClickInteraction} className="flex-1">
                        <Button size="sm" className="bg-black hover:bg-[#505f78] text-white font-bold text-xs w-full shadow-sm rounded-full h-9">Going</Button>
                      </motion.div>
                      <motion.div {...buttonClickInteraction} className="flex-1">
                        <Button size="sm" variant="outline" className="border border-black/10 bg-white text-black hover:bg-[#f3f1eb] font-bold text-xs w-full rounded-full h-9 transition-colors">Interested</Button>
                      </motion.div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "Members" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {Array(8).fill(0).map((_, i) => (
                <Card key={i} className="p-5 flex flex-col items-center justify-center text-center bg-white border border-black/5 shadow-sm hover:shadow-md hover:border-black/10 transition-all cursor-pointer group rounded-2xl">
                  <Avatar className="w-16 h-16 mb-3 border-2 border-transparent group-hover:border-[#505f78]/50 transition-colors shadow-sm">
                    <AvatarFallback className="bg-[#ece9e3] text-[#505f78] font-bold text-lg">P{i}</AvatarFallback>
                  </Avatar>
                  <h4 className="font-bold text-[#0f0f10] text-sm">Priya S.</h4>
                  <p className="text-xs text-neutral-500 font-semibold mt-0.5">3rd Year</p>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "About" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Card className="p-6 bg-white border border-black/5 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-[#0f0f10] mb-3">About {club.name}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {club.description}
                </p>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-5 bg-white border border-black/5 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-black/5 flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5 text-neutral-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0f0f10] text-xs uppercase tracking-wider text-neutral-400">Founded</h4>
                    <p className="text-sm font-bold text-neutral-700 mt-0.5">{club.founded}</p>
                  </div>
                </Card>

                <Card className="p-5 bg-white border border-black/5 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-black/5 flex items-center justify-center">
                    <UsersIcon className="w-5 h-5 text-neutral-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0f0f10] text-xs uppercase tracking-wider text-neutral-400">Faculty Advisor</h4>
                    <p className="text-sm font-bold text-neutral-700 mt-0.5">{club.advisor}</p>
                  </div>
                </Card>
              </div>

              <Card className="p-6 bg-white border border-black/5 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-[#0f0f10] mb-3">Links</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center gap-3 text-[#505f78] hover:text-black font-semibold transition-colors group">
                    <LinkIcon className="w-3.5 h-3.5 bg-black/5 p-1 rounded-md box-content" />
                    <span className="text-xs">instagram.com/photoclub</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 text-[#505f78] hover:text-black font-semibold transition-colors group">
                    <LinkIcon className="w-3.5 h-3.5 bg-black/5 p-1 rounded-md box-content" />
                    <span className="text-xs">photoclub.compus.edu</span>
                  </a>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
