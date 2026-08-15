/**
 * authRouting.ts
 *
 * Centralized post-authentication routing.
 * Every auth entry point (password login, OTP verify, OAuth callback)
 * must call routeAfterAuth() instead of hardcoding /home.
 *
 * Decision tree:
 *
 *   fetch /auth/me (profile)
 *       │
 *       ├── profile exists?
 *       │       ├── YES + admin role  → /admin
 *       │       └── YES + other role  → /home
 *       │
 *       └── profile does NOT exist
 *               ├── admin role hint   → /auth/admin/setup
 *               └── otherwise         → /onboarding
 */

import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/apiClient";

/** Roles that belong to the admin surface */
const ADMIN_ROLES = ["super_admin", "founder", "moderator", "junior_moderator"] as const;
type AdminRole = typeof ADMIN_ROLES[number];

function isAdminRole(role: string): role is AdminRole {
  return ADMIN_ROLES.includes(role as AdminRole);
}

/**
 * Determines the post-login destination from `public.profiles` and
 * calls `router.replace(destination)`.
 *
 * @param router   The Next.js AppRouter instance (from useRouter()).
 * @param token    Optional: an explicit access token (available right after
 *                 signInWithPassword / verifyOtp). If omitted the function
 *                 reads the active Supabase session automatically.
 */
export async function routeAfterAuth(
  router: { replace: (path: string) => void },
  token?: string | null
): Promise<void> {
  try {
    // 1. Resolve the access token to use
    let accessToken = token ?? null;

    if (!accessToken) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      accessToken = session?.access_token ?? null;
    }

    if (!accessToken) {
      // No session at all — send back to sign-in
      router.replace("/signin");
      return;
    }

    // 2. Fetch the profile from our backend
    let profileData: any = null;
    try {
      profileData = await apiFetch("/auth/me", { token: accessToken });
    } catch (fetchErr) {
      console.error("[routeAfterAuth] /auth/me fetch failed:", fetchErr);
    }

    const profile = profileData?.profile ?? null;
    const role: string = profile?.role ?? "";

    // 3. Route based on profile existence and role
    if (!profile) {
      // Profile does not exist yet — new user
      // For admin sign-up flow the profile won't exist until /auth/admin/setup
      // completes, but we have no reliable way to detect that from here alone.
      // Regular new users → onboarding.
      router.replace("/onboarding");
      return;
    }

    // Profile exists — route by role
    if (isAdminRole(role)) {
      router.replace("/admin");
    } else {
      router.replace("/home");
    }
  } catch (err) {
    console.error("[routeAfterAuth] Unexpected error:", err);
    // Safe fallback — let the app layout handle further redirects
    router.replace("/home");
  }
}
