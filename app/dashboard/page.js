"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import RequireAuth from "../../components/RequireAuth";
import BookingCard from "../../components/BookingCard";
import ErrorText from "../../components/ErrorText";

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

  const handleAction = async (bookingId, status) => {
    try {
      if (status === "CANCELLED") {
        await api.cancelBooking(bookingId);
      }
      load();
    } catch (err) {
      setError(err.message);
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
      () => {
        setLocError("Could not get your location.");
        setLocating(false);
      }
    );
  };

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
          <div>
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
            className="inline-flex items-center gap-1.5 text-sm font-medium border border-slate-200 bg-white px-4 py-2.5 rounded-xl hover:border-[#2E6E8E] hover:text-[#2E6E8E] transition-colors disabled:opacity-60"
          >
            {locating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-[#2E6E8E] rounded-full animate-spin" />
                Detecting...
              </>
            ) : (
              <>📍 Update saved location</>
            )}
          </motion.button>
        </div>

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
            <span className="text-3xl">📋</span>
            <p className="text-slate-600 font-medium mt-3">No bookings yet</p>
            <p className="text-slate-500 text-sm mt-1">
              Go find a worker to book your first service.
            </p>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
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