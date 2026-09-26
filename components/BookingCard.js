import { useState } from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import Icon from "./Icon";

// `role` = "customer" | "worker" controls which side's name is shown and which
// actions are offered (worker gets accept/reject/progress, customer gets cancel).
export default function BookingCard({ booking, role, onAction }) {
  const [activeAction, setActiveAction] = useState("");
  const [actionError, setActionError] = useState("");
  const normalizedStatus = String(booking?.status || "").toLowerCase();
  const otherParty = role === "customer" ? booking.workerId : booking.userId;
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
    pending: role === "worker" ? [["accepted", "Accept"], ["rejected", "Reject"]] : [],
    accepted: role === "worker" ? [["in_progress", "Start job"]] : [],
    in_progress: role === "worker" ? [["completed", "Mark completed"]] : [],
  };

  const actions = nextActions[normalizedStatus] || [];

  const runAction = async (status) => {
    if (activeAction) return;
    let reason;
    if (status === "cancelled") {
      if (!window.confirm("Cancel this booking? This action cannot be undone.")) return;
      reason = window.prompt("Cancellation reason (optional):", "") || "";
    }

    setActionError("");
    setActiveAction(status);
    try {
      await onAction(booking._id, status, reason);
    } catch (error) {
      setActionError(error.message || "Could not update this booking.");
    } finally {
      setActiveAction("");
    }
  };

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#cbd8e3] hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-[#101B2B]">
            {role === "customer" ? otherParty?.name || "Worker" : otherParty?.name || "Customer"}
          </p>
          <p className="mt-1 text-sm font-medium text-[#2E6E8E]">
            {booking.categoryId?.name || "Local service"}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <Link href={`/bookings/${booking._id}`} className="mt-2 inline-block text-xs font-semibold text-[#2E6E8E] hover:underline">
        View booking details →
      </Link>

      <div className="mt-4 grid gap-2 border-y border-dashed border-slate-200 py-4 text-sm text-slate-600">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FFF5E5] text-[#b87516]" aria-hidden="true"><Icon name="calendar" size={15} /></span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Scheduled for</p>
            <p className="mt-0.5 font-medium text-[#101B2B]">{displayDate} <span className="font-normal text-slate-500">at {displayTime}</span></p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EAF3F7] text-[#2E6E8E]" aria-hidden="true"><Icon name="pin" size={15} /></span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Service location</p>
            <p className="mt-0.5 break-words font-medium text-[#101B2B]">{booking.serviceAddress || "Address to be confirmed"}</p>
          </div>
        </div>
        {booking.notes && (
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500" aria-hidden="true"><Icon name="note" size={15} /></span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Customer note</p>
              <p className="mt-0.5 break-words text-slate-600">{booking.notes}</p>
            </div>
          </div>
        )}
      </div>

      {(actions.length > 0 || (role === "customer" && normalizedStatus === "pending")) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {actions.map(([status, label]) => (
            <button
              key={status}
              onClick={() => runAction(status)}
              disabled={Boolean(activeAction)}
              className={status === "rejected" ? "btn-danger text-sm" : "btn-primary text-sm"}
            >
              {activeAction === status && <span className="mr-1.5 h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/30 border-t-current" />}
              {activeAction === status ? "Updating..." : label}
            </button>
          ))}
          {role === "customer" && normalizedStatus === "pending" && (
            <button onClick={() => runAction("cancelled")} disabled={Boolean(activeAction)} className="btn-secondary text-sm">
              {activeAction === "cancelled" && <span className="mr-1.5 h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-400/30 border-t-slate-500" />}
              {activeAction === "cancelled" ? "Cancelling..." : "Cancel booking"}
            </button>
          )}
        </div>
      )}
      {actionError && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
          {actionError}
        </p>
      )}
    </article>
  );
}
