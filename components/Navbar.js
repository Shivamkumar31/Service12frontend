"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "../lib/auth-context";

export default function Navbar() {
  const { user, logout, isWorker, isWorkerPending, isAdmin, loading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-20">
      {/* thin tool-stripe accent */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#101B2B] via-[#E8A33D] to-[#101B2B]" />

      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-2xl tracking-tight text-[#101B2B] flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-[#E8A33D]" />
            ServiceHub<span className="text-[#E8A33D]">11</span>
          </Link>

          <nav className="flex items-center gap-5 text-sm">
            <Link
              href="/workers"
              className="relative text-slate-600 hover:text-[#101B2B] transition-colors group hidden sm:inline-block"
            >
              Find workers
              <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-[#E8A33D] transition-all duration-300 group-hover:w-full" />
            </Link>

            {!loading && !user && (
              <>
                <Link
                  href="/login"
                  className="relative text-slate-600 hover:text-[#101B2B] transition-colors group"
                >
                  Login
                  <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-[#E8A33D] transition-all duration-300 group-hover:w-full" />
                </Link>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/register"
                    className="bg-[#101B2B] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#1c2f47] transition-colors shadow-sm"
                  >
                    Sign up
                  </Link>
                </motion.div>
              </>
            )}

            {!loading && user && (
              <>
                <Link
                  href="/dashboard"
                  className="relative text-slate-600 hover:text-[#101B2B] transition-colors group hidden sm:inline-block"
                >
                  My bookings
                  <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-[#E8A33D] transition-all duration-300 group-hover:w-full" />
                </Link>

                {isWorker && (
                  <Link
                    href="/worker/dashboard"
                    className="relative text-slate-600 hover:text-[#101B2B] transition-colors group hidden sm:inline-block"
                  >
                    Worker dashboard
                    <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-[#E8A33D] transition-all duration-300 group-hover:w-full" />
                  </Link>
                )}
                {isWorkerPending && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    Worker: pending
                  </span>
                )}
                {!user.roles?.includes("WORKER") && (
                  <Link
                    href="/become-worker"
                    className="relative text-slate-600 hover:text-[#101B2B] transition-colors group hidden md:inline-block"
                  >
                    Become a worker
                    <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-[#E8A33D] transition-all duration-300 group-hover:w-full" />
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="relative text-slate-600 hover:text-[#101B2B] transition-colors group"
                  >
                    Admin
                    <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-[#E8A33D] transition-all duration-300 group-hover:w-full" />
                  </Link>
                )}

                <span className="w-px h-5 bg-slate-200" />
                <span className="text-slate-500 hidden sm:inline text-sm">
                  Hi, <span className="font-medium text-[#101B2B]">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-600 border border-slate-300 px-3.5 py-1.5 rounded-full hover:border-[#101B2B] hover:text-[#101B2B] transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}