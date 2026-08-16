"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import ErrorText from "../../components/ErrorText";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.login(form);
      login(res.token, res.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F7F5F0] bg-blueprint flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <Link
            href="/"
            className="font-display text-2xl tracking-tight text-[#101B2B] inline-flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-[#E8A33D]" />
            ServiceHub<span className="text-[#E8A33D]">11</span>
          </Link>
        </div>

        <div className="rounded-2xl bg-white ticket-border shadow-sm p-7 sm:p-8">
          <h1 className="font-display text-2xl text-[#101B2B] tracking-tight">Log in</h1>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Welcome back — book a worker in a few taps.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <ErrorText>{error}</ErrorText>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#101B2B] text-white font-medium py-3 rounded-xl hover:bg-[#1c2f47] transition-colors disabled:opacity-60 shadow-sm"
            >
              {loading && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading ? "Logging in..." : "Log in"}
            </motion.button>
          </form>
        </div>

        <p className="text-sm text-slate-500 mt-5 text-center">
          No account?{" "}
          <Link href="/register" className="text-[#101B2B] font-semibold hover:text-[#E8A33D] transition-colors">
            Sign up
          </Link>{" "}
          or{" "}
          <Link href="/otp-login" className="text-[#101B2B] font-semibold hover:text-[#E8A33D] transition-colors">
            use phone OTP
          </Link>
          .
        </p>
      </motion.div>
    </div>
  );
}