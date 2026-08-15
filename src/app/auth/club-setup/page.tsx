"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { apiFetch } from "@/lib/apiClient";
import { useUser } from "@/context/UserContext";

export default function ClubSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const { user_id, email, setIsLoggedIn, setRole } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    username: "",
    name: "",
  });

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing setup token");
      router.push("/auth/club-request");
    }
  }, [token, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setError("Club Handle (username) is required.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Check if username is available
      const usernameCheck = await apiFetch(`/auth/check-username/${formData.username.trim()}`);
      if (!usernameCheck.available) {
        throw new Error("This username is already taken. Please choose another.");
      }

      // We need user_id and email from the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !session.user) {
        throw new Error("Authentication session lost. Please verify your OTP again.");
      }

      const resData = await apiFetch("/auth/initialize-profile", {
        method: "POST",
        body: JSON.stringify({
          user_id: session.user.id,
          email: session.user.email,
          username: formData.username,
          name: formData.name || undefined,
        }),
      });

      if (resData.profile) {
        toast.success("Club setup completed successfully!");
        setIsLoggedIn(true);
        setRole("club");
        router.push("/club-dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during setup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-6 bg-[#faf9f6]">
      <Card className="w-full max-w-[500px] border border-neutral-200/60 shadow-[0_24px_48px_rgba(0,0,0,0.03)] p-6 sm:p-10 rounded-[32px] bg-white">
        <CardHeader className="p-0 mb-8 text-center sm:text-left">
          <CardTitle className="text-2xl font-bold tracking-tight text-[#0f0f10] mb-1.5">
            Complete Club <span className="font-serif italic font-normal text-[#505f78]">Setup</span>
          </CardTitle>
          <CardDescription className="text-neutral-500 text-xs font-medium">
            Choose a unique handle for your club to finish setting up your profile.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <form onSubmit={handleSetup} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-neutral-500 font-bold uppercase tracking-widest text-[9px]">Club Display Name (Optional)</Label>
              <Input
                id="name"
                name="name"
                placeholder="Leave blank to use requested name"
                value={formData.name}
                onChange={handleChange}
                className="bg-white border-[#c5c6cd] rounded-xl h-11 focus:border-black focus-visible:ring-0 text-[#0f0f10] placeholder:text-neutral-300 text-xs font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-neutral-500 font-bold uppercase tracking-widest text-[9px]">Club Handle (Username)</Label>
              <Input
                id="username"
                name="username"
                placeholder="e.g. codewizards"
                value={formData.username}
                onChange={handleChange}
                className="bg-white border-[#c5c6cd] rounded-xl h-11 focus:border-black focus-visible:ring-0 text-[#0f0f10] placeholder:text-neutral-300 text-xs font-medium"
                required
              />
            </div>

            <div className="pt-4">
              <Button
                className="w-full bg-black hover:bg-[#505f78] text-white font-bold h-12 rounded-full transition-all shadow-sm flex items-center justify-center gap-2"
                type="submit"
                disabled={loading}
              >
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <>Complete Setup <ArrowRight className="w-4 h-4" /></>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
