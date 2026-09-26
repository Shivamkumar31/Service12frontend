"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../lib/auth-context";

export default function Navbar() {
  const { user, logout, isWorker, isWorkerPending, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const showBecomeWorkerLink =
    user?.role === "customer" && !isWorker && (user?.workerProfile?.status === "rejected" || !user?.workerProfile);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-20">
      {/* thin tool-stripe accent */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#101B2B] via-[#E8A33D] to-[#101B2B]" />

      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center"
            aria-label="Getworkfy home"
          >
            <img
              src="/getworkfy-logo.png"
              alt="Getworkfy - Local Services Near You"
              className="h-12 w-auto max-w-[215px] object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-5 text-sm md:flex">
            <Link
              href="/workers"
              className="relative text-slate-600 hover:text-[#101B2B] transition-colors group hidden sm:inline-block"
            >
              Find workers
              <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-[#E8A33D] transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/how-it-works"
              className="relative text-slate-600 hover:text-[#101B2B] transition-colors group hidden md:inline-block"
            >
              How it works
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
                <Link
                  href="/profile"
                  className="relative text-slate-600 hover:text-[#101B2B] transition-colors group hidden md:inline-block"
                >
                  Profile
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
                {showBecomeWorkerLink && (
                  <Link
                    href="/become-worker"
                    className="relative text-slate-600 hover:text-[#101B2B] transition-colors group hidden md:inline-block"
                  >
                    {user?.workerProfile?.status === "rejected" ? "Apply again" : "Become a worker"}
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

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-[#101B2B] md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            <span className="text-xl leading-none">{menuOpen ? "×" : "☰"}</span>
          </button>
        </div>

        {menuOpen && (
          <div id="mobile-navigation" className="border-t border-slate-200 bg-white px-4 pb-4 pt-3 md:hidden">
            <nav className="flex flex-col gap-1 text-sm" aria-label="Mobile navigation">
              <Link onClick={closeMenu} href="/workers" className="rounded-xl px-3 py-3 font-medium text-slate-700 hover:bg-[#F7F5F0]">Find workers</Link>
              <Link onClick={closeMenu} href="/how-it-works" className="rounded-xl px-3 py-3 font-medium text-slate-700 hover:bg-[#F7F5F0]">How it works</Link>
              {!loading && !user && (
                <>
                  <Link onClick={closeMenu} href="/login" className="rounded-xl px-3 py-3 font-medium text-slate-700 hover:bg-[#F7F5F0]">Login</Link>
                  <Link onClick={closeMenu} href="/register" className="mt-1 rounded-xl bg-[#101B2B] px-3 py-3 text-center font-medium text-white">Create an account</Link>
                </>
              )}
              {!loading && user && (
                <>
                  <Link onClick={closeMenu} href="/dashboard" className="rounded-xl px-3 py-3 font-medium text-slate-700 hover:bg-[#F7F5F0]">My bookings</Link>
                  <Link onClick={closeMenu} href="/profile" className="rounded-xl px-3 py-3 font-medium text-slate-700 hover:bg-[#F7F5F0]">Profile</Link>
                  {isWorker && <Link onClick={closeMenu} href="/worker/dashboard" className="rounded-xl px-3 py-3 font-medium text-slate-700 hover:bg-[#F7F5F0]">Worker dashboard</Link>}
                  {showBecomeWorkerLink && <Link onClick={closeMenu} href="/become-worker" className="rounded-xl px-3 py-3 font-medium text-slate-700 hover:bg-[#F7F5F0]">{user?.workerProfile?.status === "rejected" ? "Apply again" : "Become a worker"}</Link>}
                  {isAdmin && <Link onClick={closeMenu} href="/admin" className="rounded-xl px-3 py-3 font-medium text-slate-700 hover:bg-[#F7F5F0]">Admin</Link>}
                  <div className="my-1 border-t border-slate-100" />
                  <p className="px-3 py-2 text-xs text-slate-500">Signed in as <span className="font-semibold text-[#101B2B]">{user.name}</span></p>
                  <button onClick={handleLogout} className="rounded-xl px-3 py-3 text-left font-medium text-slate-700 hover:bg-[#F7F5F0]">Log out</button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
