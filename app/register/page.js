"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import ErrorText from "../../components/ErrorText";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState(null);

  const detectLocation = () => {
    setLocating(true);
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation not supported in this browser — you can still register without it.");
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setError("Could not get location — allow permission or enter address manually.");
        setLocating(false);
      }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { ...form };
      if (coords) {
        payload.lat = coords.lat;
        payload.lng = coords.lng;
      }
      const res = await api.register(payload);
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
          <h1 className="font-display text-2xl text-[#101B2B] tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Get help from verified local workers in minutes.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">
                Name
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

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
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">
                Address
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <motion.button
              whileHover={{ scale: locating ? 1 : 1.01 }}
              whileTap={{ scale: locating ? 1 : 0.98 }}
              type="button"
              onClick={detectLocation}
              disabled={locating}
              className="w-full inline-flex items-center justify-center gap-1.5 text-sm font-medium border border-slate-200 px-4 py-2.5 rounded-xl hover:border-[#2E6E8E] hover:text-[#2E6E8E] transition-colors disabled:opacity-60"
            >
              {locating ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-[#2E6E8E] rounded-full animate-spin" />
                  Detecting...
                </>
              ) : coords ? (
                <>📍 Location captured</>
              ) : (
                <>📍 Use my current location</>
              )}
            </motion.button>

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
              {loading ? "Creating account..." : "Sign up"}
            </motion.button>
          </form>
        </div>

        <p className="text-sm text-slate-500 mt-5 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-[#101B2B] font-semibold hover:text-[#E8A33D] transition-colors">
            Log in
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