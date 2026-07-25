"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/apiClient";
import SignupView, { SignupFormData } from "@/components/auth/SignupView";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (formData: SignupFormData) => {
    setLoading(true);
    setError(null);

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
    // GITAM email validation
    const domain = formData.email.split("@")[1]?.toLowerCase();

    const isGitamEmail =
      domain === "gitam.in" ||
      domain.endsWith(".gitam.in") ||
      domain === "gitam.edu" ||
      domain.endsWith(".gitam.edu");

    // Admin email bypass
    const ADMIN_EMAIL = "yoshiwork046@gmail.com";

    if (!isGitamEmail && formData.email.toLowerCase() !== ADMIN_EMAIL) {
      setError("Only GITAM email addresses are allowed.");
      setLoading(false);
      return;
    }

    try {
      // 1. Check username availability
      try {
        const usernameCheck = await apiFetch(`/auth/check-username/${formData.displayName}`, {
          requireAuth: false
        });
        if (!usernameCheck.available) {
          throw new Error("Username is already taken.");
        }
      } catch (checkErr: any) {
        console.error("Username check failed:", checkErr);
        if (checkErr.message === "Username is already taken.") throw checkErr;
      }

      if (!isGitamEmail && formData.email.toLowerCase() !== ADMIN_EMAIL) {
        setError("Only GITAM email addresses are allowed.");
        setLoading(false);
        return;
      }

      // 2. Sign up with Supabase
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (authError) throw authError;

      sessionStorage.setItem("intrst_pending_profile", JSON.stringify({
        name: formData.name,
        username: formData.displayName,
        email: formData.email,
        timestamp: new Date().getTime()
      }));

      // 4. Redirect to verify (Supabase signUp automatically sends the confirmation email/OTP code if enabled)
      router.push(
        `/verify?email=${encodeURIComponent(formData.email)}&type=signup`
      );
    } catch (err: any) {
      console.error("Signup process failed:", err);
      const msg = typeof err === 'object' && err !== null ? (err.message || JSON.stringify(err)) : String(err);
      setError(msg || "An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: "select_account",
          },
        },
      });
      if (error) throw error;
      // No need to router.push — Supabase redirects automatically
    } catch (err: any) {
      setError(err.message || "Google sign in failed.");
      setLoading(false);
    }
  };

  return (
    <SignupView
      title={<>Create <span className="font-serif italic font-normal text-[#505f78]">Account</span></>}
      subtitle="Join your campus network and start connecting."
      buttonText={<>Sign Up <ArrowUpRight size={14} className="ml-1.5" /></>}
      loading={loading}
      error={error}
      onSubmit={handleSignup}
      showGoogleLogin={true}
      onGoogleLogin={handleGoogleSignUp}
      footerText="Already have an account?"
      footerLinkText="Sign In"
      footerLinkHref="/signin"
      secondaryFooterText="Are you a Club / Organization?"
      secondaryFooterLinkText="Request Access"
      secondaryFooterLinkHref="/auth/club-request"
    />
  );
}