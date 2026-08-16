"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import RequireAuth from "../../../components/RequireAuth";
import BookingCard from "../../../components/BookingCard";
import ErrorText from "../../../components/ErrorText";

function WorkerDashboard() {
  const { user, refresh } = useAuth();
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

  if (status !== "VERIFIED") {
    return (
      <div className="card max-w-md mx-auto text-center">
        <p className="text-slate-700">
          Your worker application status is <strong>{status || "not submitted"}</strong>.
        </p>
        <p className="text-sm text-slate-500 mt-2">
          You'll be able to receive bookings once an admin verifies your account.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-slate-900">Worker dashboard</h1>
        <button onClick={toggleAvailability} className="btn-secondary text-sm" disabled={toggling}>
          {toggling
            ? "Updating..."
            : wp.availability?.isAvailable
            ? "🟢 Available (tap to pause)"
            : "⚪ Paused (tap to go live)"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div className="card">
          <p className="text-xl font-semibold">{wp.rating || 0}</p>
          <p className="text-xs text-slate-500">Rating</p>
        </div>
        <div className="card">
          <p className="text-xl font-semibold">{wp.totalJobs || 0}</p>
          <p className="text-xs text-slate-500">Jobs done</p>
        </div>
        <div className="card">
          <p className="text-xl font-semibold">{bookings.filter((b) => b.status === "PENDING").length}</p>
          <p className="text-xs text-slate-500">Pending requests</p>
        </div>
      </div>

      <ErrorText>{error}</ErrorText>

      {loading ? (
        <p className="text-slate-500 text-sm">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-slate-500 text-sm">No booking requests yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {bookings.map((b) => (
            <BookingCard key={b._id} booking={b} role="worker" onAction={handleAction} />
          ))}
        </div>
      )}
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
