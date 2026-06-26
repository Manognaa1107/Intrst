"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Plus,
  CalendarDays,
  XIcon
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { toast as sonnerToast } from "sonner";

function ScrollArea({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`overflow-auto ${className}`}>{children}</div>;
}

function useToast() {
  return {
    toast: (props: any) => {
      sonnerToast(props.title, { description: props.description });
    }
  }
}

const BUILDINGS = [
  "GST - Engineering",
  "GSB - Business",
  "GSS - Science",
  "Architecture",
  "Law",
  "Pharmacy",
  "Humanities"
];

const SEMESTERS = ["Odd 2025", "Even 2024", "Odd 2024"];

export default function VacantClassrooms() {
  const [selectedBuilding, setSelectedBuilding] = useState("GST - Engineering");
  const [selectedSemester, setSelectedSemester] = useState("Odd 2025");
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [ticker, setTicker] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Get user and profile
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        setUserProfile(profile);
      }
    };
    fetchUser();

    // Setup a ticker to refresh the expiry timer display every 30s
    const interval = setInterval(() => {
      setTicker(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchClassrooms();
  }, [selectedBuilding]);

  const fetchClassrooms = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classrooms?building=${encodeURIComponent(selectedBuilding)}`);
      const data = await response.json();
      setClassrooms(data || []);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      toast({
        title: "Error",
        description: "Failed to load classrooms. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (classroomId: string, status: string) => {
    if (!user) {
      toast({ title: "Login Required", description: "You need to be logged in to report status." });
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classrooms/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ classroom_id: classroomId, status })
      });

      if (response.ok) {
        toast({ title: "Status Reported", description: `Marked room as ${status}.` });
        fetchClassrooms();
      }
    } catch (error) {
      toast({ title: "Error", description: "Could not report status.", variant: "destructive" });
    }
  };

  const handleVote = async (reportId: string, voteType: boolean) => {
    if (!user) {
      toast({ title: "Login Required", description: "You need to be logged in to vote." });
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classrooms/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ report_id: reportId, vote_type: voteType })
      });

      if (response.ok) {
        toast({ title: "Vote Cast", description: "Thank you for validating this room status." });
        fetchClassrooms();
      }
    } catch (error) {
      console.error("Voting error", error);
    }
  };

  // Helper to calculate minutes remaining for 1-hour expiry
  const getExpiryText = (lastUpdatedAt: string) => {
    if (!lastUpdatedAt) return null;
    const updatedTime = new Date(lastUpdatedAt).getTime();
    const now = new Date().getTime();
    const diffMs = now - updatedTime;
    const oneHourMs = 60 * 60 * 1000;
    const remainingMs = oneHourMs - diffMs;
    if (remainingMs <= 0) return "Expired";
    const remainingMins = Math.ceil(remainingMs / (60 * 1000));
    return `${remainingMins}m left`;
  };

  return (
    <div className="min-h-screen bg-background pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-dmserif font-bold text-[#0f0f10] flex items-center gap-2">
            <Building2 className="w-8 h-8 text-[#505f78]" />
            Classroom Locator
          </h1>
          <p className="text-neutral-500">Real-time vacant room tracking for study and project groups.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border border-black/5 text-[#0f0f10] font-semibold hover:bg-neutral-100 rounded-xl" onClick={() => window.open('/timetable.pdf', '_blank')}>
            <CalendarDays className="w-4 h-4 mr-2 text-[#505f78]" />
            Full Schedule
          </Button>

          <AddRoomDialog onSuccess={fetchClassrooms} building={selectedBuilding} />

          {(userProfile?.role === 'super_admin' || userProfile?.role === 'founder' || userProfile?.role === 'junior_moderator') && (
            <ManageRoomsDialog onSuccess={fetchClassrooms} currentBuilding={selectedBuilding} />
          )}
        </div>
      </div>

      {/* Semester Selector */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 hide-scrollbar">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 mr-2">Semester:</span>
        {SEMESTERS.map(sem => (
          <Badge
            key={sem}
            onClick={() => setSelectedSemester(sem)}
            variant="outline"
            className={`cursor-pointer px-4 py-1.5 rounded-full transition-all text-xs font-semibold ${selectedSemester === sem ? 'bg-black border-black text-white' : 'bg-white hover:bg-neutral-100 border border-black/5 text-neutral-500'}`}
          >
            {sem}
          </Badge>
        ))}
      </div>

      {/* Building Summary Stats */}
      {!loading && classrooms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-5 bg-white border border-black/5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Available Now</p>
              <h4 className="text-2xl font-dmserif font-bold text-[#0f0f10]">
                {classrooms.filter(r => r.live_status === 'empty').length}
                <span className="text-sm font-sans font-medium text-neutral-500 ml-1">rooms</span>
              </h4>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-black/5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">In Use</p>
              <h4 className="text-2xl font-dmserif font-bold text-[#0f0f10]">
                {classrooms.filter(r => r.live_status === 'occupied').length}
                <span className="text-sm font-sans font-medium text-neutral-500 ml-1">rooms</span>
              </h4>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-black/5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#855300]" />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Needs Vote</p>
              <h4 className="text-2xl font-dmserif font-bold text-[#0f0f10]">
                {classrooms.filter(r => r.live_status === 'unknown' || !r.current_report).length}
                <span className="text-sm font-sans font-medium text-neutral-500 ml-1">rooms</span>
              </h4>
            </div>
          </Card>
        </div>
      )}

      {/* Building Selector */}
      <div className="mb-8">
        <ScrollArea className="w-full whitespace-nowrap pb-2 hide-scrollbar">
          <div className="flex gap-2">
            {BUILDINGS.map((building) => (
              <Button
                key={building}
                onClick={() => setSelectedBuilding(building)}
                variant={selectedBuilding === building ? "default" : "outline"}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${selectedBuilding === building
                  ? "bg-black text-white shadow-sm"
                  : "bg-white hover:bg-neutral-100 border border-black/5 text-[#0f0f10]"
                  }`}
              >
                {building}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-52 bg-white rounded-2xl border border-black/5 animate-pulse"></div>
          ))}
        </div>
      ) : classrooms.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center bg-white border border-black/5 border-dashed text-center rounded-2xl">
          <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-10 h-10 text-[#505f78]" />
          </div>
          <h3 className="text-xl font-dmserif font-bold text-[#0f0f10] mb-2">No Rooms Registered</h3>
          <p className="text-neutral-500 max-w-md text-sm">No classrooms have been added for this building yet. Admin/Moderators can add rooms using the panel.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((room) => {
            const expiryText = getExpiryText(room.last_updated_at);
            const isStale = expiryText === "Expired";

            return (
              <Card key={room.id} className="relative overflow-hidden bg-white border border-black/5 hover:border-neutral-300 transition-all group p-5 rounded-2xl shadow-sm flex flex-col justify-between border-t-[6px]" style={{
                borderTopColor: room.live_status === 'empty' ? '#855300' : room.live_status === 'occupied' ? '#dc2626' : '#9ca3af'
              }}>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-dmserif font-bold text-[#0f0f10] flex items-center gap-2">
                        {room.room_number}
                        {room.live_status === 'empty' && (
                          <Badge className="bg-[#855300]/10 text-[#855300] hover:bg-[#855300]/20 border-[#855300]/20 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md">VACANT</Badge>
                        )}
                        {room.live_status === 'occupied' && (
                          <Badge className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md">IN USE</Badge>
                        )}
                      </h3>
                      <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#505f78]" />
                        Floor {room.floor} • {room.building_name}
                      </p>
                    </div>

                    <div className="flex gap-1">
                      {(userProfile?.role === 'super_admin' || userProfile?.role === 'founder' || userProfile?.role === 'moderator' || userProfile?.role === 'junior_moderator') && (
                        <Dialog>
                          <DialogTrigger>
                            <Button variant="ghost" size="icon" className="h-9 w-9 border border-black/5 rounded-xl hover:bg-neutral-100 transition-colors">
                              <Plus className="w-4 h-4 text-neutral-500" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white border border-black/5 text-[#0f0f10] sm:rounded-2xl">
                            <DialogHeader>
                              <DialogTitle className="font-dmserif text-[#0f0f10]">Update Room Schedule</DialogTitle>
                              <DialogDescription>Modify room details or semester timetable.</DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                              <p className="text-sm text-[#855300] font-semibold">Coming soon: Bulk timetable upload</p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      <RoomTimetableDialog room={room} />
                    </div>
                  </div>

                  {/* Status Section / Poll */}
                  <div className="mb-6 bg-[#faf9f6] rounded-xl p-4 border border-black/5">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                      <span>Live Verification</span>
                      {room.last_updated_at && expiryText && !isStale && (
                        <span className="text-[#855300] flex items-center gap-1">
                          ⏳ {expiryText}
                        </span>
                      )}
                    </div>

                    {room.current_report && !isStale ? (
                      <div className="space-y-3">
                        <p className="text-xs text-neutral-600">
                          A student reported this room is <strong className="text-[#0f0f10] uppercase">{room.current_report.status === 'empty' ? 'Vacant' : 'Full'}</strong>. Is this accurate?
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => handleVote(room.current_report.id, true)}
                            variant="outline"
                            className="h-9 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border-black/5 text-xs font-bold rounded-xl flex items-center gap-1.5"
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                            Confirm
                            {room.votes?.up > 0 && <span className="ml-1 bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded-full">{room.votes.up}</span>}
                          </Button>

                          <Button
                            onClick={() => handleVote(room.current_report.id, false)}
                            variant="outline"
                            className="h-9 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-200 border-black/5 text-xs font-bold rounded-xl flex items-center gap-1.5"
                          >
                            <ThumbsDown className="w-3.5 h-3.5 text-red-600" />
                            Deny
                            {room.votes?.down > 0 && <span className="ml-1 bg-red-100 text-red-800 text-[9px] px-1.5 py-0.5 rounded-full">{room.votes.down}</span>}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xs text-neutral-500">
                          No active reports. Be the first to verify the room status:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => handleReport(room.id, 'empty')}
                            variant="outline"
                            className="h-9 bg-white hover:bg-[#855300]/5 hover:text-[#855300] hover:border-[#855300]/20 border-black/5 text-xs font-bold rounded-xl flex items-center gap-1.5"
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-neutral-500" />
                            It&apos;s Vacant
                          </Button>

                          <Button
                            onClick={() => handleReport(room.id, 'occupied')}
                            variant="outline"
                            className="h-9 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-200 border-black/5 text-xs font-bold rounded-xl flex items-center gap-1.5"
                          >
                            <ThumbsDown className="w-3.5 h-3.5 text-neutral-500" />
                            It&apos;s Full
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-3 border-t border-black/5">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#505f78]" />
                    Updated {room.last_updated_at && !isStale ? new Date(room.last_updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-[#505f78] hover:text-black cursor-pointer transition-colors group/link">
                    Report Issue <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RoomTimetableDialog({ room }: { room: any }) {
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classrooms/${room.id}/timetable`);
      const data = await resp.json();
      setTimetable(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={(open) => open && fetchTimetable()}>
      <DialogTrigger>
        <Button variant="ghost" size="icon" className="h-9 w-9 border border-black/5 rounded-xl hover:bg-neutral-100 transition-colors">
          <Clock className="w-4 h-4 text-neutral-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border border-black/5 text-[#0f0f10] max-w-lg sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-dmserif text-[#0f0f10]">Room {room.room_number} Timetable</DialogTitle>
          <DialogDescription className="text-neutral-500">Detailed schedule for current semester.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] py-2">
          <div className="space-y-2">
            {loading ? (
              <div className="text-center py-10 animate-pulse text-neutral-500 text-sm">Loading timetable...</div>
            ) : timetable.length === 0 ? (
              <div className="text-center py-10 text-neutral-500 bg-[#faf9f6] rounded-xl border border-black/5 text-sm">No schedule sessions uploaded for this room.</div>
            ) : (
              timetable.map((item, idx) => (
                <div key={idx} className="bg-[#faf9f6] border border-black/5 rounded-xl p-4 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#855300] uppercase text-[10px] tracking-wider">{item.day_of_week}</span>
                    <span className="text-xs text-neutral-500 font-semibold">{item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}</span>
                  </div>
                  <span className="text-[#0f0f10] font-semibold text-sm">{item.subject}</span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function AddRoomDialog({ building, onSuccess }: { building: string, onSuccess: () => void }) {
  const [roomNum, setRoomNum] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleAdd = async () => {
    if (!roomNum) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classrooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          building_name: building,
          room_number: roomNum,
          floor: parseInt(roomNum[0]) || 0
        })
      });

      if (response.ok) {
        toast({ title: "Room Added", description: `Room ${roomNum} is now being tracked. +3 Points!` });
        setRoomNum("");
        setOpen(false);
        onSuccess();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" className="bg-white border border-black/5 text-[#0f0f10] font-semibold hover:bg-neutral-100 rounded-xl">
          <Plus className="w-4 h-4 mr-2 text-[#855300]" />
          Add Room
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border border-black/5 text-[#0f0f10] sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-dmserif">Add Missing Room</DialogTitle>
          <DialogDescription>Found a room not listed in {building}? Add it here to start tracking.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Room Number / Name</label>
            <Input
              value={roomNum}
              onChange={(e) => setRoomNum(e.target.value)}
              placeholder="e.g. 302, LT-1, Seminar Hall"
              className="bg-[#faf9f6] border border-black/5 rounded-xl text-[#0f0f10] placeholder-neutral-400"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAdd} disabled={loading} className="bg-black hover:bg-[#505f78] text-white rounded-xl font-semibold w-full">
            {loading ? "Adding..." : "Add Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ManageRoomsDialog({ currentBuilding, onSuccess }: { currentBuilding: string, onSuccess: () => void }) {
  const [bulkJson, setBulkJson] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleBulkUpload = async () => {
    if (!bulkJson) return;
    setLoading(true);
    try {
      const rooms = JSON.parse(bulkJson);
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classrooms/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ rooms })
      });

      if (response.ok) {
        toast({ title: "Bulk Upload Complete", description: "Successfully updated classroom registry." });
        setBulkJson("");
        setOpen(false);
        onSuccess();
      }
    } catch (error) {
      toast({ title: "JSON Error", description: "Please check your JSON format.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="bg-black hover:bg-[#505f78] text-white rounded-xl font-semibold shadow-sm">
          <Plus className="w-4 h-4 mr-2 text-white" />
          Manage Rooms
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border border-black/5 text-[#0f0f10] max-w-2xl sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-dmserif text-[#0f0f10]">Admin Classroom Panel</DialogTitle>
          <DialogDescription>Bulk upload rooms for {currentBuilding} or manage existing ones.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="bulk" className="w-full mt-4">
          <TabsList className="bg-[#faf9f6] border border-black/5 p-1 rounded-xl">
            <TabsTrigger value="bulk" className="data-[state=active]:bg-white data-[state=active]:text-[#0f0f10] text-neutral-500 rounded-lg">Bulk Upload (JSON)</TabsTrigger>
            <TabsTrigger value="timetable" className="data-[state=active]:bg-white data-[state=active]:text-[#0f0f10] text-neutral-500 rounded-lg">Update Timetable</TabsTrigger>
          </TabsList>

          <TabsContent value="bulk" className="pt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">JSON Input</label>
              <textarea
                value={bulkJson}
                onChange={(e) => setBulkJson(e.target.value)}
                placeholder='[{"building_name": "GST", "room_number": "301", "floor": 3}]'
                className="w-full h-40 bg-[#faf9f6] border border-black/5 rounded-xl p-4 text-xs font-mono text-[#0f0f10] resize-none outline-none focus:border-neutral-300"
              />
            </div>
            <Button onClick={handleBulkUpload} disabled={loading} className="w-full bg-black hover:bg-[#505f78] text-white rounded-xl font-semibold">
              {loading ? "Processing..." : "Execute Bulk Upload"}
            </Button>
          </TabsContent>

          <TabsContent value="timetable" className="pt-4 text-center py-10 opacity-60">
            <CalendarDays className="w-12 h-12 mx-auto mb-4 text-[#855300]" />
            <p className="text-sm font-semibold">Select a room to update its semester timetable.</p>
            <p className="text-xs text-neutral-500 mt-2">Individual room timetable updates are available via room cards.</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
