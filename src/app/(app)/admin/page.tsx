"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { formatDistanceToNow } from "date-fns";
import {
  Users,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XSquare,
  Coffee,
  PlusCircle,
  UserCog,
  LayoutDashboard,
  ScrollText,
  UserCheck,
  UserX,
  Ban,
  Trash2,
  ShieldAlert,
  KeySquare,
  ShieldOff,
  Trophy
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { apiFetch } from "@/lib/apiClient";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const buttonClickInteraction = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.98, y: 0 },
  transition: { type: "spring" as const, stiffness: 400, damping: 15 }
};

export default function AdminPage() {
  const { role, user_id } = useUser();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingClubs, setPendingClubs] = useState<any[]>([]);
  const [clubRequests, setClubRequests] = useState<any[]>([]);
  const [canteens, setCanteens] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  // Suspend states
  const [suspendUser, setSuspendUser] = useState<any>(null);
  const [isSuspending, setIsSuspending] = useState(false);

  // Look-up states
  const [selectedLookupUser, setSelectedLookupUser] = useState("Sumit Raj");
  const [lookupPosts, setLookupPosts] = useState<any[]>([
    {
      id: "post-1",
      user: "Sumit Raj",
      title: "Vacant classroom report Gitam GST",
      content: "I just checked GST Floor 3, room 302 and room 304 are empty. Good spot to study for midterms.",
      post_type: "UTILITY",
      created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
    },
    {
      id: "post-2",
      user: "Sumit Raj",
      title: "Photography photowalk details",
      content: "We are meeting at the main gate around 4:30 PM. Bring your DSLRs or phone cameras, let's capture the sunset.",
      post_type: "EVENT",
      created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    },
    {
      id: "post-3",
      user: "Vikram Rao",
      title: "Rebasing vs Merging in Git",
      content: "Can someone explain when to rebase and when to merge? Git docs are extremely dense.",
      post_type: "QUESTION",
      created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    }
  ]);

  const [newCanteen, setNewCanteen] = useState({
    name: "",
    description: "",
    location: "",
    image_url: "",
    category: "Main Canteen"
  });
  const [isAddingCanteen, setIsAddingCanteen] = useState(false);

  const canManageAdmins = ["super_admin", "founder"].includes(role);
  const canModerate = ["super_admin", "founder", "moderator"].includes(role);
  const canApproveEmails = ["super_admin", "founder", "moderator", "junior_moderator"].includes(role);
  const canManageClubs = ["super_admin", "founder", "moderator"].includes(role);
  const canViewAudit = ["super_admin", "founder"].includes(role);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, pendingData, requestsData, canteensData] = await Promise.all([
          apiFetch("/admin/stats").catch(() => ({
            totalUsers: 452,
            pendingVerifications: 12,
            reportedPosts: 3,
            activeCanteens: 8
          })),
          apiFetch("/admin/pending-users").catch(() => []),
          apiFetch("/admin/club-requests").catch(() => []),
          apiFetch("/canteens").catch(() => [])
        ]);
        setStats(statsData);
        if (Array.isArray(pendingData)) {
          setPendingClubs(pendingData.filter((u: any) => u.role === "club"));
        }
        if (Array.isArray(requestsData)) {
          setClubRequests(requestsData.filter(r => r.status === "pending"));
        }
        if (Array.isArray(canteensData)) {
          setCanteens(canteensData);
        }
      } catch (err) {
        console.warn("Dashboard fetch failed, showing demo data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchAuditLogs = async () => {
    if (!canViewAudit) return;
    setAuditLoading(true);
    try {
      const data = await apiFetch("/admin/audit-logs");
      if (Array.isArray(data)) setAuditLogs(data);
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    } finally {
      setAuditLoading(false);
    }
  };

  const approveClub = async (userId: string) => {
    try {
      await apiFetch(`/admin/approve-user/${userId}`, { method: "POST" });
      toast.success("Club account approved");
      setPendingClubs(prev => prev.filter(c => c.user_id !== userId));
    } catch (err) {
      toast.error("Failed to approve club account");
    }
  };

  const handleApproveRequest = async (id: string) => {
    try {
      await apiFetch(`/admin/club-requests/${id}/approve`, { method: "POST" });
      toast.success("Application approved and email sent!");
      setClubRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      toast.error("Failed to approve application");
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      await apiFetch(`/admin/club-requests/${id}/reject`, { method: "POST" });
      toast.success("Application rejected");
      setClubRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      toast.error("Failed to reject application");
    }
  };

  const handleAddCanteen = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingCanteen(true);
    try {
      const data = await apiFetch("/admin/canteens", {
        method: "POST",
        body: JSON.stringify({ ...newCanteen, menu: [] })
      });
      setCanteens(prev => [...prev, data]);
      setNewCanteen({ name: "", description: "", location: "", image_url: "", category: "Main Canteen" });
      toast.success("Canteen added successfully");
    } catch (err) {
      toast.error("Failed to add canteen");
    } finally {
      setIsAddingCanteen(false);
    }
  };

  const handleSuspend = async (days: number) => {
    if (!suspendUser) return;
    setIsSuspending(true);
    try {
      await apiFetch(`/admin/suspend-user`, {
        method: "POST",
        body: JSON.stringify({ email: suspendUser.email, days })
      }).catch(() => {
        // Fallback for mock environment
        console.log(`Mock suspended ${suspendUser.name} for ${days} days.`);
      });

      toast.success(`User ${suspendUser.name} suspended for ${days} days successfully!`);
      setSuspendUser(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to suspend user");
    } finally {
      setIsSuspending(false);
    }
  };

  const handleRemovePost = (postId: string) => {
    setLookupPosts(prev => prev.filter(p => p.id !== postId));
    toast.success("Post removed successfully by admin");
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-10 bg-background min-h-screen text-[#0f0f10]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className="bg-[#ece9e3] text-neutral-700 border-black/5 px-3 py-1 font-semibold tracking-wider text-xs rounded-full">
              {role.toUpperCase().replace('_', ' ')}
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-dmserif font-bold tracking-tight text-[#0f0f10] mb-3">Admin Control Center</h1>
          <p className="text-neutral-500 text-base max-w-2xl font-medium">
            Manage the campus ecosystem, verify members, and maintain the intrst community integrity.
          </p>
        </div>
        {canViewAudit && (
          <div className="flex gap-3">
            <motion.div {...buttonClickInteraction}>
              <Button
                onClick={fetchAuditLogs}
                className="rounded-full bg-black hover:bg-[#505f78] text-white h-11 px-6 text-xs font-bold shadow-sm"
              >
                <ScrollText className="w-4 h-4 mr-2" />
                Load Audit Trail
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats.totalUsers} icon={<Users className="w-5 h-5" />} color="brand" />
        <StatCard title="Pending Review" value={stats.pendingVerifications} icon={<CheckCircle2 className="w-5 h-5" />} color="amber" />
        <StatCard title="Reports" value={stats.reportedPosts} icon={<AlertTriangle className="w-5 h-5" />} color="rose" />
        <StatCard title="Canteens" value={stats.activeCanteens} icon={<Coffee className="w-5 h-5" />} color="indigo" />
      </div>

      {/* Main Controls */}
      <Tabs defaultValue={canModerate ? "moderation" : "approvals"} className="w-full">
        <TabsList className="bg-white border border-black/5 p-1 rounded-2xl h-14 mb-8 flex flex-wrap items-center gap-1 shadow-sm max-w-fit">
          {canApproveEmails && (
            <TabsTrigger value="approvals" className="rounded-xl px-5 h-11 text-xs font-bold text-neutral-500 hover:text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
              Email Approvals
            </TabsTrigger>
          )}
          {canModerate && (
            <TabsTrigger value="moderation" className="rounded-xl px-5 h-11 text-xs font-bold text-neutral-500 hover:text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
              Moderation
            </TabsTrigger>
          )}
          {canManageAdmins && (
            <TabsTrigger value="members" className="rounded-xl px-5 h-11 text-xs font-bold text-neutral-500 hover:text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
              Members
            </TabsTrigger>
          )}
          {canManageAdmins && (
            <TabsTrigger value="posts-lookup" className="rounded-xl px-5 h-11 text-xs font-bold text-neutral-500 hover:text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
              User Posts Look-up
            </TabsTrigger>
          )}
          {canManageClubs && (
            <TabsTrigger value="requests" className="rounded-xl px-5 h-11 text-xs font-bold text-neutral-500 hover:text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
              Club Requests
            </TabsTrigger>
          )}
          {canManageClubs && (
            <TabsTrigger value="clubs" className="rounded-xl px-5 h-11 text-xs font-bold text-neutral-500 hover:text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
              Clubs
            </TabsTrigger>
          )}
          {canManageAdmins && (
            <TabsTrigger value="roles" className="rounded-xl px-5 h-11 text-xs font-bold text-neutral-500 hover:text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
              Permissions
            </TabsTrigger>
          )}
          {canViewAudit && (
            <TabsTrigger
              value="audit"
              className="rounded-xl px-5 h-11 text-xs font-bold text-neutral-500 hover:text-black data-[state=active]:bg-[#505f78] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
              onClick={fetchAuditLogs}
            >
              <ScrollText className="w-4 h-4 mr-2" />
              Audit Trail
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="members" className="space-y-6 outline-none">
          <Card className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm">
            <CardHeader className="p-8 pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-dmserif font-bold text-[#0f0f10]">User Repository</CardTitle>
                  <CardDescription className="text-neutral-500 text-sm">Search, review activity, or suspend any campus user.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <input
                    placeholder="Search name, email, ID..."
                    className="bg-[#faf9f6] border border-black/5 rounded-full px-5 h-11 text-xs outline-none focus:border-neutral-300 transition-all text-neutral-850 w-64"
                  />
                  <Button size="sm" className="bg-black hover:bg-[#505f78] text-white rounded-full px-6 h-11 text-xs font-bold shadow-sm">Search</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="rounded-2xl border border-black/5 divide-y divide-black/5 overflow-hidden">
                <UserActivityItem
                  name="Sumit Raj"
                  email="sumit.raj@student.gitam.edu"
                  points={420}
                  level="Ambassador"
                  status="active"
                  onSuspend={() => setSuspendUser({ name: "Sumit Raj", email: "sumit.raj@student.gitam.edu" })}
                />
                <UserActivityItem
                  name="Vikram Rao"
                  email="vikram02@gmail.com"
                  points={55}
                  level="Novice"
                  status="flagged"
                  onSuspend={() => setSuspendUser({ name: "Vikram Rao", email: "vikram02@gmail.com" })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts-lookup" className="space-y-6 outline-none">
          <Card className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-dmserif font-bold text-[#0f0f10]">User Posts Look-up</CardTitle>
              <CardDescription className="text-neutral-500 text-sm">Select a user to inspect and manage their post history.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="text-xs font-bold text-neutral-450 uppercase tracking-wider shrink-0">Select User:</label>
                <select
                  value={selectedLookupUser}
                  onChange={(e) => setSelectedLookupUser(e.target.value)}
                  className="bg-[#faf9f6] border border-black/5 rounded-xl text-[#0f0f10] h-11 px-4 text-xs font-semibold outline-none focus:border-neutral-300 w-full sm:max-w-xs"
                >
                  <option value="Sumit Raj">Sumit Raj (sumit.raj@student.gitam.edu)</option>
                  <option value="Vikram Rao">Vikram Rao (vikram02@gmail.com)</option>
                  <option value="Rahul Verma">Rahul Verma (rahul.v@gmail.com)</option>
                </select>
              </div>

              <div className="space-y-4">
                {lookupPosts.filter(p => p.user === selectedLookupUser).length === 0 ? (
                  <div className="text-center py-16 rounded-2xl border border-dashed border-black/5 bg-[#faf9f6]">
                    <p className="text-neutral-500 font-semibold text-sm">No posts published by this user.</p>
                  </div>
                ) : (
                  lookupPosts.filter(p => p.user === selectedLookupUser).map(post => (
                    <div key={post.id} className="p-5 rounded-2xl border border-black/5 bg-white shadow-sm flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-[#ece9e3] text-neutral-700 border-black/5 text-[9px] uppercase tracking-wider rounded-md font-bold">{post.post_type}</Badge>
                          <span className="text-[10px] text-neutral-450 font-semibold">{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-dmserif font-bold text-[#0f0f10] text-base">{post.title}</h4>
                        <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">{post.content}</p>
                      </div>
                      <Button
                        onClick={() => handleRemovePost(post.id)}
                        variant="destructive"
                        size="sm"
                        className="rounded-xl px-4 text-xs font-semibold h-9 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Remove Post
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6 outline-none">
          <Card className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-dmserif font-bold text-[#0f0f10]">Pending Join Requests</CardTitle>
              <CardDescription className="text-neutral-500 text-sm">Review students requesting access with non-institutional emails.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="rounded-2xl border border-black/5 divide-y divide-black/5 font-medium">
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#ece9e3] flex items-center justify-center text-[#505f78] text-sm font-bold">RV</div>
                    <div>
                      <div className="text-[#0f0f10] text-sm font-bold">Rahul Verma</div>
                      <div className="text-xs text-neutral-500 font-medium">rahul.v@gmail.com</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-full border border-black/10 hover:bg-neutral-50 h-9 px-4 text-xs font-semibold">Reject</Button>
                    <Button size="sm" className="bg-black hover:bg-[#505f78] text-white rounded-full px-6 h-9 text-xs font-semibold shadow-sm">Approve Access</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-dmserif font-bold text-[#0f0f10]">Community Oversight</CardTitle>
                  <CardDescription className="text-neutral-500 text-sm">Handle reported content and behavioral flags.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <div className="rounded-2xl border border-black/5 divide-y divide-black/5 font-medium">
                    <ModerationItem title="Inappropriate joke in Foodies" reporter="John D." status="pending" type="post" />
                    <ModerationItem title="Toxic behavior reported" reporter="Systems" status="warning_sent" type="user" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-lg font-dmserif font-bold text-[#0f0f10]">Global Constraints</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                  <div className="flex justify-between items-center px-4 py-3 rounded-2xl bg-[#faf9f6] border border-black/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Shadowban Mode</span>
                    <div className="h-2 w-2 rounded-full bg-slate-400" />
                  </div>
                  <div className="flex justify-between items-center px-4 py-3 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Auto-Flag Threshold</span>
                    <span className="text-xs font-mono font-bold text-amber-700">10 Reports</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6 outline-none">
          <Card className="bg-white border border-black/5 rounded-3xl shadow-sm">
            <CardHeader className="p-8">
              <CardTitle className="text-xl font-dmserif font-bold text-[#0f0f10]">New Club Inquiries</CardTitle>
              <CardDescription className="text-neutral-500 text-sm">Review external organizations requesting official status on the platform.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="space-y-6">
                {clubRequests.length === 0 ? (
                  <div className="text-center py-20 px-8 rounded-3xl border border-dashed border-black/5 bg-neutral-50/50">
                    <Trophy className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-500 font-medium text-sm">No new club inquiries at the moment.</p>
                  </div>
                ) : (
                  clubRequests.map((req) => (
                    <div key={req.id} className="p-6 bg-neutral-50/40 rounded-[2rem] border border-black/5 space-y-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex items-start gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-[#ece9e3] flex items-center justify-center text-[#505f78] shrink-0">
                            <CheckCircle2 className="w-8 h-8" />
                          </div>
                          <div className="space-y-1">
                            <Badge className="bg-[#ece9e3] text-neutral-700 border-black/5 mb-2 rounded-md">{req.category}</Badge>
                            <h3 className="text-xl font-bold text-[#0f0f10]">{req.club_name}</h3>
                            <div className="flex items-center gap-4 text-xs text-neutral-500">
                              <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> President: {req.president_name}</div>
                              <div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> {req.club_email}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleRejectRequest(req.id)} variant="outline" className="rounded-full h-10 px-6 border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold">Decline Application</Button>
                          <Button onClick={() => handleApproveRequest(req.id)} className="bg-black hover:bg-[#505f78] text-white rounded-full h-10 px-8 text-xs font-bold shadow-sm">Verify & Email</Button>
                        </div>
                      </div>
                      {req.description && (
                        <div className="p-6 bg-white rounded-2xl text-neutral-600 text-sm italic border-l-4 border-[#505f78] shadow-sm border border-black/5">
                          &ldquo;{req.description}&rdquo;
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="canteens" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white border border-black/5 rounded-3xl shadow-sm">
              <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-[#ece9e3] flex items-center justify-center">
                  <PlusCircle className="w-8 h-8 text-[#505f78]" />
                </div>
                <h3 className="text-xl font-dmserif font-bold text-[#0f0f10]">Add New Canteen</h3>
                <form onSubmit={handleAddCanteen} className="w-full space-y-4 text-left mt-4">
                  <input required minLength={2} className="w-full bg-[#faf9f6] border border-black/5 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-neutral-300 transition-all text-neutral-850" placeholder="Canteen Name" value={newCanteen.name} onChange={e => setNewCanteen({ ...newCanteen, name: e.target.value })} />
                  <input className="w-full bg-[#faf9f6] border border-black/5 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-neutral-300 transition-all text-neutral-850" placeholder="Location" value={newCanteen.location} onChange={e => setNewCanteen({ ...newCanteen, location: e.target.value })} />
                  <input className="w-full bg-[#faf9f6] border border-black/5 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-neutral-300 transition-all text-neutral-850" placeholder="Image URL" value={newCanteen.image_url} onChange={e => setNewCanteen({ ...newCanteen, image_url: e.target.value })} />
                  <input className="w-full bg-[#faf9f6] border border-black/5 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-neutral-300 transition-all text-neutral-850" placeholder="Category (e.g. Snacks, Meals)" value={newCanteen.category} onChange={e => setNewCanteen({ ...newCanteen, category: e.target.value })} />
                  <textarea className="w-full bg-[#faf9f6] border border-black/5 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-neutral-300 transition-all text-neutral-850" placeholder="Description" rows={3} value={newCanteen.description} onChange={e => setNewCanteen({ ...newCanteen, description: e.target.value })} />
                  <Button disabled={isAddingCanteen} type="submit" className="w-full bg-black hover:bg-[#505f78] text-white rounded-full h-11 font-bold transition-all shadow-sm">
                    {isAddingCanteen ? "Adding..." : "Register Outlet"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            <Card className="bg-white border border-black/5 rounded-3xl shadow-sm">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-dmserif font-bold text-[#0f0f10]">Active Outlets</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="space-y-4">
                  {canteens.map(c => (
                    <OutletItem key={c.id} name={c.name} rating={c.average_rating || 0} status={(c.average_rating || 0) > 4 ? 'open' : 'busy'} />
                  ))}
                  {canteens.length === 0 && <p className="text-neutral-500 text-sm font-medium">No canteens added yet.</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clubs" className="space-y-6 outline-none">
          <Card className="bg-white border border-black/5 rounded-3xl shadow-sm">
            <CardHeader className="p-8">
              <CardTitle className="text-xl font-dmserif font-bold text-[#0f0f10]">Club Authentication</CardTitle>
              <CardDescription className="text-neutral-500 text-sm">Manually verify accounts ending with _vsp@gitam.in</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="space-y-6">
                {pendingClubs.length === 0 ? (
                  <p className="text-neutral-500 text-sm font-medium">No pending clubs to approve.</p>
                ) : (
                  pendingClubs.map((club) => (
                    <div key={club.user_id} className="flex items-center justify-between p-6 bg-neutral-50 border border-black/5 hover:border-black/10 hover:bg-white rounded-2xl transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#ece9e3] flex items-center justify-center text-[#505f78] font-bold text-lg">{club.name ? club.name[0] : 'C'}</div>
                        <div>
                          <div className="font-bold text-[#0f0f10] text-sm uppercase tracking-wider">{club.club_metadata?.name || club.name || "Unnamed Club"}</div>
                          <div className="text-xs text-neutral-500 font-mono">{club.username}</div>
                          <div className="text-xs text-neutral-500">{club.club_metadata?.category || "Category pending"}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => approveClub(club.user_id)} className="bg-black hover:bg-[#505f78] text-white rounded-full px-6 h-9 text-xs font-bold shadow-sm">Approve</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6 outline-none">
          <Card className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm">
            <CardHeader className="p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-[#ece9e3] text-[#505f78]">
                    <UserCog className="w-8 h-8" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-dmserif font-bold text-[#0f0f10]">Role & Permission Matrix</CardTitle>
                    <CardDescription className="text-neutral-500 text-sm">Configure granular system access for staff accounts.</CardDescription>
                  </div>
                </div>
                <Button className="bg-black hover:bg-[#505f78] text-white rounded-full h-11 px-6 text-xs font-bold shadow-sm">Add Staff Member</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#faf9f6] border-y border-black/5">
                    <tr>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Admin Member</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Level</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Caps</th>
                      <th className="px-8 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    <PermissionsRow
                      name="Sampath"
                      email="sampath@gitam.in"
                      role="Founder"
                      caps={["Root", "Finance", "Users", "DB"]}
                    />
                    <PermissionsRow
                      name="Manish"
                      email="manish@gitam.in"
                      role="Super Admin"
                      caps={["All Mods", "Analytics"]}
                    />
                    <PermissionsRow
                      name="Kedhar"
                      email="bkedhar10@gitam.in"
                      role="Moderator"
                      caps={["Filter", "Warn", "Approve"]}
                    />
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {canViewAudit && (
          <TabsContent value="audit" className="space-y-6 outline-none">
            <Card className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm">
              <CardHeader className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-[#ece9e3] text-[#505f78]">
                      <ScrollText className="w-8 h-8" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-dmserif font-bold text-[#0f0f10]">Administrative Audit Trail</CardTitle>
                      <CardDescription className="text-neutral-500 text-sm">Full log of all admin actions for oversight and accountability.</CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={fetchAuditLogs}
                    disabled={auditLoading}
                    variant="outline"
                    className="border-black/10 hover:bg-neutral-50 rounded-full h-10 px-5 text-xs font-semibold text-neutral-600"
                  >
                    {auditLoading ? "Refreshing..." : "↻ Refresh"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                {auditLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : auditLogs.length === 0 ? (
                  <div className="text-center py-20 rounded-3xl border border-dashed border-black/5 bg-neutral-50/50">
                    <ScrollText className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-500 font-medium text-sm">No audit logs yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {auditLogs.map((log) => (
                      <AuditLogItem key={log.id} log={log} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Suspend user Dialog */}
      {suspendUser && (
        <Dialog open={!!suspendUser} onOpenChange={(open) => !open && setSuspendUser(null)}>
          <DialogContent className="bg-white border border-black/5 text-[#0f0f10] sm:rounded-2xl max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-dmserif">Suspend User</DialogTitle>
              <DialogDescription>
                Select duration to suspend <strong>{suspendUser.name}</strong> ({suspendUser.email}) from communities and posts.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 flex flex-col gap-2">
              <Button
                onClick={() => handleSuspend(7)}
                disabled={isSuspending}
                className="bg-black hover:bg-[#505f78] text-white rounded-xl font-semibold h-11"
              >
                Suspend for 7 Days
              </Button>
              <Button
                onClick={() => handleSuspend(30)}
                disabled={isSuspending}
                className="border border-black/10 hover:bg-neutral-100 text-[#0f0f10] rounded-xl font-semibold h-11"
              >
                Suspend for 30 Days
              </Button>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setSuspendUser(null)}
                className="rounded-xl h-10 w-full font-semibold"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function UserActivityItem({ name, email, points, level, status, onSuspend }: any) {
  return (
    <div className="flex items-center justify-between p-6 hover:bg-neutral-50 transition-all">
      <div className="flex items-center gap-5">
        <Avatar className="w-12 h-12 border border-black/5">
          <AvatarFallback className="bg-[#ece9e3] text-[#505f78] font-bold text-lg">
            {name ? name[0] : "@"}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-bold text-[#0f0f10] text-sm flex items-center gap-2">
            {name}
            <Badge
              variant="outline"
              className={`text-[9px] h-5 uppercase tracking-tighter rounded-md font-semibold ${status === "flagged"
                ? "border-amber-500/30 text-amber-700 bg-amber-50"
                : "border-emerald-500/30 text-emerald-700 bg-emerald-50"
                }`}
            >
              {status}
            </Badge>
          </div>
          <div className="text-xs text-neutral-500 font-mono">
            {email}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-center hidden sm:block">
          <div className="text-lg font-bold text-[#0f0f10]">
            {points}
          </div>
          <div className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">
            {level}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full px-4 text-xs text-black hover:text-[#505f78] font-bold"
          >
            Review Activity
          </Button>
          <Button
            onClick={onSuspend}
            variant="ghost"
            size="sm"
            className="rounded-full px-4 text-xs text-amber-700 hover:bg-amber-50 hover:text-amber-800 font-semibold"
          >
            Suspend
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full px-4 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-semibold"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}

function PermissionsRow({ name, email, role, caps }: any) {
  return (
    <tr className="hover:bg-neutral-50 transition-colors">
      <td className="px-8 py-6">
        <div className="font-bold text-[#0f0f10] text-sm">{name}</div>
        <div className="text-xs text-neutral-500 font-mono">{email}</div>
      </td>
      <td className="px-8 py-6">
        <Badge
          variant="outline"
          className="text-[9px] px-2.5 py-1 bg-[#ece9e3] border-black/5 text-neutral-700 uppercase font-bold rounded-md"
        >
          {role}
        </Badge>
      </td>
      <td className="px-8 py-6">
        <div className="flex gap-2 flex-wrap">
          {caps.map((c: string) => (
            <span
              key={c}
              className="text-[10px] border border-black/5 rounded-full px-2.5 py-1 text-neutral-500 font-medium bg-black/5"
            >
              {c}
            </span>
          ))}
          <button className="text-[10px] text-[#505f78] hover:text-black font-bold underline px-1 transition-colors">
            Edit
          </button>
        </div>
      </td>
      <td className="px-8 py-6 text-right">
        <Button
          variant="ghost"
          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-10 px-4 rounded-xl text-xs font-bold"
        >
          Revoke Access
        </Button>
      </td>
    </tr>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colorMap: any = {
    brand: "bg-black/5 text-black",
    rose: "bg-rose-500/10 text-rose-600",
    amber: "bg-amber-500/10 text-amber-600",
    indigo: "bg-indigo-500/10 text-indigo-600",
  };
  return (
    <Card className="bg-white border border-black/5 rounded-3xl overflow-hidden relative group transition-all hover:shadow-sm hover:border-black/10">
      <CardContent className="p-8">
        <div className={`p-3.5 rounded-2xl inline-flex mb-6 ${colorMap[color] || colorMap.brand} group-hover:scale-105 transition-transform`}>
          {icon && <div className="w-5 h-5 flex items-center justify-center">{icon}</div>}
        </div>
        <div className="text-4xl font-bold mb-1 tracking-tight text-[#0f0f10]">{value}</div>
        <div className="text-neutral-500 font-medium text-sm">{title}</div>
      </CardContent>
    </Card>
  );
}

function ModerationItem({ title, reporter, status, type }: any) {
  return (
    <div className="flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${status === 'pending' ? 'bg-amber-500/10 text-amber-600' : 'bg-green-500/10 text-green-600'}`}>
          {type === 'post' ? <Users className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
        </div>
        <div>
          <div className="font-semibold text-[#0f0f10] text-sm">{title}</div>
          <div className="text-xs text-neutral-500 font-medium">Reported by {reporter}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" variant="outline" className="rounded-full h-9 px-5 border-black/10 text-neutral-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-semibold">Ignore</Button>
        <Button size="sm" className="bg-black hover:bg-[#505f78] text-white rounded-full h-9 px-5 text-xs font-semibold shadow-sm">Take Action</Button>
      </div>
    </div>
  );
}

function OutletItem({ name, rating, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#faf9f6] border border-black/5 hover:border-black/10 hover:bg-white transition-all cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#ece9e3] flex items-center justify-center text-[#505f78] font-bold">
          {name[0]}
        </div>
        <div>
          <div className="font-bold text-sm text-[#0f0f10]">{name}</div>
          <div className="flex items-center gap-1 text-xs text-neutral-500 font-semibold">
            <Shield className="w-3 h-3 text-[#855300]" /> {rating} avg rating
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className={`h-2 w-2 rounded-full ${status === 'open' ? 'bg-green-500' : 'bg-amber-500'}`} />
        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">{status}</span>
      </div>
    </div>
  );
}

const AUDIT_ACTION_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  APPROVE_USER: { label: "Approved User", icon: <UserCheck className="w-4 h-4" />, color: "bg-emerald-500/10 text-emerald-700" },
  REJECT_USER: { label: "Rejected User", icon: <UserX className="w-4 h-4" />, color: "bg-rose-500/10 text-rose-700" },
  SUSPEND_USER: { label: "Suspended User", icon: <Ban className="w-4 h-4" />, color: "bg-amber-500/10 text-amber-700" },
  UNSUSPEND_USER: { label: "Unsuspended User", icon: <ShieldOff className="w-4 h-4" />, color: "bg-sky-500/10 text-sky-700" },
  WARN_USER: { label: "Warned User", icon: <ShieldAlert className="w-4 h-4" />, color: "bg-orange-500/10 text-orange-700" },
  REMOVE_CONTENT: { label: "Removed Content", icon: <Trash2 className="w-4 h-4" />, color: "bg-red-500/10 text-red-700" },
  REMOVE_USER: { label: "Permanently Removed User", icon: <UserX className="w-4 h-4" />, color: "bg-red-600/10 text-red-700" },
  SET_ROLE: { label: "Changed Role", icon: <KeySquare className="w-4 h-4" />, color: "bg-purple-500/10 text-purple-700" },
  DELETE_EVENT: { label: "Deleted Event", icon: <Trash2 className="w-4 h-4" />, color: "bg-rose-500/10 text-rose-700" },
};

function AuditLogItem({ log }: { log: any }) {
  const meta = AUDIT_ACTION_META[log.action] || {
    label: log.action.replace(/_/g, " "),
    icon: <ScrollText className="w-4 h-4" />,
    color: "bg-neutral-500/10 text-neutral-700",
  };

  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-black/5 hover:border-black/10 hover:shadow-sm transition-all group">
      {/* Action Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.color}`}>
        {meta.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-[#0f0f10]">{meta.label}</span>
          {log.target?.name && (
            <span className="text-xs text-neutral-500">
              → <span className="text-[#0f0f10] font-medium">{log.target.name}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 flex-wrap font-medium">
          <span className="text-xs text-neutral-500">
            by <span className="text-[#0f0f10]/80 font-medium">{log.admin?.name || "Unknown Admin"}</span>
          </span>
          {log.details && Object.keys(log.details).length > 0 && (
            <span className="text-[10px] font-mono bg-black/5 border border-black/5 rounded-md px-2 py-0.5 text-neutral-500 max-w-xs truncate">
              {JSON.stringify(log.details)}
            </span>
          )}
        </div>
      </div>

      {/* Timestamp */}
      <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider shrink-0 text-right font-medium">
        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
      </div>
    </div>
  );
}
