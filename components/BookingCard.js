"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import Icon from "./Icon";
import CancelBookingModal from "./CancelBookingModal";

const STEPS = [
  { id: "pending", label: "Requested" },
  { id: "accepted", label: "Accepted" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

function BookingProgressStepper({ status }) {
  const norm = String(status || "").toLowerCase();
  if (norm === "cancelled" || norm === "rejected") {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 border border-red-100">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Booking was {norm === "cancelled" ? "cancelled" : "declined"}
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.id === norm);
  const activeStep = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full pt-1 pb-2">
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-slate-100 -z-0" />
        {/* Active track line */}
        <div
          className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-[#2E6E8E] transition-all duration-300 -z-0"
          style={{ width: `${(activeStep / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, idx) => {
          const isDone = idx <= activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                  isDone
                    ? "bg-[#2E6E8E] text-white shadow-sm ring-2 ring-white"
                    : "bg-slate-200 text-slate-500"
                } ${isCurrent ? "ring-2 ring-[#E8A33D]" : ""}`}
              >
                {isDone ? "✓" : idx + 1}
              </div>
              <span
                className={`mt-1 text-[10px] font-medium tracking-tight whitespace-nowrap ${
                  isCurrent ? "text-[#101B2B] font-semibold" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BookingCard({ booking, role, onAction }) {
  const [activeAction, setActiveAction] = useState("");
  const [actionError, setActionError] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const normalizedStatus = String(booking?.status || "").toLowerCase();
  const otherParty = role === "customer" ? booking.workerId : booking.userId;
  const targetName = otherParty?.name || (role === "customer" ? "the professional" : "the client");
  const serviceTitle = booking.categoryId?.name || "Local service";

  const displayDate = booking.serviceDate
    ? new Date(`${booking.serviceDate}T${booking.serviceTime || "00:00"}`).toLocaleDateString(
        "en-IN",
        { day: "numeric", month: "short", year: "numeric" }
      )
    : "Date to be confirmed";

  const displayTime = booking.serviceTime
    ? new Date(`1970-01-01T${booking.serviceTime}`).toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "Time to be confirmed";

  const nextActions = {
    pending: role === "worker" ? [["accepted", "Accept request"], ["rejected", "Decline"]] : [],
    accepted: role === "worker" ? [["in_progress", "Start job"]] : [],
    in_progress: role === "worker" ? [["completed", "Mark completed"]] : [],
  };

  const actions = nextActions[normalizedStatus] || [];

  const runAction = async (status, reason = "") => {
    if (activeAction) return;
    setActionError("");
    setActiveAction(status);
    try {
      await onAction(booking._id, status, reason);
      if (status === "cancelled") {
        setIsCancelModalOpen(false);
      }
    } catch (error) {
      setActionError(error.message || "Could not update this booking.");
      throw error;
    } finally {
      setActiveAction("");
    }
  };

  return (
    <>
      <article className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CBD8E3] hover:shadow-md flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {role === "customer" ? "Assigned Professional" : "Client"}
              </span>
              <p className="truncate text-lg font-semibold text-[#101B2B] mt-0.5">
                {targetName}
              </p>
              <p className="text-sm font-medium text-[#2E6E8E]">
                {serviceTitle}
              </p>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          {/* Stepper Progress */}
          <div className="my-4">
            <BookingProgressStepper status={booking.status} />
          </div>

          {/* Details Section */}
          <div className="grid gap-2.5 border-t border-dashed border-slate-200 pt-4 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FFF5E5] text-[#B87516]" aria-hidden="true">
                <Icon name="calendar" size={15} />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Scheduled for</p>
                <p className="mt-0.5 font-medium text-[#101B2B]">
                  {displayDate} <span className="font-normal text-slate-500">at {displayTime}</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EAF3F7] text-[#2E6E8E]" aria-hidden="true">
                <Icon name="pin" size={15} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Service address</p>
                <p className="mt-0.5 break-words font-medium text-[#101B2B]">
                  {booking.serviceAddress || "Saved profile address"}
                </p>
              </div>
            </div>

            {booking.notes && (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500" aria-hidden="true">
                  <Icon name="note" size={15} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Special notes</p>
                  <p className="mt-0.5 break-words text-slate-600 text-xs leading-relaxed">{booking.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/bookings/${booking._id}`}
            className="text-xs font-semibold text-[#2E6E8E] hover:text-[#101B2B] transition-colors inline-flex items-center gap-1"
          >
            Full details →
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {actions.map(([status, label]) => (
              <button
                key={status}
                type="button"
                onClick={() => runAction(status)}
                disabled={Boolean(activeAction)}
                className={
                  status === "rejected"
                    ? "rounded-xl border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
                    : "rounded-xl bg-[#101B2B] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#1C2F47] transition-colors disabled:opacity-50 shadow-sm"
                }
              >
                {activeAction === status ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                    Updating...
                  </span>
                ) : (
                  label
                )}
              </button>
            ))}

            {role === "customer" && normalizedStatus === "pending" && (
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                disabled={Boolean(activeAction)}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:border-red-300 hover:text-red-700 transition-colors disabled:opacity-50"
              >
                Cancel booking
              </button>
            )}
          </div>
        </div>

        {actionError && (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
            {actionError}
          </p>
        )}
      </article>

      {/* Cancel Booking Modal */}
      <CancelBookingModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={(reason) => runAction("cancelled", reason)}
        bookingTitle={serviceTitle}
        targetName={targetName}
        isBusy={activeAction === "cancelled"}
      />
    </>
  );
}
