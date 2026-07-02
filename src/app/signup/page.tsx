"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/apiClient";

const buttonClickInteraction = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.98, y: 0 },
  transition: { type: "spring" as const, stiffness: 400, damping: 15 }
};

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name || !formData.username || !formData.email || !formData.password) {
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
        const usernameCheck = await apiFetch(`/auth/check-username/${formData.username}`, {
          requireAuth: false
        });
        if (!usernameCheck.available) {
          throw new Error("Username is already taken.");
        }
      } catch (checkErr: any) {
        console.error("Username check failed:", checkErr);
        if (checkErr.message === "Username is already taken.") throw checkErr;
      }

      // GITAM email validation
      // const domain = formData.email.split("@")[1]?.toLowerCase();

      // if (!isGitamEmail) {
      //   setError("Only GITAM email addresses are allowed.");
      //   setLoading(false);
      //   return;
      // }

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

      // console.log("Signup Data:", data);
      // console.log("Signup Error:", authError);

      // if (authError) throw authError;

      sessionStorage.setItem("intrst_pending_profile", JSON.stringify({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        timestamp: new Date().getTime()
      }));

      // 4. If session exists instantly (email confirm OFF), initialize and go to onboarding
      if (data?.session) {
        try {
          await apiFetch("/auth/initialize-profile", {
            method: "POST",
            body: JSON.stringify({
              user_id: data.user?.id,
              email: formData.email,
              name: formData.name,
              username: formData.username,
            }),
          });
        } catch (initErr) {
          console.error("Auto-initialization failed:", initErr);
        }

        router.push("/onboarding");
        return;
      }

      // 5. Wait then send OTP
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: { shouldCreateUser: false },
      });

      if (otpError) {
        console.warn("OTP resend skipped:", otpError.message);
      }

      // 6. Always redirect to verify
      router.push(
        `/verify?email=${encodeURIComponent(formData.email)}&type=signup`
      );
    } catch (err: any) {
      console.error("Signup process failed:", err);
      setError(err.message || "An error occurred during signup.");
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
    <main className="min-h-screen w-full flex items-start justify-center relative overflow-hidden stitch-font-inter p-6 pt-20 md:pt-24 lg:pt-32" style={{ backgroundColor: "#faf9f6" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        .stitch-font-inter {
          font-family: 'Inter', sans-serif;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out forwards;
        }
        input::-ms-reveal,
        input::-ms-clear {
          display: none;
        }
      `}</style>

      {/* Background Glow Decorations */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-[-20%] top-[10%] w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-30"></div>
        <div className="absolute right-[-20%] bottom-[10%] w-[500px] h-[500px] rounded-full bg-[#e9e6df] blur-[120px] opacity-30"></div>
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-8 items-start relative z-10">

        {/* Left Side Content */}
        <div className="lg:col-span-6 xl:col-span-7 hidden lg:block relative pt-4">
          <div className="relative z-20 max-w-md select-none">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold text-sm">i</div>
              <span className="text-lg font-bold tracking-tight text-[#0f0f10]">intrst</span>
            </div>

            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-6">
              Connect. Collaborate. Belong.
            </p>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-[#0f0f10] leading-[1.1] mb-4 w-full max-w-none">
              <span>Join your</span>
              <br />
              <span className="bg-gradient-to-r from-[#505f78] to-[#855300] bg-clip-text text-transparent font-serif italic font-normal pr-4 inline-block">
                campus.
              </span>
              <br />
              <span>Start building.</span>
            </h1>
          </div>
        </div>

        {/* Right Side: Sign-Up Card Container (Added lg:-mt-6 to shift upward on desktop) */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center lg:items-end w-full lg:-mt-24">

          {/* Card UI */}
          <div className="w-full max-w-[390px] bg-white border border-neutral-200/60 shadow-[0_24px_48px_rgba(0,0,0,0.03)] rounded-[32px] p-6 md:p-8 relative z-10">

            <div className="text-center mb-5">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold text-sm mx-auto mb-1.5">i</div>
              <span className="text-xs font-bold tracking-tight text-neutral-400">intrst</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-[#0f0f10] text-center mb-1">
              Create <span className="font-serif italic font-normal text-[#505f78]">Account</span>
            </h2>
            <p className="text-neutral-400 text-xs text-center mb-6 font-medium leading-relaxed">Join your campus network and start connecting.</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200/60 rounded-xl text-red-600 text-xs text-center font-medium animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full h-11 border border-[#c5c6cd] rounded-xl px-3.5 text-xs outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-neutral-900 placeholder:text-neutral-300 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1.5">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe123"
                  className="w-full h-11 border border-[#c5c6cd] rounded-xl px-3.5 text-xs outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-neutral-900 placeholder:text-neutral-300 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@university.edu"
                  className="w-full h-11 border border-[#c5c6cd] rounded-xl px-3.5 text-xs outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-neutral-900 placeholder:text-neutral-300 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="w-full h-11 border border-[#c5c6cd] rounded-xl px-3.5 pr-10 text-xs outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-neutral-900 placeholder:text-neutral-300 font-medium"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                  >
                    {showPassword ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full h-11 border border-[#c5c6cd] rounded-xl px-3.5 pr-10 text-xs outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-neutral-900 placeholder:text-neutral-300 font-medium"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                  >
                    {showConfirmPassword ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>

              <motion.div {...buttonClickInteraction} className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="text-white rounded-full h-11 text-xs font-bold bg-black hover:bg-neutral-800 transition-all flex items-center justify-center gap-1.5 w-full shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Sign Up <ArrowUpRight size={14} />
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-[#f0edee]"></div>
              <span className="mx-2.5 text-[9px] font-bold uppercase tracking-widest text-neutral-300">or</span>
              <div className="flex-1 border-t border-[#f0edee]"></div>
            </div>

            <div className="space-y-2.5">
              <motion.div {...buttonClickInteraction}>
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                  className="w-full h-11 rounded-full bg-white border border-[#E2E8F0] text-xs font-bold text-neutral-800 hover:bg-[#F8FAFC] transition-all flex items-center justify-center gap-2.5 shadow-sm"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.77z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z" />
                      <path fill="#FBBC05" d="M5.32 14.24A7.16 7.16 0 0 1 4.91 12c0-.79.13-1.57.38-2.31V6.54H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.79 1.21 5.46l4.11-3.22z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.84l4.11 3.22c.94-2.85 3.57-4.96 6.68-4.96z" />
                    </svg>
                  </div>
                  Continue with Google
                </button>
              </motion.div>
            </div>

            <p className="text-center text-[11px] text-neutral-400 mt-5 font-medium">
              Already have an account? <Link href="/signin" className="text-[#505f78] font-bold hover:underline">Sign In</Link>
            </p>

            <p className="text-center text-[10px] text-neutral-400 mt-2.5 font-medium">
              Are you a Club / Organization? <Link href="/auth/club-request" className="text-[#505f78] font-bold hover:underline">Request Access</Link>
            </p>

          </div>


        </div>
      </div>
    </main>
  );
}