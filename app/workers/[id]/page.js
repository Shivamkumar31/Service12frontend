"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import DummyAvatar from "../../../components/DummyAvatar";
import ErrorText from "../../../components/ErrorText";
import SiteFooter from "../../../components/SiteFooter";
import Icon from "../../../components/Icon";

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
  const [bookingSummary, setBookingSummary] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    api
      .getWorkerById(id)
      .then((res) => {
        const profile = res.workerProfile || res.worker || res.data?.workerProfile;
        if (!profile) {
          setWorker(null);
          return;
        }
        const account = profile.userId || {};
        const currentUserId = user?._id || user?.id;
        const workerUserId = account._id || account.id;
        setIsOwnProfile(Boolean(currentUserId && workerUserId && String(currentUserId) === String(workerUserId)));
        setWorker({
          ...profile,
          name: account.name || profile.name || "Service professional",
          address: profile.address || account.customerProfile?.address || "",
          workerProfile: profile,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, user]);

  const submitBooking = async (e) => {
    e.preventDefault();
    setBookError("");

    if (!user) {
      router.push(`/login?returnTo=${encodeURIComponent(`/workers/${id}`)}`);
      return;
    }
    if (isOwnProfile) {
      setBookError("You cannot book your own worker profile.");
      return;
    }

    if (form.serviceDate < today) {
      setBookError("Please choose today or a future date.");
      return;
    }

    if (form.serviceDate === today) {
      const currentTime = new Date().toTimeString().slice(0, 5);
      if (form.serviceTime <= currentTime) {
        setBookError("Please choose a future time for today.");
        return;
      }
    }

    setBooking(true);
    try {
      await api.createBooking({ workerId: id, ...form });
      setBookingSummary({
        workerName: worker.name,
        serviceName:
          worker.workerProfile?.serviceCategory?.name ||
          worker.workerProfile?.category?.name ||
          "Local service",
        serviceDate: form.serviceDate,
        serviceTime: form.serviceTime,
        address: worker.address,
      });
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
  if (isOwnProfile) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center ticket-border">
          <h1 className="font-display text-2xl text-[#101B2B]">Your worker profile</h1>
          <p className="mt-2 text-sm text-slate-500">You cannot create a booking for your own profile.</p>
          <button type="button" onClick={() => router.push("/worker/dashboard")} className="btn-primary mt-5">
            Go to worker dashboard
          </button>
        </div>
      </div>
    );
  }

  if (bookingSummary) {
    return (
      <>
        <div className="bg-[#F7F5F0] min-h-screen px-4 sm:px-6 py-16">
          <motion.section
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-xl mx-auto rounded-3xl bg-white ticket-border shadow-sm p-8 sm:p-12 text-center"
            aria-live="polite"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.15 }}
              className="mx-auto w-20 h-20 rounded-full bg-[#E9F5EE] text-[#3F7D5C] flex items-center justify-center text-4xl"
              aria-hidden="true"
            >
              ✓
            </motion.div>
            <h1 className="font-display text-3xl text-[#101B2B] mt-6">
              Booking request placed
            </h1>
            <p className="text-slate-600 mt-2">
              Your request has been sent to {bookingSummary.workerName}. You can track updates
              from My bookings.
            </p>

            <div className="mt-8 rounded-2xl bg-[#F7F5F0] border border-slate-200 p-5 text-left space-y-3">
              <div className="flex justify-between gap-4">
                <span className="text-sm text-slate-500">Service</span>
                <span className="text-sm font-medium text-[#101B2B] text-right">
                  {bookingSummary.serviceName}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sm text-slate-500">Date</span>
                <span className="text-sm font-medium text-[#101B2B]">{bookingSummary.serviceDate}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sm text-slate-500">Time</span>
                <span className="text-sm font-medium text-[#101B2B]">{bookingSummary.serviceTime}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sm text-slate-500">Address</span>
                <span className="text-sm font-medium text-[#101B2B] text-right">
                  {bookingSummary.address || "Saved profile address"}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <a
                href="/dashboard"
                className="inline-flex justify-center rounded-full bg-[#101B2B] text-white px-6 py-3 font-medium hover:bg-[#1c2f47] transition-colors"
              >
                View my bookings
              </a>
              <a
                href="/"
                className="inline-flex justify-center rounded-full border border-slate-200 text-[#101B2B] px-6 py-3 font-medium hover:border-[#2E6E8E] transition-colors"
              >
                Back to home
              </a>
            </div>
          </motion.section>
        </div>
        <SiteFooter />
      </>
    );
  }

  const wp = worker.workerProfile || worker;
  const category = wp.serviceCategory || wp.category;
  // presentational only — reads whichever pricing field your API returns, no logic added
  const hourlyRate = wp.hourlyRate ?? wp.pricePerHour ?? wp.rate ?? null;

  return (
    <>
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
            <div className="h-32 bg-gradient-to-r from-[#101B2B] via-[#1c2f47] to-[#2E6E8E] relative">
              <div className="absolute inset-0 bg-blueprint opacity-20" />
              <div className="absolute right-6 top-5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
                Local professional
              </div>
            </div>

            <div className="px-6 sm:px-8 pb-8">
              <div className="flex flex-wrap items-end gap-5 -mt-16">
                <div className="relative ring-4 ring-white rounded-2xl shrink-0 bg-[#F7F5F0] shadow-lg">
                  {wp.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={wp.photoUrl}
                      alt={`${worker.name} - ${category?.name || "local service professional"}`}
                      className="w-32 h-32 rounded-2xl object-cover"
                    />
                  ) : (
                    <DummyAvatar name={worker.name} size={128} className="rounded-2xl" />
                  )}
                  <span className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-[#3F7D5C] text-sm text-white shadow-sm" aria-label="Verified professional">
                    ✓
                  </span>
                </div>

                <div className="pb-1 flex-1 min-w-[200px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-2xl sm:text-3xl text-[#101B2B] tracking-tight">
                      {worker.name}
                    </h1>
                    <span className="text-[10px] font-semibold uppercase tracking-wide bg-[#E9F5EE] text-[#3F7D5C] px-2.5 py-1 rounded-full border border-[#3F7D5C]/20">
                      Verified
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mt-1">{category?.name || "Service professional"}</p>
                </div>

                {hourlyRate && (
                  <div className="pb-1 text-right ml-auto">
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
                    <span className="inline-flex items-center gap-1"><Icon name="star" size={17} className="text-[#E8A33D]" /> {wp.rating || "—"}</span>
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
                    {wp.experienceYears ?? wp.experience ?? 0}
                    <span className="text-xs font-normal">yr</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Experience</div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-1.5 text-sm text-slate-500">
                <Icon name="pin" size={16} className="text-[#2E6E8E]" />
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
                  min={today}
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
    <SiteFooter />
    </>
  );
}
