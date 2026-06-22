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
    <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-12 bg-background">
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-4">
          <Badge className="bg-[#505f78]/10 text-[#505f78] border border-[#505f78]/20 rounded-full px-4 py-1.5 font-bold uppercase tracking-widest text-[10px]">
            Campus Utility
          </Badge>
          <h1 className="text-5xl md:text-7xl font-dmserif font-bold tracking-tight text-[#0f0f10] leading-[1.1]">
            Canteen <span className="bg-gradient-to-r from-[#505f78] to-[#855300] bg-clip-text text-transparent font-serif italic font-normal">Truths</span>.
          </h1>
          <p className="text-neutral-500 text-xl max-w-2xl font-medium">
            Which Biryani actually hits? Where is the queue the shortest? Student-sourced ratings for every outlet on campus.
          </p>
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-4 items-center bg-white border border-black/5 p-2 rounded-[2.5rem] shadow-sm">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a canteen..."
              className="w-full bg-transparent border-none rounded-full h-14 pl-14 pr-6 outline-none text-[#0f0f10] font-medium placeholder:text-neutral-400"
            />
          </div>
          <Button className="rounded-full h-14 w-14 bg-black hover:bg-[#505f78] text-white shrink-0 shadow-sm">
            <Filter className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {currentUserRole === 'super_admin' || currentUserRole === 'founder' || currentUserRole === 'moderator' ? (
        <div className="flex justify-end mt-4">
          <Button className="bg-black text-white hover:bg-[#505f78] font-bold gap-2 rounded-full px-6 h-11 shadow-sm">
            + Add Canteen
          </Button>
        </div>
      ) : null}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <div className="text-neutral-500 font-medium">Loading canteens...</div>
        ) : (
          canteens.map((canteen) => (
            <Card key={canteen.id} className="rounded-[2rem] bg-white border border-black/5 overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 flex flex-col group">
              <div className="h-64 relative overflow-hidden">
                <img
                  src={canteen.image}
                  alt={canteen.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
                <div className="absolute top-6 left-6 flex gap-2">
                  <Badge className="bg-white/90 backdrop-blur-sm rounded-full border border-black/5 text-[#0f0f10] font-bold h-10 px-5 flex items-center gap-2 shadow-sm">
                    <Star className="w-4 h-4 text-[#855300] fill-[#855300]" /> {canteen.rating}
                  </Badge>
                </div>
                <div className="absolute top-6 right-6">
                  <Badge className={`rounded-full h-10 px-5 flex items-center gap-2 border shadow-md ${canteen.status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                    <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">{canteen.status}</span>
                  </Badge>
                </div>
              </div>
              <CardContent className="p-8 flex-1 flex flex-col justify-between space-y-6 relative">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#855300] font-bold uppercase tracking-widest text-[10px]">
                    <Coffee className="w-4 h-4" /> {canteen.specialty}
                  </div>
                  <h3 className="text-2xl font-dmserif font-bold text-[#0f0f10]">{canteen.name}</h3>
                  <div className="flex items-center gap-2 text-neutral-500 font-medium text-sm">
                    <MapPin className="w-4 h-4 text-rose-500" /> {canteen.location}
                  </div>
                </div>
                <div className="pt-6 border-t border-black/5 flex items-center justify-between">
                  <div className="text-sm font-medium text-neutral-500">
                    <span className="text-[#0f0f10] font-bold">{canteen.reviews}+</span> reviews
                  </div>
                  <Link href={`/canteens/${canteen.id}`} className="block">
                    <Button variant="outline" className="rounded-full h-11 group/btn border border-black/10 text-[#0f0f10] hover:bg-[#f3f1eb] transition-all font-bold px-6 gap-2">
                      View Menu & Rate
                      <TrendingUp className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Safety Section */}
      <div className="pt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-rose-50/50 rounded-[2.5rem] p-12 border border-rose-100 flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-rose-100/50 flex items-center justify-center text-rose-600 mb-2">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h3 className="text-4xl font-dmserif font-bold text-[#0f0f10]">See something <span className="text-rose-600">unhygienic?</span></h3>
          <p className="text-neutral-500 text-lg px-8 font-medium">Report hygiene issues anonymously. Our moderators escalate these issues to administrative channels instantly.</p>
          <Button variant="outline" className="rounded-full h-12 px-10 border-rose-200 text-rose-700 hover:bg-rose-50 font-bold shadow-sm">Report Anonymously</Button>
        </div>
        <div className="bg-neutral-50 rounded-[2.5rem] p-12 border border-neutral-100 flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-[#855300] mb-2">
            <Info className="w-10 h-10" />
          </div>
          <h3 className="text-4xl font-dmserif font-bold text-[#0f0f10]">Help your <span className="bg-gradient-to-r from-[#505f78] to-[#855300] bg-clip-text text-transparent font-serif italic font-normal">mains.</span></h3>
          <p className="text-neutral-500 text-lg px-8 font-medium">Found a secret item? Know a tip for better combos? Share it on the ratings page to help others.</p>
          <Button className="bg-black hover:bg-[#505f78] text-white rounded-full h-12 px-10 font-bold shadow-sm">Contribute Tips</Button>
        </div>
      </div>
    </div>
  );
}
