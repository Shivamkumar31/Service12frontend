"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";

// `role` can be "ADMIN" or "WORKER". In the new architecture, a worker is a
// customer with an approved WorkerProfile, not a separate user role.
export default function RequireAuth({ children, role }) {
  const { user, loading, isAdmin, isApprovedWorker, workerProfile } = useAuth();
  const router = useRouter();
  const normalizedRole = String(role || "").toLowerCase();
  const workerStatus = String(workerProfile?.status || "").toLowerCase();
  const hasApprovedWorker = Boolean(user && user.role === "customer" && workerStatus === "approved");

  const isAuthorized =
    Boolean(user) &&
    (!normalizedRole ||
      (normalizedRole === "admin" && isAdmin) ||
      (normalizedRole === "worker" && hasApprovedWorker));

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (normalizedRole === "admin" && !isAdmin) {
      router.push("/");
      return;
    }

    if (normalizedRole === "worker") {
      if (user.role !== "customer") {
        router.push("/");
        return;
      }

      if (!hasApprovedWorker) {
        router.push("/become-worker");
      }
    }
  }, [user, loading, normalizedRole, isAdmin, hasApprovedWorker, router]);

  if (loading || !isAuthorized) return <p className="text-slate-500 text-sm">Loading...</p>;

  return children;
}
