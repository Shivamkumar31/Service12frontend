"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "../../../lib/api";
import RequireAuth from "../../../components/RequireAuth";
import ErrorText from "../../../components/ErrorText";
import StatusBadge from "../../../components/StatusBadge";
import LoadingSpinner from "../../../components/LoadingSpinner";
import CancelBookingModal from "../../../components/CancelBookingModal";

function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const load = () => {
    setLoading(true);
    api.getBookingById(id)
      .then((response) => setBooking(response.booking || response.data?.booking || response.data || null))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleCancelConfirm = async (reason) => {
    setBusy(true);
    setError("");
    try {
      await api.cancelBooking(id, reason);
      setIsCancelModalOpen(false);
      load();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="mx-auto max-w-2xl px-4 py-16"><LoadingSpinner label="Loading booking..." /></div>;
  if (!booking) return <div className="mx-auto max-w-2xl px-4 py-16"><ErrorText>{error || "Booking not found."}</ErrorText></div>;

  const status = String(booking.status || "").toLowerCase();
  const workerName = booking.workerId?.name || "Service professional";
  const serviceTitle = booking.categoryId?.name || "Local service";

  return (
    <div className="min-h-screen bg-[#F7F5F0] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="text-sm font-medium text-[#2E6E8E] hover:underline">
          ← Back to bookings
        </Link>
        <article className="mt-4 rounded-3xl bg-white p-7 sm:p-9 shadow-sm ticket-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#2E6E8E]">Booking details</p>
              <h1 className="mt-1 font-display text-3xl text-[#101B2B]">{serviceTitle}</h1>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <div className="mt-6 space-y-4 border-y border-dashed border-slate-200 py-6 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Worker</p>
              <p className="mt-1 font-semibold text-base text-[#101B2B]">{workerName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Scheduled for</p>
              <p className="mt-1 font-medium text-[#101B2B]">
                {booking.serviceDate || "Date to be confirmed"} at {booking.serviceTime || "Time to be confirmed"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Service address</p>
              <p className="mt-1 font-medium text-[#101B2B]">{booking.serviceAddress || "Address to be confirmed"}</p>
            </div>
            {booking.notes && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Notes</p>
                <p className="mt-1 text-slate-600 bg-[#F7F5F0] p-3 rounded-xl border border-slate-100">{booking.notes}</p>
              </div>
            )}
            {booking.cancellationReason && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-red-500">Cancellation reason</p>
                <p className="mt-1 text-red-700 bg-red-50 p-3 rounded-xl border border-red-100">{booking.cancellationReason}</p>
              </div>
            )}
          </div>

          <ErrorText>{error}</ErrorText>

          {status === "pending" && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                disabled={busy}
                className="rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {busy ? "Cancelling..." : "Cancel booking"}
              </button>
            </div>
          )}
        </article>
      </div>

      <CancelBookingModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        bookingTitle={serviceTitle}
        targetName={workerName}
        isBusy={busy}
      />
    </div>
  );
}

export default function BookingDetailsPage() {
  return <RequireAuth><BookingDetails /></RequireAuth>;
}
