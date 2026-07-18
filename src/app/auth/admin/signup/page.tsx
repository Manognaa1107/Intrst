"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import SignupView, { SignupFormData } from "@/components/auth/SignupView";

export default function AdminSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (formData: SignupFormData) => {
    setLoading(true);
    setError(null);

    // Basic local validation
    if (!formData.name || !formData.displayName || !formData.email || !formData.password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      // Phase 6: Mock submission
      // In the future:
      // 1. Validate entered email against admin_whitelist table in Supabase.
      // 2. If valid, proceed with supabase.auth.signUp()
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      sessionStorage.setItem("admin_pending_profile", JSON.stringify({
        name: formData.name,
        displayName: formData.displayName,
        email: formData.email
      }));
      
      // Navigate directly to Admin Setup page, bypassing OTP for now
      router.push("/auth/admin/setup");
    } catch (err: any) {
      console.error("Admin signup process failed:", err);
      setError(err.message || "An error occurred during admin signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupView
      title={<>Create <span className="font-serif italic font-normal text-[#855300]">Admin</span> Account</>}
      subtitle="Create your administrator account to manage Intrst."
      buttonText={<>Create Admin Account <ArrowUpRight size={14} className="ml-1.5" /></>}
      loading={loading}
      error={error}
      onSubmit={handleSignup}
      showGoogleLogin={false}
      footerText="Already have an admin account?"
      footerLinkText="Sign In"
      footerLinkHref="/signin"
      rightColumnHeader={
        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-[#0f0f10] leading-[1.1] mb-4 w-full max-w-none">
          <span>Manage your</span>
          <br />
          <span className="bg-gradient-to-r from-[#855300] to-[#505f78] bg-clip-text text-transparent font-serif italic font-normal pr-4 inline-block">
            platform.
          </span>
          <br />
          <span>Empower students.</span>
        </h1>
      }
    />
  );
}
