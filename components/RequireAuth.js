"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";

// Wrap any page's content with this to redirect guests to /login.
// `role` optional: "WORKER" | "ADMIN" — redirects home if logged in but lacking the role.
export default function RequireAuth({ children, role }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (role === "ADMIN" && !isAdmin) {
      router.push("/");
      return;
    }
    if (role === "WORKER" && !user.roles?.includes("WORKER")) {
      router.push("/become-worker");
    }
  }, [user, loading, role, isAdmin, router]);

  if (loading || !user) return <p className="text-slate-500 text-sm">Loading...</p>;

  return children;
}
