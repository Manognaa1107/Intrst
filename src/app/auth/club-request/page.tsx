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

export default function ClubRequestPage() {
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#faf9f6] text-[#0f0f10] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-30" />
          <div className="absolute -right-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-30" />
        </div>
        
        <Card className="w-full max-w-lg z-10 border border-black/5 bg-white shadow-md p-8 text-center space-y-6 rounded-2xl">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-[#855300]/10 border border-[#855300]/20 flex items-center justify-center text-[#855300]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          </div>
          <div className="space-y-3">
             <h1 className="text-3xl font-dmserif font-bold text-[#0f0f10]">Application Received!</h1>
             <p className="text-neutral-500 text-sm leading-relaxed">
               Thank you for your interest in joining the intrst community. Our team will review your application for <strong className="text-black font-semibold">{formData.club_name}</strong> and get back to you at <strong className="text-black font-semibold">{formData.club_email}</strong>.
             </p>
          </div>
          <div className="pt-4 border-t border-black/5">
             <Link href="/signin">
               <Button className="rounded-full h-12 px-8 bg-black hover:bg-[#505f78] text-white font-bold group">
                 Back to Login
               </Button>
             </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#faf9f6] text-[#0f0f10] relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-30" />
        <div className="absolute -right-40 top-0 w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-30" />
        <div className="absolute top-[35%] left-[-150px] w-[400px] h-[400px] rounded-full bg-[#f3f1eb] blur-[120px] opacity-40" />
        <div className="absolute top-[60%] right-[-150px] w-[400px] h-[400px] rounded-full bg-[#f0ede6] blur-[110px] opacity-35" />
      </div>

      {/* Left side: branding/info */}
      <div className="w-full md:w-1/2 lg:w-2/5 p-8 md:p-16 flex flex-col justify-center space-y-12 relative overflow-hidden border-r border-black/5 z-10">
        <Link href="/" className="inline-flex items-center gap-2 group text-neutral-500 hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-xs font-bold uppercase tracking-widest">Back Home</span>
        </Link>
        
        <div className="space-y-6 relative">
          <div className="w-14 h-14 rounded-2xl bg-[#855300]/10 border border-[#855300]/20 flex items-center justify-center text-[#855300] mb-8">
            <Trophy className="w-6 h-6" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-dmserif font-bold tracking-tight leading-[1.1] text-[#0f0f10]">
            Elevate Your <br />
            <span className="bg-gradient-to-r from-[#505f78] to-[#855300] bg-clip-text text-transparent font-serif italic font-normal">
              Club&apos;s Presence.
            </span>
          </h1>
          <p className="text-base text-neutral-500 font-normal leading-relaxed max-w-sm">
            The intrst platform is the exclusive Gitam community for clubs to host events, engage with members, and grow their influence.
          </p>
        </div>

        <div className="space-y-6 pt-8 border-t border-black/5 relative">
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

      {/* Right side: Request Form */}
      <div className="w-full md:w-1/2 lg:w-3/5 p-8 md:p-16 flex items-center justify-center z-10 overflow-y-auto">
        <Card className="w-full max-w-xl border border-black/5 bg-white shadow-sm p-6 sm:p-10 rounded-2xl">
           <CardHeader className="p-0 mb-8">
              <CardTitle className="text-2xl font-dmserif font-bold text-[#0f0f10] mb-1.5">Request Access</CardTitle>
              <CardDescription className="text-neutral-500 text-xs">Please provide your club details for manual verification.</CardDescription>
           </CardHeader>
           <CardContent className="p-0">
              <form onSubmit={handleRequest} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="club_name" className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Club Name</Label>
                    <Input
                      id="club_name"
                      name="club_name"
                      placeholder="e.g. Code Wizards"
                      value={formData.club_name}
                      onChange={handleChange}
                      className="bg-white border-neutral-200 rounded-xl h-12 focus:border-[#505f78] focus-visible:ring-[#505f78] text-[#0f0f10] placeholder:text-neutral-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="club_email" className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Contact Email</Label>
                    <Input
                      id="club_email"
                      name="club_email"
                      type="email"
                      placeholder="club@gitam.in"
                      value={formData.club_email}
                      onChange={handleChange}
                      className="bg-white border-neutral-200 rounded-xl h-12 focus:border-[#505f78] focus-visible:ring-[#505f78] text-[#0f0f10] placeholder:text-neutral-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="president_name" className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">President / Representative Name</Label>
                  <Input
                    id="president_name"
                    name="president_name"
                    placeholder="Full Name"
                    value={formData.president_name}
                    onChange={handleChange}
                    className="bg-white border-neutral-200 rounded-xl h-12 focus:border-[#505f78] focus-visible:ring-[#505f78] text-[#0f0f10] placeholder:text-neutral-400"
                    required
                  />
                </div>

                {/* Multi-select Club Domains */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Club Domains (Select up to 3)</Label>
                    <span className="text-[10px] font-bold text-[#855300]">
                      {selectedDomains.length} / 3 selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {DOMAINS.map((domain) => {
                      const isSelected = selectedDomains.includes(domain);
                      return (
                        <button
                          type="button"
                          key={domain}
                          onClick={() => handleDomainToggle(domain)}
                          className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                            isSelected
                              ? "bg-black border-black text-white shadow-sm"
                              : "bg-[#faf9f6] border-black/5 text-neutral-600 hover:bg-neutral-100"
                          }`}
                        >
                          {domain}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Short Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Briefly describe your club's mission and regular activities..."
                    value={formData.description}
                    onChange={handleChange}
                    className="bg-white border-neutral-200 rounded-xl min-h-[120px] focus:border-[#505f78] focus-visible:ring-[#505f78] text-[#0f0f10] placeholder:text-neutral-400"
                  />
                </div>

                <Button
                  className="w-full bg-black hover:bg-[#505f78] text-white font-bold h-12 rounded-xl transition-all shadow-sm group"
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
                      Send Join Request <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
           </CardContent>
           <CardFooter className="p-0 mt-8 justify-center">
              <p className="text-xs text-neutral-500">
                 Already verified? <Link href="/signin" className="text-[#855300] font-bold underline hover:text-black transition-colors">Sign in here</Link>
              </p>
           </CardFooter>
        </Card>
      </div>
    </div>
  );
}
