"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Coffee, Star, MapPin, Search, Filter, TrendingUp, Info, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { apiFetch } from "@/lib/apiClient";
import { useUser } from "@/context/UserContext";

export default function CanteensPage() {
  const { role: currentUserRole } = useUser();
  const [canteens, setCanteens] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCanteens = async () => {
      try {
        const data = await apiFetch("/canteens");

        setCanteens(data.map((c: any) => ({
          ...c,
          id: c.id,
          rating: c.average_rating,
          reviews: c.review_count,
          image: c.image_url || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400",
          status: c.average_rating > 4 ? "open" : "busy",
          specialty: c.category || "Snacks & Drinks"
        })));
      } catch (err) {
        console.error("Failed to fetch canteens:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCanteens();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-12 bg-transparent">
      {/* Header Info */}
      <div className="text-center space-y-4 max-w-2xl mx-auto py-4">
        <Badge className="bg-[#505f78]/10 text-[#505f78] border border-[#505f78]/20 rounded-full px-4 py-1.5 font-bold uppercase tracking-widest text-[9px] shadow-none">
          Campus Utility
        </Badge>
        <h1 className="text-4xl md:text-5xl font-dmserif font-semibold tracking-tight text-[#0f0f10] leading-tight">
          Canteen <span className="bg-gradient-to-r from-[#505f78] to-[#855300] bg-clip-text text-transparent font-serif italic font-normal">Truths</span>.
        </h1>
        <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-normal">
          Which Biryani actually hits? Where is the queue the shortest? Student-sourced ratings for every outlet on campus.
        </p>
      </div>

      {/* Centered Search Bar & Filter */}
      <div className="flex items-center justify-center pt-2 pb-6">
        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-black/5 p-1.5 rounded-full shadow-[0_1px_8px_rgba(0,0,0,0.01)] hover:bg-white hover:border-black/10 focus-within:bg-white focus-within:border-black/10 transition-all duration-300 w-full max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a canteen..."
              className="w-full bg-transparent border-none rounded-full h-10 pl-11 pr-4 outline-none text-xs text-[#0f0f10] placeholder:text-neutral-400 font-medium"
            />
          </div>
          <Button className="rounded-full h-9 w-9 bg-black hover:bg-[#505f78] text-white shrink-0 shadow-sm flex items-center justify-center p-0">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {currentUserRole === 'super_admin' || currentUserRole === 'founder' || currentUserRole === 'moderator' ? (
        <div className="flex justify-center md:justify-end -mt-4 mb-4">
          <Button className="bg-black text-white hover:bg-[#505f78] font-bold gap-1.5 rounded-full px-6 h-10 text-xs shadow-sm transition-all active:scale-95">
            + Add Canteen
          </Button>
        </div>
      ) : null}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-neutral-400">
            <div className="w-10 h-10 border-4 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-semibold tracking-wide uppercase">Mapping Campus Canteens...</p>
          </div>
        ) : (
          canteens.map((canteen) => (
            <Card key={canteen.id} className="rounded-[24px] bg-white/80 backdrop-blur-sm border border-black/5 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:bg-white hover:border-black/10 transition-all duration-300 flex flex-col group">
              <div className="h-56 relative overflow-hidden">
                <img
                  src={canteen.image}
                  alt={canteen.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 backdrop-blur-md rounded-full border border-black/5 text-[#0f0f10] font-semibold h-8 px-3 flex items-center gap-1.5 shadow-sm text-xs">
                    <Star className="w-3.5 h-3.5 text-[#855300] fill-[#855300]" /> {canteen.rating}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className={`rounded-full h-8 px-3.5 flex items-center gap-1.5 border shadow-sm ${canteen.status === 'open' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                    }`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    <span className="font-bold uppercase tracking-widest text-[9px]">{canteen.status}</span>
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4 relative bg-transparent">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[#855300] font-bold uppercase tracking-widest text-[9px]">
                    <Coffee className="w-3.5 h-3.5" /> {canteen.specialty}
                  </div>
                  <h3 className="text-xl font-dmserif font-semibold text-[#0f0f10] group-hover:text-black transition-colors">{canteen.name}</h3>
                  <div className="flex items-center gap-1.5 text-neutral-400 font-medium text-xs">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> {canteen.location}
                  </div>
                </div>
                <div className="pt-4 border-t border-black/5 flex items-center justify-between mt-auto">
                  <div className="text-xs font-semibold text-neutral-400">
                    <span className="text-[#0f0f10] font-bold">{canteen.reviews}+</span> reviews
                  </div>
                  <Link href={`/canteens/${canteen.id}`} className="block">
                    <Button variant="outline" className="rounded-full h-9 group/btn border border-black/5 bg-white/60 hover:bg-white text-xs hover:border-black/10 text-[#0f0f10] transition-all font-bold px-4 gap-1.5 shadow-[0_1px_8px_rgba(0,0,0,0.01)] hover:shadow-sm">
                      View Menu & Rate
                      <TrendingUp className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Safety Section */}
      <div className="pt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-red-500/5 backdrop-blur-sm rounded-[24px] p-8 md:p-10 border border-red-500/10 flex flex-col items-center justify-center text-center space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="w-14 h-14 rounded-full bg-white/80 border border-red-500/10 flex items-center justify-center text-red-500 shadow-sm">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-dmserif font-semibold text-[#0f0f10]">See something <span className="text-red-600">unhygienic?</span></h3>
          <p className="text-neutral-500 text-xs md:text-sm leading-relaxed max-w-xs font-normal">Report hygiene issues anonymously. Our moderators escalate these issues to administrative channels instantly.</p>
          <Button variant="outline" className="rounded-full h-10 px-6 border-red-500/20 text-red-700 bg-white/60 hover:bg-white hover:border-red-500/30 transition-all font-bold text-xs shadow-sm">Report Anonymously</Button>
        </div>
        <div className="bg-[#855300]/5 backdrop-blur-sm rounded-[24px] p-8 md:p-10 border border-[#855300]/10 flex flex-col items-center justify-center text-center space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="w-14 h-14 rounded-full bg-white/80 border border-[#855300]/10 flex items-center justify-center text-[#855300] shadow-sm">
            <Info className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-dmserif font-semibold text-[#0f0f10]">Help your <span className="bg-gradient-to-r from-[#505f78] to-[#855300] bg-clip-text text-transparent font-serif italic font-normal">mains.</span></h3>
          <p className="text-neutral-500 text-xs md:text-sm leading-relaxed max-w-xs font-normal">Found a secret item? Know a tip for better combos? Share it on the ratings page to help others.</p>
          <Button className="bg-black hover:bg-[#505f78] text-white rounded-full h-10 px-6 font-bold text-xs shadow-sm transition-all active:scale-95">Contribute Tips</Button>
        </div>
      </div>
    </div>
  );
}

