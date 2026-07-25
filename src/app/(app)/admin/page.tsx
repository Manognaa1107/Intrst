"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  ClipboardList, 
  AlertCircle, 
  Check, 
  X, 
  RefreshCw,
  Clock,
  ArrowUpRight,
  Activity,
  UserPlus,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Trash2
} from "lucide-react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/apiClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard, AdminCardContent } from "@/components/admin/AdminCard";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminPageLoader } from "@/components/admin/AdminSkeleton";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("clubs");

  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await apiFetch("/admin/stats");
      setData(res);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveClub = async (id: string) => {
    try {
      await apiFetch(`/admin/club-requests/${id}/approve`, { method: "POST" });
      toast.success("Club approved successfully!");
      fetchData(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to approve club.");
    }
  };

  const handleRejectClub = async (id: string) => {
    try {
      await apiFetch(`/admin/club-requests/${id}/reject`, { method: "POST" });
      toast.success("Club request rejected.");
      fetchData(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to reject club.");
    }
  };

  const handleRemoveContent = async (contentId: string, contentType: string) => {
    try {
      await apiFetch(`/admin/remove-content/${contentId}`, {
        method: "DELETE",
        body: JSON.stringify({ contentType })
      });
      toast.success("Content removed successfully!");
      fetchData(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to remove content.");
    }
  };

  const handleDismissReport = async (id: string) => {
    try {
      await apiFetch(`/admin/reports/${id}`, { method: "DELETE" });
      toast.success("Report dismissed.");
      fetchData(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to dismiss report.");
    }
  };

  if (loading) {
    return <AdminPageLoader text="Loading platform management overview..." />;
  }

  const stats = data?.stats || {
    totalStudents: 0,
    verifiedStudents: 0,
    totalClubs: 0,
    totalEvents: 0,
    activeVacantClassrooms: 0,
    pendingClubRequests: 0,
    pendingEvents: 0,
    totalReports: 0
  };

  // 8 Statistics Cards
  const kpiCards = [
    {
      title: "Total Students",
      description: "Registered student accounts",
      icon: <Users className="w-5 h-5 text-[#505f78]" />,
      count: stats.totalStudents.toLocaleString(),
      href: "/admin/user-management"
    },
    {
      title: "Verified Students",
      description: "Verified GITAM credentials",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      count: stats.verifiedStudents.toLocaleString(),
      href: "/admin/user-management?tab=verified"
    },
    {
      title: "Active Clubs",
      description: "Approved student organizations",
      icon: <Users className="w-5 h-5 text-[#855300]" />,
      count: stats.totalClubs.toLocaleString(),
      href: "/admin/clubs"
    },
    {
      title: "Upcoming Events",
      description: "Scheduled campus events",
      icon: <Calendar className="w-5 h-5 text-purple-700" />,
      count: stats.totalEvents.toLocaleString(),
      href: "/admin/events"
    },
    {
      title: "Active Classroom Reports",
      description: "Reported vacant classrooms",
      icon: <Building2 className="w-5 h-5 text-teal-700" />,
      count: stats.activeVacantClassrooms.toLocaleString(),
      href: "/admin/classrooms"
    },
    {
      title: "Pending Club Requests",
      description: "Applications awaiting review",
      icon: <ClipboardList className="w-5 h-5 text-amber-700" />,
      count: stats.pendingClubRequests.toLocaleString(),
      href: "/admin/clubs?tab=pending"
    },
    {
      title: "Pending Event Requests",
      description: "Events awaiting moderation",
      icon: <Clock className="w-5 h-5 text-rose-600" />,
      count: stats.pendingEvents.toLocaleString(),
      href: "/admin/events?tab=pending"
    },
    {
      title: "Open Reports",
      description: "Flagged issues & safety flags",
      icon: <AlertCircle className="w-5 h-5 text-neutral-600" />,
      count: stats.totalReports.toLocaleString(),
      href: "/admin/reports"
    }
  ];

  const clubRequests = data?.pendingApprovals?.clubRequests || [];
  const eventRequests = data?.pendingApprovals?.eventRequests || [];
  const classroomReports = data?.pendingApprovals?.classroomReports || [];
  const reportsList = data?.pendingApprovals?.reports || [];
  const recentActivity = data?.recentActivity || [];

  const totalPendingCount = clubRequests.length + eventRequests.length + classroomReports.length + reportsList.length;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "student_registered":
        return <UserPlus className="w-4 h-4 text-emerald-600" />;
      case "club_submitted":
        return <ClipboardList className="w-4 h-4 text-amber-600" />;
      case "event_created":
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case "classroom_report_submitted":
        return <Building2 className="w-4 h-4 text-teal-600" />;
      default:
        return <Activity className="w-4 h-4 text-[#505f78]" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Admin Dashboard Title & Header */}
      <AdminPageHeader
        title="Admin Dashboard"
        description="Platform management overview, campus statistics, pending approvals queue, and administrative activity logs."
        action={
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={() => fetchData(true)}
            isLoading={refreshing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Dashboard
          </AdminButton>
        }
      />

      {/* 8 Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.02 }}
          >
            <AdminCard
              hoverable
              onClick={() => router.push(card.href)}
              className="cursor-pointer group h-full"
            >
              <AdminCardContent className="p-5 flex flex-col justify-between h-full space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-white/60 border border-black/5 shrink-0">
                    {card.icon}
                  </div>
                  <span className="text-2xl font-bold font-mono text-[#0f0f10]">
                    {card.count}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-[#0f0f10] flex items-center justify-between group-hover:text-black font-dmserif">
                    <span className="truncate">{card.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-1" />
                  </div>
                  <p className="text-xs text-neutral-500 font-normal leading-snug">
                    {card.description}
                  </p>
                </div>
              </AdminCardContent>
            </AdminCard>
          </motion.div>
        ))}
      </div>

      {/* Sections Below Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pending Approvals Section */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-dmserif text-[#0f0f10]">Pending Approvals</h2>
              <p className="text-xs text-neutral-500 font-medium">Items requiring moderation & approval</p>
            </div>
            {totalPendingCount > 0 && (
              <AdminBadge status="pending">{totalPendingCount} Pending</AdminBadge>
            )}
          </div>

          <Tabs defaultValue="clubs" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-[#f0ede6] border border-black/5 p-1 rounded-xl w-full sm:w-auto flex overflow-x-auto gap-1">
              <TabsTrigger value="clubs" className="data-[state=active]:bg-white data-[state=active]:text-[#0f0f10] data-[state=active]:shadow-sm text-neutral-500 rounded-lg flex-1 sm:flex-initial text-xs py-2 px-4 font-semibold">
                Clubs ({clubRequests.length})
              </TabsTrigger>
              <TabsTrigger value="events" className="data-[state=active]:bg-white data-[state=active]:text-[#0f0f10] data-[state=active]:shadow-sm text-neutral-500 rounded-lg flex-1 sm:flex-initial text-xs py-2 px-4 font-semibold">
                Events ({eventRequests.length})
              </TabsTrigger>
              <TabsTrigger value="classrooms" className="data-[state=active]:bg-white data-[state=active]:text-[#0f0f10] data-[state=active]:shadow-sm text-neutral-500 rounded-lg flex-1 sm:flex-initial text-xs py-2 px-4 font-semibold">
                Classrooms ({classroomReports.length})
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-white data-[state=active]:text-[#0f0f10] data-[state=active]:shadow-sm text-neutral-500 rounded-lg flex-1 sm:flex-initial text-xs py-2 px-4 font-semibold">
                Reports ({reportsList.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clubs" className="pt-4 space-y-3">
              {clubRequests.length === 0 ? (
                <AdminEmptyState
                  icon={<ClipboardList className="w-8 h-8 text-neutral-400" />}
                  title="No pending club requests"
                  description="Everything is up to date."
                />
              ) : (
                clubRequests.map((req: any) => (
                  <AdminCard key={req.id}>
                    <AdminCardContent className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-base text-[#0f0f10] font-dmserif">{req.club_name}</h4>
                        <p className="text-xs text-neutral-500 mt-1">Requested by: {req.club_email}</p>
                        {req.justification && (
                          <p className="text-xs text-neutral-600 mt-2 italic bg-neutral-50 p-2.5 rounded-xl border border-black/5">
                            "{req.justification}"
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <AdminButton
                          onClick={() => handleApproveClub(req.id)}
                          size="sm"
                          variant="success"
                          leftIcon={<Check className="w-3.5 h-3.5" />}
                        >
                          Approve
                        </AdminButton>
                        <AdminButton
                          onClick={() => handleRejectClub(req.id)}
                          size="sm"
                          variant="destructive"
                          leftIcon={<X className="w-3.5 h-3.5" />}
                        >
                          Reject
                        </AdminButton>
                      </div>
                    </AdminCardContent>
                  </AdminCard>
                ))
              )}
            </TabsContent>

            <TabsContent value="events" className="pt-4 space-y-3">
              {eventRequests.length === 0 ? (
                <AdminEmptyState
                  icon={<Calendar className="w-8 h-8 text-neutral-400" />}
                  title="No pending event requests"
                  description="Everything is up to date."
                />
              ) : (
                eventRequests.map((evt: any) => (
                  <AdminCard key={evt.event_id}>
                    <AdminCardContent className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="font-bold text-base text-[#0f0f10] font-dmserif">{evt.title}</h4>
                        <p className="text-xs text-neutral-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" /> {evt.location}
                        </p>
                        <p className="text-xs text-neutral-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" /> {new Date(evt.started_at).toLocaleString()}
                        </p>
                        <p className="text-xs text-neutral-600 mt-2 line-clamp-2">{evt.description}</p>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <AdminButton
                          onClick={() => handleRemoveContent(evt.event_id, "event")}
                          size="sm"
                          variant="destructive"
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                        >
                          Delete
                        </AdminButton>
                      </div>
                    </AdminCardContent>
                  </AdminCard>
                ))
              )}
            </TabsContent>

            <TabsContent value="classrooms" className="pt-4 space-y-3">
              {classroomReports.length === 0 ? (
                <AdminEmptyState
                  icon={<Building2 className="w-8 h-8 text-neutral-400" />}
                  title="No active classroom reports"
                  description="Everything is up to date."
                />
              ) : (
                classroomReports.map((rpt: any) => {
                  const roomInfo = rpt.classrooms ? `${rpt.classrooms.building_name} - ${rpt.classrooms.room_number}` : `Room #${rpt.classroom_id}`;
                  return (
                    <AdminCard key={rpt.id}>
                      <AdminCardContent className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                          <h4 className="font-bold text-base text-[#0f0f10] font-dmserif">{roomInfo}</h4>
                          <p className="text-xs text-neutral-500 mt-1">
                            Status: <span className="font-bold capitalize text-teal-600">{rpt.status}</span>
                          </p>
                          <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                            <Clock className="w-3.5 h-3.5 text-neutral-400" /> Expires: {new Date(rpt.expires_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <AdminButton
                            onClick={() => router.push("/admin/classrooms")}
                            size="sm"
                            variant="secondary"
                          >
                            View Registry
                          </AdminButton>
                        </div>
                      </AdminCardContent>
                    </AdminCard>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="reports" className="pt-4 space-y-3">
              {reportsList.length === 0 ? (
                <AdminEmptyState
                  icon={<AlertCircle className="w-8 h-8 text-neutral-400" />}
                  title="No reported content items"
                  description="Everything is up to date."
                />
              ) : (
                reportsList.map((rpt: any) => (
                  <AdminCard key={rpt.id}>
                    <AdminCardContent className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-semibold capitalize border-amber-200 text-amber-700 bg-amber-50 rounded-lg">
                            {rpt.content_type || "Content"}
                          </Badge>
                          <span className="text-xs text-neutral-400">ID: {rpt.content_id}</span>
                        </div>
                        <p className="text-sm font-semibold text-[#0f0f10] mt-2 font-dmserif">Reason: {rpt.reason || "No reason given."}</p>
                        <p className="text-xs text-neutral-500 mt-1">Reported by: {rpt.reporter_id || "Anonymous"}</p>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <AdminButton
                          onClick={() => handleRemoveContent(rpt.content_id, rpt.content_type || "post")}
                          size="sm"
                          variant="destructive"
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                        >
                          Remove
                        </AdminButton>
                        <AdminButton
                          onClick={() => handleDismissReport(rpt.id)}
                          size="sm"
                          variant="secondary"
                          leftIcon={<Check className="w-3.5 h-3.5" />}
                        >
                          Dismiss
                        </AdminButton>
                      </div>
                    </AdminCardContent>
                  </AdminCard>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Recent Activity Section */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-dmserif text-[#0f0f10]">Recent Activity</h2>
              <p className="text-xs text-neutral-500 font-medium">Administrative audit and platform event stream</p>
            </div>
            <Activity className="w-4 h-4 text-[#505f78]" />
          </div>

          <AdminCard>
            <AdminCardContent className="p-5">
              {recentActivity.length === 0 ? (
                <AdminEmptyState
                  insideCard={false}
                  icon={<Activity className="w-7 h-7 text-neutral-400" />}
                  title="No recent activity"
                  description="Administrative activity will appear here."
                />
              ) : (
                <div className="relative space-y-4 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-px before:bg-black/5">
                  {recentActivity.map((act: any, idx: number) => (
                    <div key={act.id || idx} className="relative flex items-start gap-3 pl-1">
                      <div className="w-7 h-7 rounded-full bg-white/60 border border-black/10 flex items-center justify-center shrink-0 z-10 shadow-sm">
                        {getActivityIcon(act.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#0f0f10] leading-snug">
                          {act.title}
                        </p>
                        <span className="text-[10px] text-neutral-400 font-medium">
                          {act.timestamp ? new Date(act.timestamp).toLocaleString() : "Just now"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AdminCardContent>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
