"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRESET_REASONS = [
  "Schedule conflict",
  "Found another service provider",
  "Requested by mistake",
  "Price or terms not suitable",
  "Emergency / Not needed anymore",
  "Other reason",
];

export default function CancelBookingModal({
  isOpen,
  onClose,
  onConfirm,
  bookingTitle = "this booking",
  targetName = "the provider",
  isBusy = false,
}) {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_REASONS[0]);
  const [customNote, setCustomNote] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError("");

    const finalReason =
      selectedPreset === "Other reason"
        ? customNote.trim() || "No specific reason provided"
        : customNote.trim()
        ? `${selectedPreset}: ${customNote.trim()}`
        : selectedPreset;

    try {
      await onConfirm(finalReason);
    } catch (err) {
      setError(err?.message || "Failed to cancel booking. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isBusy ? onClose : undefined}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />

        {/* Modal dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl ticket-border z-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
        >
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h2 id="cancel-modal-title" className="font-display text-2xl text-[#101B2B]">
                Cancel Booking
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Are you sure you want to cancel <span className="font-medium text-[#101B2B]">{bookingTitle}</span> with{" "}
                <span className="font-medium text-[#101B2B]">{targetName}</span>?
              </p>
            </div>
          </div>

          <form onSubmit={handleConfirm} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                Reason for cancellation
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_REASONS.map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setSelectedPreset(preset)}
                    className={`text-left text-xs rounded-xl px-3.5 py-2.5 border transition-all ${
                      selectedPreset === preset
                        ? "border-[#101B2B] bg-[#101B2B] text-white font-medium shadow-sm"
                        : "border-slate-200 bg-[#F7F5F0] text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="cancel-note" className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Additional comments (optional)
              </label>
              <textarea
                id="cancel-note"
                rows={3}
                placeholder="Let the other party know any details..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition resize-none"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-3 border-t border-dashed border-slate-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isBusy}
                className="inline-flex justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Keep booking
              </button>
              <button
                type="submit"
                disabled={isBusy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 shadow-sm"
              >
                {isBusy && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}
                {isBusy ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

