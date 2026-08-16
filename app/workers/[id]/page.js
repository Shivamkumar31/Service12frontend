"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import DummyAvatar from "../../../components/DummyAvatar";
import ErrorText from "../../../components/ErrorText";

export default function WorkerProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [worker, setWorker] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ serviceDate: "", serviceTime: "", notes: "" });
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api
      .getWorkerById(id)
      .then((res) => setWorker(res.worker))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const submitBooking = async (e) => {
    e.preventDefault();
    setBookError("");
    setSuccess("");

    if (!user) {
      router.push("/login");
      return;
    }

    setBooking(true);
    try {
      await api.createBooking({ workerId: id, ...form });
      setSuccess("Booking request sent! Track it from My bookings.");
      setForm({ serviceDate: "", serviceTime: "", notes: "" });
    } catch (err) {
      setBookError(err.message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F7F5F0] min-h-screen flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-slate-300 border-t-[#E8A33D] rounded-full animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-[#F7F5F0] min-h-screen px-6 py-10">
        <ErrorText>{error}</ErrorText>
      </div>
    );
  }
  if (!worker) return null;

  const wp = worker.workerProfile || {};
  // presentational only — reads whichever pricing field your API returns, no logic added
  const hourlyRate = wp.hourlyRate ?? wp.pricePerHour ?? wp.rate ?? null;

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {/* ---------------- LEFT: profile ---------------- */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="md:col-span-2 rounded-2xl bg-white ticket-border shadow-sm overflow-hidden"
          >
            {/* cover strip */}
            <div className="h-24 bg-gradient-to-r from-[#101B2B] via-[#1c2f47] to-[#2E6E8E] relative">
              <div className="absolute inset-0 bg-blueprint opacity-20" />
            </div>

            <div className="px-6 sm:px-8 pb-8">
              <div className="flex flex-wrap gap-5 -mt-10">
                <div className="ring-4 ring-white rounded-full shrink-0">
                  {wp.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={wp.photoUrl}
                      alt={worker.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <DummyAvatar name={worker.name} size={96} />
                  )}
                </div>

                <div className="pt-11 flex-1 min-w-[200px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-2xl text-[#101B2B] tracking-tight">
                      {worker.name}
                    </h1>
                    <span className="text-[10px] font-semibold uppercase tracking-wide bg-[#E9F5EE] text-[#3F7D5C] px-2 py-1 rounded-full border border-[#3F7D5C]/20">
                      ✅ Verified
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mt-0.5">{wp.category?.name}</p>
                </div>

                {hourlyRate && (
                  <div className="pt-11 text-right ml-auto">
                    <div className="font-display text-2xl text-[#101B2B]">
                      ₹{hourlyRate}
                      <span className="text-sm font-normal text-slate-400">/hr</span>
                    </div>
                    <p className="text-xs text-slate-400">Starting rate</p>
                  </div>
                )}
              </div>

              {/* stats row */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="rounded-xl bg-[#F7F5F0] border border-slate-200 px-4 py-3 text-center">
                  <div className="font-display text-lg text-[#101B2B]">
                    ⭐ {wp.rating || "—"}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Rating</div>
                </div>
                <div className="rounded-xl bg-[#F7F5F0] border border-slate-200 px-4 py-3 text-center">
                  <div className="font-display text-lg text-[#101B2B]">
                    {wp.totalJobs || 0}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Jobs done</div>
                </div>
                <div className="rounded-xl bg-[#F7F5F0] border border-slate-200 px-4 py-3 text-center">
                  <div className="font-display text-lg text-[#101B2B]">
                    {wp.experience || 0}
                    <span className="text-xs font-normal">yr</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Experience</div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-1.5 text-sm text-slate-500">
                <span>📍</span>
                {worker.address}
              </div>

              {wp.description && (
                <div className="mt-6 pt-6 border-t border-dashed border-slate-200">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                    About
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{wp.description}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* ---------------- RIGHT: sticky booking card ---------------- */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-2xl bg-white ticket-border shadow-sm p-6 md:sticky md:top-24"
          >
            <h2 className="font-display text-lg text-[#101B2B] mb-1">Book this worker</h2>
            <p className="text-xs text-slate-500 mb-4">
              {hourlyRate ? `₹${hourlyRate}/hr · ` : ""}Usually responds within a day
            </p>

            <form onSubmit={submitBooking} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">
                  Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition"
                  value={form.serviceDate}
                  onChange={(e) => setForm({ ...form, serviceDate: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">
                  Time
                </label>
                <input
                  type="time"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition"
                  value={form.serviceTime}
                  onChange={(e) => setForm({ ...form, serviceTime: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">
                  Notes (optional)
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition resize-none"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Uses your saved profile address by default. Update it from your dashboard if
                needed.
              </p>

              <ErrorText>{bookError}</ErrorText>
              {success && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-[#3F7D5C] bg-[#E9F5EE] border border-[#3F7D5C]/20 rounded-xl px-3.5 py-2.5"
                >
                  {success}
                </motion.p>
              )}

              <motion.button
                whileHover={{ scale: booking ? 1 : 1.02 }}
                whileTap={{ scale: booking ? 1 : 0.98 }}
                type="submit"
                disabled={booking}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#101B2B] text-white font-medium py-3 rounded-xl hover:bg-[#1c2f47] transition-colors disabled:opacity-60 shadow-sm"
              >
                {booking && (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {booking ? "Booking..." : user ? "Request booking" : "Log in to book"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}