"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../lib/api";
import RequireAuth from "../../components/RequireAuth";
import DummyAvatar from "../../components/DummyAvatar";
import ErrorText from "../../components/ErrorText";

function AdminPanel() {
  const [workers, setWorkers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .getPendingWorkers()
      .then((res) => setWorkers(res.workers))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const review = async (id, status) => {
    setBusyId(id);
    setError("");
    try {
      await api.reviewWorker(id, { status });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#101B2B] bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D]" />
            Admin
          </span>
          <h1 className="font-display text-3xl text-[#101B2B] tracking-tight mt-3">
            Pending worker applications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {workers.length} application{workers.length === 1 ? "" : "s"} waiting for review.
          </p>
        </div>

        <ErrorText>{error}</ErrorText>

        {loading ? (
          <div className="space-y-3 mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl ticket-border h-24 animate-shimmer" />
            ))}
          </div>
        ) : workers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl ticket-border bg-white p-10 text-center mt-4"
          >
            <span className="text-3xl">✅</span>
            <p className="text-slate-600 font-medium mt-3">All caught up</p>
            <p className="text-slate-500 text-sm mt-1">No pending applications right now.</p>
          </motion.div>
        ) : (
          <div className="space-y-3 mt-4">
            <AnimatePresence>
              {workers.map((w, i) => {
                const wp = w.workerProfile || {};
                const isBusy = busyId === w._id;
                return (
                  <motion.div
                    key={w._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="rounded-2xl bg-white ticket-border shadow-sm p-5 flex flex-wrap items-center gap-4"
                  >
                    {wp.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={wp.photoUrl}
                        alt={w.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <DummyAvatar name={w.name} size={56} />
                    )}
                    <div className="flex-1 min-w-[160px]">
                      <p className="font-semibold text-[#101B2B]">{w.name}</p>
                      <p className="text-sm text-slate-500">
                        {wp.category?.name} · {wp.experience || 0} yrs experience
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">📍 {w.address}</p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: isBusy ? 1 : 1.03 }}
                        whileTap={{ scale: isBusy ? 1 : 0.97 }}
                        onClick={() => review(w._id, "VERIFIED")}
                        disabled={isBusy}
                        className="inline-flex items-center gap-1.5 bg-[#101B2B] text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#1c2f47] transition-colors disabled:opacity-60"
                      >
                        {isBusy && (
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        Verify
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: isBusy ? 1 : 1.03 }}
                        whileTap={{ scale: isBusy ? 1 : 0.97 }}
                        onClick={() => review(w._id, "REJECTED")}
                        disabled={isBusy}
                        className="text-sm font-medium px-4 py-2 rounded-xl border border-[#C1502E]/30 text-[#C1502E] hover:bg-[#FBEAEA] transition-colors disabled:opacity-60"
                      >
                        Reject
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <RequireAuth role="ADMIN">
      <AdminPanel />
    </RequireAuth>
  );
}