"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "../../../lib/api";
import RequireAuth from "../../../components/RequireAuth";
import ErrorText from "../../../components/ErrorText";
import StatusBadge from "../../../components/StatusBadge";

function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true);
    api.getBookingById(id)
      .then((response) => setBooking(response.booking || response.data?.booking || response.data || null))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const cancel = async () => {
    if (!window.confirm("Cancel this booking?")) return;
    setBusy(true);
    setError("");
    try {
      const reason = window.prompt("Cancellation reason (optional):", "") || "";
      await api.cancelBooking(id, reason);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="mx-auto max-w-2xl px-4 py-16 text-sm text-slate-500">Loading booking...</div>;
  if (!booking) return <div className="mx-auto max-w-2xl px-4 py-16"><ErrorText>{error || "Booking not found."}</ErrorText></div>;

  const status = String(booking.status || "").toLowerCase();
  return (
    <div className="min-h-screen bg-[#F7F5F0] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="text-sm font-medium text-[#2E6E8E]">← Back to bookings</Link>
        <article className="mt-4 rounded-2xl bg-white p-7 shadow-sm ticket-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#2E6E8E]">Booking details</p>
              <h1 className="mt-1 font-display text-3xl text-[#101B2B]">{booking.categoryId?.name || "Local service"}</h1>
            </div>
            <StatusBadge status={booking.status} />
          </div>
          <div className="mt-6 space-y-4 border-y border-dashed border-slate-200 py-5 text-sm">
            <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Worker</p><p className="mt-1 font-medium text-[#101B2B]">{booking.workerId?.name || "Worker"}</p></div>
            <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Scheduled for</p><p className="mt-1 font-medium text-[#101B2B]">{booking.serviceDate || "Date to be confirmed"} at {booking.serviceTime || "Time to be confirmed"}</p></div>
            <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Service address</p><p className="mt-1 font-medium text-[#101B2B]">{booking.serviceAddress || "Address to be confirmed"}</p></div>
            {booking.notes && <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Notes</p><p className="mt-1 text-slate-600">{booking.notes}</p></div>}
          </div>
          <ErrorText>{error}</ErrorText>
          {status === "pending" && (
            <button type="button" onClick={cancel} disabled={busy} className="btn-danger mt-5">{busy ? "Cancelling..." : "Cancel booking"}</button>
          )}
        </article>
      </div>
    </div>
  );
}

export default function BookingDetailsPage() {
  return <RequireAuth><BookingDetails /></RequireAuth>;
}
