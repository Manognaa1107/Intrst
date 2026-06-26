"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Send, CheckCircle2, ArrowLeft, Trophy, Users, Star } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/apiClient";
import { toast } from "sonner";
import { motion } from "framer-motion";

const DOMAINS = [
  "Technical",
  "Cultural",
  "Sports",
  "Literary",
  "Social Service",
  "Research",
  "Entrepreneurship",
  "Creative Arts"
];

const buttonClickInteraction = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.98, y: 0 },
  transition: { type: "spring" as const, stiffness: 400, damping: 15 }
};

export default function RedesignedClubRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    club_name: "",
    club_email: "",
    president_name: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDomainToggle = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(prev => prev.filter(d => d !== domain));
    } else {
      if (selectedDomains.length >= 3) {
        toast.error("You can select up to 3 domains.");
        return;
      }
      setSelectedDomains(prev => [...prev, domain]);
    }
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic Validation
    if (!formData.club_name || !formData.club_email || !formData.president_name) {
      setError("Club name, email, and president name are required.");
      setLoading(false);
      return;
    }

    if (selectedDomains.length === 0) {
      setError("Please select at least 1 domain for your club.");
      setLoading(false);
      return;
    }

    try {
      await apiFetch("/auth/club-request", {
        method: "POST",
        requireAuth: false,
        body: JSON.stringify({
          ...formData,
          category: selectedDomains.join(", ")
        }),
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting your request.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#faf9f6] text-[#0f0f10] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
          <div className="absolute -right-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-35" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md z-10"
        >
          <Card className="w-full border border-black/5 bg-white shadow-[0_24px_48px_rgba(0,0,0,0.03)] p-8 text-center space-y-6 rounded-[32px]">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-[#855300]/10 border border-[#855300]/20 flex items-center justify-center text-[#855300]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-dmserif font-bold text-[#0f0f10]">Application Received!</h1>
              <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed">
                Thank you for your interest in joining the intrst community. Our team will review your application for <strong className="text-black font-semibold">{formData.club_name}</strong> and get back to you at <strong className="text-black font-semibold">{formData.club_email}</strong>.
              </p>
            </div>
            <div className="pt-4 border-t border-black/5">
              <Link href="/signin">
                <motion.div {...buttonClickInteraction} className="inline-block">
                  <Button className="rounded-full h-11 px-8 bg-black hover:bg-[#505f78] text-white font-bold group">
                    Back to Login
                  </Button>
                </motion.div>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full flex items-start justify-center relative overflow-hidden p-6 pt-20 md:pt-24 lg:pt-32" style={{ backgroundColor: "#faf9f6" }}>
      {/* Background Glow Decorations */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-[-20%] top-[10%] w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-30"></div>
        <div className="absolute right-[-20%] bottom-[10%] w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-30"></div>
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-8 lg:gap-16 items-start relative z-10">

        {/* Left Side Content */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-center space-y-10 pt-4">
          <div className="relative z-20 max-w-md select-none">
            <Link href="/" className="inline-flex items-center gap-2 group text-neutral-500 hover:text-black transition-colors mb-6">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-xs font-bold uppercase tracking-widest">Back Home</span>
            </Link>

            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-[#855300]/10 border border-[#855300]/20 flex items-center justify-center text-[#855300] mb-4">
                <Trophy className="w-6 h-6" />
              </div>
              <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1] text-[#0f0f10]">
                Elevate Your <br />
                <span className="bg-gradient-to-r from-[#505f78] to-[#855300] bg-clip-text text-transparent font-serif italic font-normal pr-4 inline-block">
                  Club&apos;s Presence.
                </span>
              </h1>
              <p className="text-sm text-neutral-500 font-normal leading-relaxed">
                The intrst platform is the exclusive campus community for clubs to host events, engage with members, and grow their influence.
              </p>
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t border-black/5 relative max-w-md">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#505f78]/10 border border-[#505f78]/20 flex items-center justify-center text-[#505f78] shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#0f0f10] uppercase tracking-widest text-[10px] mb-0.5">Engage Students</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">Reach a wider audience and get more registrations for your events.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#855300]/10 border border-[#855300]/20 flex items-center justify-center text-[#855300] shrink-0">
                <Star className="w-5 h-5 fill-[#855300]/20" />
              </div>
              <div>
                <h3 className="font-bold text-[#0f0f10] uppercase tracking-widest text-[10px] mb-0.5">Official Verification</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">Get the blue checkmark and official status on campus.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Card Container */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-end w-full">

          {/* Back Home for Mobile */}
          <div className="w-full flex lg:hidden justify-start mb-6">
            <Link href="/" className="inline-flex items-center gap-2 group text-neutral-500 hover:text-black transition-colors">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-xs font-bold uppercase tracking-widest">Back Home</span>
            </Link>
          </div>

          <Card className="w-full max-w-[540px] border border-neutral-200/60 shadow-[0_24px_48px_rgba(0,0,0,0.03)] p-6 sm:p-10 rounded-[32px] bg-white">
            <CardHeader className="p-0 mb-8 text-center sm:text-left">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold text-sm mb-3 mx-auto sm:mx-0">i</div>
              <CardTitle className="text-2xl font-bold tracking-tight text-[#0f0f10] mb-1.5">
                Request <span className="font-serif italic font-normal text-[#505f78]">Access</span>
              </CardTitle>
              <CardDescription className="text-neutral-500 text-xs font-medium">Please provide your club details for manual verification.</CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <form onSubmit={handleRequest} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="club_name" className="text-neutral-500 font-bold uppercase tracking-widest text-[9px]">Club Name</Label>
                    <Input
                      id="club_name"
                      name="club_name"
                      placeholder="e.g. Code Wizards"
                      value={formData.club_name}
                      onChange={handleChange}
                      className="bg-white border-[#c5c6cd] rounded-xl h-11 focus:border-black focus-visible:ring-0 text-[#0f0f10] placeholder:text-neutral-300 text-xs font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="club_email" className="text-neutral-500 font-bold uppercase tracking-widest text-[9px]">Contact Email</Label>
                    <Input
                      id="club_email"
                      name="club_email"
                      type="email"
                      placeholder="club@gitam.in"
                      value={formData.club_email}
                      onChange={handleChange}
                      className="bg-white border-[#c5c6cd] rounded-xl h-11 focus:border-black focus-visible:ring-0 text-[#0f0f10] placeholder:text-neutral-300 text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="president_name" className="text-neutral-500 font-bold uppercase tracking-widest text-[9px]">President / Representative Name</Label>
                  <Input
                    id="president_name"
                    name="president_name"
                    placeholder="Full Name"
                    value={formData.president_name}
                    onChange={handleChange}
                    className="bg-white border-[#c5c6cd] rounded-xl h-11 focus:border-black focus-visible:ring-0 text-[#0f0f10] placeholder:text-neutral-300 text-xs font-medium"
                    required
                  />
                </div>

                {/* Multi-select Club Domains */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-neutral-500 font-bold uppercase tracking-widest text-[9px]">Club Domains (Select up to 3)</Label>
                    <span className="text-[10px] font-bold text-[#855300] tracking-wide">
                      {selectedDomains.length} / 3 selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {DOMAINS.map((domain) => {
                      const isSelected = selectedDomains.includes(domain);
                      return (
                        <button
                          type="button"
                          key={domain}
                          onClick={() => handleDomainToggle(domain)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${isSelected
                            ? "bg-black border-black text-white shadow-sm"
                            : "bg-[#faf9f6] border-black/5 text-neutral-500 hover:bg-neutral-100 hover:border-black/10"
                            }`}
                        >
                          {domain}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-neutral-500 font-bold uppercase tracking-widest text-[9px]">Short Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Briefly describe your club's mission and regular activities..."
                    value={formData.description}
                    onChange={handleChange}
                    className="bg-white border-[#c5c6cd] rounded-xl min-h-[100px] focus:border-black focus-visible:ring-0 text-[#0f0f10] placeholder:text-neutral-300 text-xs font-medium"
                  />
                </div>

                <motion.div {...buttonClickInteraction} className="pt-2">
                  <Button
                    className="w-full bg-black hover:bg-[#505f78] text-white font-bold h-12 rounded-full transition-all shadow-sm group flex items-center justify-center gap-2"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        Send Join Request
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>

            <CardFooter className="bg-transparent p-0 mt-8 flex justify-center items-center border-0">
              <p className="text-xs text-neutral-500 font-medium">
                Already verified? <Link href="/signin" className="text-[#855300] font-bold underline hover:text-black transition-colors">Sign in here</Link>
              </p>
            </CardFooter>
          </Card>
        </div>

      </div>
    </main>
  );
}
