"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import RequireAuth from "../../components/RequireAuth";
import BookingCard from "../../components/BookingCard";
import ErrorText from "../../components/ErrorText";
import Icon from "../../components/Icon";

function Dashboard() {
  const { user, refresh } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [locError, setLocError] = useState("");
  const [locSuccess, setLocSuccess] = useState("");
  const [locating, setLocating] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .getMyBookings()
      .then((res) => setBookings(res.bookings))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleAction = async (bookingId, status, reason) => {
    try {
      if (status === "cancelled") {
        await api.cancelBooking(bookingId, reason);
      }
      await load();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateLocation = () => {
    setLocating(true);
    setLocError("");
    setLocSuccess("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await api.updateMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          await refresh();
          setLocSuccess("Location saved. Future bookings will use it by default.");
        } catch (err) {
          setLocError(err.message);
        } finally {
          setLocating(false);
        }
      },
      (positionError) => {
        const message =
          positionError.code === 1
            ? "Location permission was denied. Allow location access in your browser and try again."
            : positionError.code === 3
            ? "Location detection timed out. Try again or check your device settings."
            : "Could not get your location. Check your device location settings and try again.";
        setLocError(message);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col gap-4 mb-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2E6E8E]">
              Customer dashboard
            </p>
            <h1 className="font-display text-3xl text-[#101B2B] tracking-tight">
              My bookings
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Address on file: {user?.address || "not set"}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: locating ? 1 : 1.02 }}
            whileTap={{ scale: locating ? 1 : 0.97 }}
            onClick={updateLocation}
            disabled={locating}
            className="inline-flex w-full items-center justify-center gap-1.5 text-sm font-medium border border-slate-200 bg-white px-4 py-2.5 rounded-xl hover:border-[#2E6E8E] hover:text-[#2E6E8E] transition-colors disabled:opacity-60 sm:w-auto"
          >
            {locating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-[#2E6E8E] rounded-full animate-spin" />
                Detecting...
              </>
            ) : (
              <><Icon name="pin" size={16} /> Update saved location</>
            )}
          </motion.button>
        </div>

        {!loading && bookings.length > 0 && (
          <div className="mb-7 mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["All requests", bookings.length, "bg-white"],
              ["Pending", bookings.filter((b) => String(b.status || "").toLowerCase() === "pending").length, "bg-[#FFF5E5]"],
              ["Upcoming", bookings.filter((b) => ["accepted", "in_progress"].includes(String(b.status || "").toLowerCase())).length, "bg-[#EAF3F7]"],
              ["Completed", bookings.filter((b) => String(b.status || "").toLowerCase() === "completed").length, "bg-[#E9F5EE]"],
            ].map(([label, value, background]) => (
              <div key={label} className={`rounded-2xl border border-slate-200 px-4 py-3 shadow-sm ${background}`}>
                <p className="text-2xl font-semibold text-[#101B2B]">{value}</p>
                <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mb-6">
          <ErrorText>{locError}</ErrorText>
          {locSuccess && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-[#3F7D5C] bg-[#E9F5EE] border border-[#3F7D5C]/20 rounded-xl px-3.5 py-2.5 mt-2 inline-block"
            >
              {locSuccess}
            </motion.p>
          )}
        </div>

        <ErrorText>{error}</ErrorText>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl ticket-border h-32 animate-shimmer" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl ticket-border bg-white p-10 text-center mt-4"
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3F7] text-[#2E6E8E]"><Icon name="list" size={24} /></span>
            <p className="text-slate-600 font-medium mt-3">No bookings yet</p>
            <p className="text-slate-500 text-sm mt-1">
              Go find a worker to book your first service.
            </p>
            <Link href="/workers" className="inline-flex mt-5 bg-[#101B2B] text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-[#1c2f47] transition-colors">
              Find workers
            </Link>
          </motion.div>
        ) : (
          <>
          <div className="mb-3 mt-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-xl text-[#101B2B]">Your service requests</h2>
              <p className="mt-1 text-sm text-slate-500">Track appointments and stay updated.</p>
            </div>
            <span className="hidden text-xs font-semibold uppercase tracking-wide text-slate-400 sm:block">
              {bookings.length} total
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AnimatePresence>
              {bookings.map((b, i) => (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <BookingCard booking={b} role="customer" onAction={handleAction} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}
