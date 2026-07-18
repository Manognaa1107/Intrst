"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2, Upload, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const buttonClickInteraction = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.98, y: 0 },
  transition: { type: "spring" as const, stiffness: 400, damping: 15 }
};

export default function AdminSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    email: "",
    universityId: "",
    designation: "",
    department: "",
    campus: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_pending_profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFormData(prev => ({
          ...prev,
          name: parsed.name || "",
          displayName: parsed.displayName || "",
          email: parsed.email || ""
        }));
      } catch (e) {
        // ignore parsing errors
      }
    }
  }, []);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Phase 6: Mock submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#faf9f6] text-[#0f0f10] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
        <div className="absolute -right-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[540px] z-10"
      >
        <Card className="w-full border border-black/5 bg-white shadow-[0_24px_48px_rgba(0,0,0,0.03)] p-6 sm:p-10 rounded-[32px]">
          <CardHeader className="p-0 mb-8 text-center sm:text-left">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold text-sm mb-3 mx-auto sm:mx-0">i</div>
            <CardTitle className="text-2xl font-bold tracking-tight text-[#0f0f10] mb-1.5">
              Admin <span className="font-serif italic font-normal text-[#855300]">Setup</span>
            </CardTitle>
            <CardDescription className="text-neutral-500 text-xs font-medium">Complete your administrator profile.</CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <form onSubmit={handleSetup} className="space-y-6">
              
              {/* Profile Photo Upload */}
              <div className="flex flex-col items-center sm:items-start gap-3">
                <Label className="text-neutral-500 font-bold uppercase tracking-widest text-[9px]">Profile Photo (Optional)</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 border border-neutral-200">
                    <Upload size={20} />
                  </div>
                  <Button type="button" variant="outline" className="text-xs h-9 rounded-full font-semibold">
                    Upload Image
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-neutral-500 font-bold uppercase tracking-widest text-[9px]">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-neutral-50 border-[#c5c6cd] rounded-xl h-11 focus:border-black focus-visible:ring-0 text-[#0f0f10] text-xs font-medium"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="displayName" className="text-neutral-500 font-bold uppercase tracking-widest text-[9px]">Display Name</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="bg-neutral-50 border-[#c5c6cd] rounded-xl h-11 focus:border-black focus-visible:ring-0 text-[#0f0f10] text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-neutral-500 font-bold uppercase tracking-widest text-[9px]">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-neutral-50 border-[#c5c6cd] rounded-xl h-11 focus:border-black focus-visible:ring-0 text-[#0f0f10] text-xs font-medium"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="universityId" className="text-neutral-500 font-bold uppercase tracking-widest text-[9px]">University ID (Optional)</Label>
                  <Input
                    id="universityId"
                    name="universityId"
                    placeholder="e.g. EMP12345 or STU12345"
                    value={formData.universityId}
                    onChange={handleChange}
                    className="bg-white border-[#c5c6cd] rounded-xl h-11 focus:border-black focus-visible:ring-0 text-[#0f0f10] placeholder:text-neutral-300 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="designation" className="text-neutral-500 font-bold uppercase tracking-widest text-[9px]">Designation</Label>
                  <select
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#c5c6cd] rounded-xl h-11 px-3 focus:border-black focus:outline-none focus:ring-0 text-[#0f0f10] text-xs font-medium"
                    required
                  >
                    <option value="" disabled>Select Designation</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Staff">Staff</option>
                    <option value="Student Developer">Student Developer</option>
                    <option value="Student Coordinator">Student Coordinator</option>
                    <option value="Student Administrator">Student Administrator</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="department" className="text-neutral-500 font-bold uppercase tracking-widest text-[9px]">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    placeholder="e.g. Computer Science"
                    value={formData.department}
                    onChange={handleChange}
                    className="bg-white border-[#c5c6cd] rounded-xl h-11 focus:border-black focus-visible:ring-0 text-[#0f0f10] placeholder:text-neutral-300 text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="campus" className="text-neutral-500 font-bold uppercase tracking-widest text-[9px]">Campus</Label>
                  <select
                    id="campus"
                    name="campus"
                    value={formData.campus}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#c5c6cd] rounded-xl h-11 px-3 focus:border-black focus:outline-none focus:ring-0 text-[#0f0f10] text-xs font-medium"
                    required
                  >
                    <option value="" disabled>Select Campus</option>
                    <option value="Visakhapatnam">Visakhapatnam</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Bengaluru">Bengaluru</option>
                  </select>
                </div>
              </div>

              <motion.div {...buttonClickInteraction} className="pt-4">
                <Button
                  className="w-full bg-black hover:bg-[#505f78] text-white font-bold h-12 rounded-full transition-all shadow-sm group flex items-center justify-center gap-2"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Completing Setup...
                    </>
                  ) : (
                    <>
                      Complete Setup <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
