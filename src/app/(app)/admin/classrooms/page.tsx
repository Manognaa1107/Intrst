"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Trash2,
  AlertTriangle,
  Clock,
  Check,
  User,
  Users,
  Search,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  HelpCircle
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/apiClient";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

export default function AdminClassroomsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [reporterModalOpen, setReporterModalOpen] = useState(false);
  const [selectedReporter, setSelectedReporter] = useState<any>(null);

  const fetchReports = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await apiFetch("/admin/classroom-reports");
      setReports(res || []);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load classroom reports");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Expiry Timer countdown ticker
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 10000); // refresh every 10 seconds
    return () => clearInterval(timer);
  }, []);

  const getMinutesRemaining = (expiresAtStr: string) => {
    const expiresAt = new Date(expiresAtStr);
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    if (diffMs <= 0) return 0;
    return Math.ceil(diffMs / (1000 * 60));
  };

  const handleDeleteReport = async (id: string) => {
    try {
      await apiFetch(`/admin/classroom-reports/${id}`, { method: "DELETE" });
      toast.success("Classroom report deleted.");
      fetchReports(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete report.");
    }
  };

  const handleMarkFalseReport = async (id: string) => {
    try {
      await apiFetch(`/admin/classroom-reports/${id}/false`, { method: "POST" });
      toast.success("Report marked false. points deducted from reporter.");
      fetchReports(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to mark false report.");
    }
  };

  const handleKeepActive = async (id: string) => {
    try {
      await apiFetch(`/admin/classroom-reports/${id}/keep-active`, { method: "POST" });
      toast.success("Report expiry extended by 1 hour!");
      fetchReports(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to extend report activity.");
    }
  };

  const handleViewReporter = (reporter: any) => {
    if (!reporter) {
      toast.error("Reporter profile details unavailable.");
      return;
    }
    setSelectedReporter(reporter);
    setReporterModalOpen(true);
  };

  // Filter reports list based on search
  const filteredReports = reports.filter(rpt => {
    const building = rpt.classroom?.building_name || "";
    const room = rpt.classroom?.room_number || "";
    const reporterName = rpt.reporter?.name || "";
    const reporterUser = rpt.reporter?.username || "";

    return searchQuery === "" ||
      building.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reporterUser.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0f0f10]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-[#faf9f6] text-[#0f0f10] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
        <div className="absolute -right-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-dmserif font-bold tracking-tight text-[#0f0f10] flex items-center gap-2">
              <Building2 className="w-8 h-8 text-[#505f78]" />
              Classrooms Moderator
            </h1>
            <p className="text-neutral-500 font-medium">
              Monitor active peer-to-peer classroom occupancy updates and moderate false reports.
            </p>
          </div>
          <Button
            onClick={() => fetchReports(true)}
            disabled={refreshing}
            variant="outline"
            className="self-start md:self-auto h-10 px-4 rounded-xl border border-black/10 bg-white text-neutral-700 hover:bg-[#f3f1eb] hover:text-black transition-all flex items-center gap-2"
          >
            <Loader2 className={`w-4 h-4 ${refreshing ? "animate-spin" : "hidden"}`} />
            {refreshing ? "Refreshing..." : "Refresh Reports"}
          </Button>
        </header>

        {/* Search */}
        <Card className="bg-white/80 backdrop-blur-md border border-black/5 rounded-[2rem] shadow-sm">
          <CardContent className="p-6 md:p-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search by building name, room number, or reporter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#faf9f6] border border-black/5 rounded-xl h-11 pl-11 pr-4 text-sm text-[#0f0f10] placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-black/20 focus-visible:border-neutral-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.length > 0 ? (
            filteredReports.map((rpt) => {
              const minutesLeft = getMinutesRemaining(rpt.expires_at);
              const isExpired = minutesLeft <= 0;
              const building = rpt.classroom?.building_name || "Unknown Building";
              const room = rpt.classroom?.room_number || "—";
              const reporterName = rpt.reporter?.name || "Student";
              const reporterUser = rpt.reporter?.username || "student";

              return (
                <Card key={rpt.id} className={`border bg-white rounded-3xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between ${isExpired ? "opacity-60 border-dashed" : "border-black/5"}`}>
                  <CardHeader className="p-6 pb-4">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-lg text-[#0f0f10] leading-snug">{building}</h4>
                        <span className="text-xl font-dmserif font-bold text-[#855300] mt-1 inline-block">Room {room}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        {rpt.status === "empty" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-none">VACANT</Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-700 border-red-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-none">OCCUPIED</Badge>
                        )}
                        {isExpired ? (
                          <span className="text-[10px] text-red-500 font-bold uppercase">Expired</span>
                        ) : (
                          <span className="text-[10px] text-neutral-400 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            {minutesLeft}m left
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="px-6 py-2 space-y-4">
                    <div className="space-y-2.5 text-xs text-neutral-500 border-b border-black/5 pb-4">
                      {/* Reporter Info */}
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-neutral-400">Reporter:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-neutral-700 hover:underline cursor-pointer" onClick={() => handleViewReporter(rpt.reporter)}>
                            {reporterName}
                          </span>
                          {rpt.reporter?.is_verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
                          )}
                        </div>
                      </div>

                      {/* Anonymous indicator */}
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-neutral-400">Anonymous Indicator:</span>
                        {rpt.is_anonymous ? (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[9px] font-bold shadow-none rounded-full px-2">ANONYMOUS</Badge>
                        ) : (
                          <span className="font-semibold text-neutral-400 text-[10px]">PUBLIC</span>
                        )}
                      </div>

                      {/* Created date/time */}
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-neutral-400">Reported At:</span>
                        <span className="font-semibold text-neutral-700">
                          {new Date(rpt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(rpt.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })})
                        </span>
                      </div>
                    </div>

                    {/* Votes / Confirms / Denies */}
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="bg-emerald-50 border border-emerald-100/50 rounded-xl p-2.5 flex flex-col justify-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-0.5">✓ Confirms</span>
                        <span className="text-sm font-bold text-emerald-800">{rpt.confirmed_count || 0}</span>
                      </div>
                      <div className="bg-red-50 border border-red-100/50 rounded-xl p-2.5 flex flex-col justify-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 mb-0.5">✕ Denials</span>
                        <span className="text-sm font-bold text-red-800">{rpt.deny_count || 0}</span>
                      </div>
                    </div>
                  </CardContent>

                  {/* Actions Footer */}
                  <div className="p-6 pt-4 flex gap-2 border-t border-black/5 bg-neutral-50/50">
                    <Button
                      onClick={() => handleKeepActive(rpt.id)}
                      disabled={isExpired}
                      size="sm"
                      className="flex-1 bg-black hover:bg-neutral-800 text-white rounded-xl h-9 text-xs font-semibold gap-1.5 shadow-sm disabled:opacity-40"
                    >
                      <Check className="w-3.5 h-3.5" /> Keep Active
                    </Button>

                    <Button
                      onClick={() => handleMarkFalseReport(rpt.id)}
                      size="sm"
                      variant="outline"
                      className="border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl h-9 text-xs font-semibold gap-1"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" /> Mark False
                    </Button>

                    <Button
                      onClick={() => handleDeleteReport(rpt.id)}
                      size="sm"
                      variant="outline"
                      className="border border-red-200 text-red-600 hover:bg-red-50 rounded-xl h-9 text-xs font-semibold gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </Button>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 bg-white border border-black/5 rounded-[2.5rem] text-neutral-500">
              <CheckCircle2 className="w-16 h-16 text-emerald-500/60 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#0f0f10]">All Clean</h3>
              <p className="text-sm text-neutral-400 mt-1 max-w-sm mx-auto">There are no classroom reports listed at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: View Reporter Details */}
      <Dialog open={reporterModalOpen} onOpenChange={setReporterModalOpen}>
        <DialogContent className="bg-white border border-black/5 text-[#0f0f10] max-w-sm sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-dmserif text-2xl">Reporter Profile Details</DialogTitle>
            <DialogDescription>Full student identity details (admin visibility only).</DialogDescription>
          </DialogHeader>
          {selectedReporter && (
            <div className="py-4 space-y-4 text-left">
              <div className="flex items-center gap-3 p-4 bg-[#faf9f6] border border-black/5 rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-bold shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold leading-tight flex items-center gap-1.5">
                    {selectedReporter.name}
                    {selectedReporter.is_verified && (
                      <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-500/10" />
                    )}
                  </h3>
                  <span className="text-xs text-neutral-500">@{selectedReporter.username}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                <div className="space-y-1">
                  <span className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400">User Role</span>
                  <span className="text-[#0f0f10] capitalize">{selectedReporter.role || "Student"}</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400">Activity Points</span>
                  <span className="text-[#855300] font-bold">{selectedReporter.points || 0} pts</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => { setReporterModalOpen(false); setSelectedReporter(null); }}
              className="bg-black hover:bg-neutral-800 text-white rounded-xl font-semibold h-11 w-full"
            >
              Close Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
