"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import RequireAuth from "../../../components/RequireAuth";
import BookingCard from "../../../components/BookingCard";
import ErrorText from "../../../components/ErrorText";

function WorkerDashboard() {
  const router = useRouter();
  const { user, refresh, logout } = useAuth();

  // ---------- existing state — untouched ----------
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const wp = user?.workerProfile || {};
  const status = wp.verification?.status;

  const load = () => {
    setLoading(true);
    api
      .getWorkerBookings()
      .then((res) => setBookings(res.bookings))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (status === "VERIFIED") load();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleAction = async (bookingId, newStatus) => {
    try {
      await api.updateBookingStatus(bookingId, newStatus);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleAvailability = async () => {
    setToggling(true);
    try {
      await api.updateMyWorkerProfile({ isAvailable: !wp.availability?.isAvailable });
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setToggling(false);
    }
  };

  // ---------- new: tabs, settings form, logout — fully isolated ----------
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "settings"

  const [settingsForm, setSettingsForm] = useState({
    description: wp.description || "",
    experience: wp.experience || "",
    address: user?.address || "",
  });
  const [settingsPhotoFile, setSettingsPhotoFile] = useState(null);
  const [settingsPreview, setSettingsPreview] = useState(wp.photoUrl || null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");

  const onSettingsPhotoChange = (e) => {
    const file = e.target.files?.[0];
    setSettingsPhotoFile(file || null);
    if (file) setSettingsPreview(URL.createObjectURL(file));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSettingsError("");
    setSettingsSuccess("");
    setSavingSettings(true);
    try {
      const fd = new FormData();
      fd.append("description", settingsForm.description);
      fd.append("experience", settingsForm.experience);
      fd.append("address", settingsForm.address);
      if (settingsPhotoFile) fd.append("photo", settingsPhotoFile);

      // NOTE: add this method to lib/api.js + a matching backend route
      // (same multipart pattern as applyAsWorker)
      await api.updateWorkerSettings(fd);
      await refresh();
      setSettingsSuccess("Profile updated.");
    } catch (err) {
      setSettingsError(err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (status !== "VERIFIED") {
    const statusStyle =
      status === "REJECTED"
        ? { bg: "#FBEAEA", ring: "#C1502E", label: "❌ Rejected" }
        : status === "PENDING"
        ? { bg: "#FDF1DC", ring: "#E8A33D", label: "⏳ Pending review" }
        : { bg: "#F0EDE4", ring: "#8A7A56", label: "— Not submitted" };

    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#F7F5F0] bg-blueprint flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-2xl bg-white ticket-border shadow-sm p-8 text-center"
        >
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full"
            style={{ backgroundColor: statusStyle.bg, color: statusStyle.ring }}
          >
            {statusStyle.label}
          </span>
          <p className="text-slate-700 mt-4">
            Your worker application status is <strong>{status || "not submitted"}</strong>.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            You'll be able to receive bookings once an admin verifies your account.
          </p>
        </motion.div>
      </div>
    );
  }

  const isAvailable = wp.availability?.isAvailable;
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-[220px_1fr] gap-6">
        {/* ---------------- SIDEBAR ---------------- */}
        <aside className="md:sticky md:top-24 h-fit">
          <div className="rounded-2xl bg-white ticket-border shadow-sm p-4">
            <div className="flex items-center gap-3 px-2 pb-4 mb-2 border-b border-dashed border-slate-200">
              {settingsPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settingsPreview}
                  alt={user?.name}
                  className="w-11 h-11 rounded-full object-cover"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-[#FDF1DC] flex items-center justify-center text-lg font-semibold text-[#E8A33D]">
                  {user?.name?.[0]?.toUpperCase() || "W"}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#101B2B] truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{wp.category?.name}</p>
              </div>
            </div>

            <nav className="flex md:flex-col gap-1.5">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex-1 md:flex-none text-left text-sm font-medium px-3 py-2.5 rounded-xl transition-colors ${
                  activeTab === "overview"
                    ? "bg-[#101B2B] text-white"
                    : "text-slate-600 hover:bg-[#F7F5F0]"
                }`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 md:flex-none text-left text-sm font-medium px-3 py-2.5 rounded-xl transition-colors ${
                  activeTab === "settings"
                    ? "bg-[#101B2B] text-white"
                    : "text-slate-600 hover:bg-[#F7F5F0]"
                }`}
              >
                ⚙️ Settings
              </button>
            </nav>

            <button
              onClick={handleLogout}
              className="w-full mt-3 pt-3 border-t border-dashed border-slate-200 text-left text-sm font-medium px-3 py-2.5 rounded-xl text-[#C1502E] hover:bg-[#FBEAEA] transition-colors"
            >
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* ---------------- MAIN ---------------- */}
        <div>
          {activeTab === "overview" ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                <div>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#101B2B] bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E6E8E]" />
                    Worker
                  </span>
                  <h1 className="font-display text-3xl text-[#101B2B] tracking-tight mt-3">
                    Worker dashboard
                  </h1>
                </div>

                <motion.button
                  whileHover={{ scale: toggling ? 1 : 1.02 }}
                  whileTap={{ scale: toggling ? 1 : 0.97 }}
                  onClick={toggleAvailability}
                  disabled={toggling}
                  className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60 shadow-sm ${
                    isAvailable
                      ? "bg-[#E9F5EE] text-[#3F7D5C] hover:bg-[#dcf0e5]"
                      : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {toggling ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : isAvailable ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-[#3F7D5C] animate-pulse" />
                      Available — tap to pause
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      Paused — tap to go live
                    </>
                  )}
                </motion.button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Rating", value: wp.rating || 0, icon: "⭐" },
                  { label: "Jobs done", value: wp.totalJobs || 0, icon: "✅" },
                  { label: "Pending requests", value: pendingCount, icon: "📋" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="rounded-2xl bg-white ticket-border shadow-sm p-5 text-center"
                  >
                    <div className="text-xl mb-1">{stat.icon}</div>
                    <div className="font-display text-2xl text-[#101B2B]">{stat.value}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <ErrorText>{error}</ErrorText>

              <h2 className="font-display text-xl text-[#101B2B] mb-4">Booking requests</h2>

              {loading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-2xl ticket-border h-32 animate-shimmer" />
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl ticket-border bg-white p-10 text-center"
                >
                  <span className="text-3xl">📭</span>
                  <p className="text-slate-600 font-medium mt-3">No booking requests yet</p>
                  <p className="text-slate-500 text-sm mt-1">
                    Stay available and requests will show up here.
                  </p>
                </motion.div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {bookings.map((b, i) => (
                      <motion.div
                        key={b._id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.05 }}
                      >
                        <BookingCard booking={b} role="worker" onAction={handleAction} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          ) : (
            /* ---------------- SETTINGS TAB ---------------- */
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl bg-white ticket-border shadow-sm p-7 sm:p-8 max-w-xl"
            >
              <h1 className="font-display text-2xl text-[#101B2B] tracking-tight">
                Profile settings
              </h1>
              <p className="text-sm text-slate-500 mt-1 mb-6">
                Update your public profile — customers see this when they book you.
              </p>

              <form onSubmit={saveProfile} className="space-y-4">
                <div className="flex items-center gap-4">
                  {settingsPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={settingsPreview}
                      alt="preview"
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-[#E8A33D]/30"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#F7F5F0] border border-dashed border-slate-300 flex items-center justify-center text-xl">
                      📷
                    </div>
                  )}
                  <label className="text-sm">
                    <span className="inline-block cursor-pointer border border-slate-200 px-3.5 py-2 rounded-xl hover:border-[#2E6E8E] hover:text-[#2E6E8E] transition-colors font-medium">
                      Change photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onSettingsPhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition"
                    value={settingsForm.experience}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, experience: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition resize-none"
                    value={settingsForm.description}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">
                    Address
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition"
                    value={settingsForm.address}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, address: e.target.value })
                    }
                  />
                </div>

                <ErrorText>{settingsError}</ErrorText>
                {settingsSuccess && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-[#3F7D5C] bg-[#E9F5EE] border border-[#3F7D5C]/20 rounded-xl px-3.5 py-2.5"
                  >
                    {settingsSuccess}
                  </motion.p>
                )}

                <motion.button
                  whileHover={{ scale: savingSettings ? 1 : 1.01 }}
                  whileTap={{ scale: savingSettings ? 1 : 0.98 }}
                  type="submit"
                  disabled={savingSettings}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#101B2B] text-white font-medium py-3 rounded-xl hover:bg-[#1c2f47] transition-colors disabled:opacity-60 shadow-sm"
                >
                  {savingSettings && (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {savingSettings ? "Saving..." : "Save changes"}
                </motion.button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WorkerDashboardPage() {
  return (
    <RequireAuth role="WORKER">
      <WorkerDashboard />
    </RequireAuth>
  );
}