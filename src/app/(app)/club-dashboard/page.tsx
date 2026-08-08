"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, UsersIcon, CalendarIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/apiClient";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function ClubDashboardPage() {
  const { role, isAuthLoading, user_id, name } = useUser();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ events: 0, posts: 0 });

  useEffect(() => {
    if (!isAuthLoading) {
      if (role !== "club") {
        router.push("/home");
      } else {
        // Fetch simple stats
        const fetchStats = async () => {
          try {
            const [eventsRes, postsRes] = await Promise.all([
              supabase.from("events").select("event_id", { count: "exact" }).eq("host_id", user_id),
              supabase.from("posts").select("id", { count: "exact" }).eq("author_id", user_id)
            ]);
            
            setStats({
              events: eventsRes.count || 0,
              posts: postsRes.count || 0
            });
          } catch (e) {
            console.error("Error fetching club stats", e);
          } finally {
            setLoading(false);
          }
        };
        fetchStats();
      }
    }
  }, [role, isAuthLoading, router, user_id]);

  if (isAuthLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (role !== "club") return null;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0f0f10]">Club Dashboard</h1>
          <p className="text-neutral-500 mt-1">Welcome back, {name || "Club Admin"}!</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-black text-white hover:bg-[#505f78] rounded-full">
            <PlusIcon className="w-4 h-4 mr-2" /> New Event
          </Button>
          <Link href="/profile/me">
            <Button variant="outline" className="rounded-full">
              <SettingsIcon className="w-4 h-4 mr-2" /> Profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/60 backdrop-blur-sm border-black/5 rounded-[24px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-neutral-500 font-medium flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" /> Events Hosted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.events}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border-black/5 rounded-[24px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-neutral-500 font-medium flex items-center gap-2">
              <UsersIcon className="w-4 h-4" /> Posts Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.posts}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-white/60 backdrop-blur-sm border-black/5 rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-lg">Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-500">No events found. Start by creating one!</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border-black/5 rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-lg">Club Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-500">No recent activity.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
