"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { api } from "../../lib/api";
import RequireAuth from "../../components/RequireAuth";
import DummyAvatar from "../../components/DummyAvatar";
import ErrorText from "../../components/ErrorText";
import LoadingSpinner from "../../components/LoadingSpinner";

function AdminPanel() {
  const [workers, setWorkers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getWorkerApplications();
      setWorkers(res.workerProfiles || res.data?.workerProfiles || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const suspendAccount = async (id, workerId) => {
    if (!id) {
      setError("This application does not include a user id.");
      return;
    }
    setBusyId(workerId);
    setError("");
    try {
      await api.suspendUser(id);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const review = async (id, action) => {
    setBusyId(id);
    setError("");
    try {
      const actionMap = {
        approved: () => api.approveWorker(id),
        rejected: () => api.rejectWorker(id),
        suspended: () => api.suspendWorker(id),
        activated: () => api.activateWorker(id),
      };

      const handler = actionMap[action];
      if (!handler) {
        throw new Error("Invalid action");
      }

      await handler();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const counts = workers.reduce(
    (totals, worker) => {
      const status = String((worker.workerProfile || worker).status || "pending").toLowerCase();
      totals[status] = (totals[status] || 0) + 1;
      return totals;
    },
    { all: workers.length }
  );
  const filteredWorkers = workers.filter((worker) => {
    const profile = worker.workerProfile || worker;
    const account = worker.userId || worker;
    const status = String(profile.status || "pending").toLowerCase();
    const query = searchTerm.trim().toLowerCase();
    const searchable = [
      account.name,
      account.email,
      account.phone,
      profile.address,
      (profile.serviceCategory || profile.category)?.name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return (statusFilter === "all" || status === statusFilter) && searchable.includes(query);
  });

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#101B2B] bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D]" />
            Admin
          </span>
          <h1 className="font-display text-3xl text-[#101B2B] tracking-tight mt-3">
            Worker management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review application statuses and manage worker account access.
          </p>
        </div>

        <ErrorText>{error}</ErrorText>

        <section aria-label="Worker application status totals" className="grid grid-cols-2 gap-3 sm:grid-cols-5 mt-5">
          {["all", "pending", "approved", "rejected", "suspended"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              aria-pressed={statusFilter === status}
              className={`rounded-xl border bg-white p-3 text-left transition-colors ${
                statusFilter === status
                  ? "border-[#2E6E8E] ring-2 ring-[#2E6E8E]/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className="block text-xs font-medium capitalize text-slate-500">
                {status === "all" ? "All workers" : status}
              </span>
              <span className="mt-1 block text-xl font-semibold text-[#101B2B]">
                {counts[status] || 0}
              </span>
            </button>
          ))}
        </section>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="worker-search">Search workers</label>
          <input
            id="worker-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, email, phone, address, or service"
            className="input flex-1"
          />
          <label className="sr-only" htmlFor="worker-status-filter">Filter workers by status</label>
          <select
            id="worker-status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="input sm:max-w-48"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {loading ? (
          <div className="mt-4">
            <LoadingSpinner label="Loading workers..." className="mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl ticket-border h-24 animate-shimmer" />
              ))}
            </div>
          </div>
        ) : filteredWorkers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl ticket-border bg-white p-10 text-center mt-4"
          >
            <span className="text-3xl">✅</span>
            <p className="text-slate-600 font-medium mt-3">
              {workers.length === 0 ? "No worker applications found" : "No matching workers"}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              {workers.length === 0
                ? "Worker applications will appear here when submitted."
                : "Try a different search or status filter."}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3 mt-4">
            <AnimatePresence>
              {filteredWorkers.map((w, i) => {
                const wp = w.workerProfile || w;
                const account = w.userId || w;
                const category = wp.serviceCategory || wp.category;
                const status = (wp.status || "pending").toLowerCase();
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
                        alt={account.name || "Worker"}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <DummyAvatar name={w.name} size={56} />
                    )}
                    <div className="flex-1 min-w-[160px]">
                      <Link href={`/admin/worker-applications/${w._id}`} className="font-semibold text-[#101B2B] hover:text-[#2E6E8E]">
                        {account.name || "Worker"}
                      </Link>
                      <p className="text-sm text-slate-500">
                        {category?.name || "Unspecified category"} · {wp.experienceYears ?? wp.experience ?? 0} yrs experience
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">📍 {wp.address || account.customerProfile?.address || "No address"}</p>
                      <span className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-600">
                        {status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {status !== "approved" && (
                        <motion.button
                          whileHover={{ scale: isBusy ? 1 : 1.03 }}
                          whileTap={{ scale: isBusy ? 1 : 0.97 }}
                          onClick={() => review(w._id, "approved")}
                          disabled={isBusy}
                          className="inline-flex items-center gap-1.5 bg-[#101B2B] text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#1c2f47] transition-colors disabled:opacity-60"
                        >
                          {isBusy && (
                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          )}
                          Approve
                        </motion.button>
                      )}
                      {status !== "rejected" && (
                        <motion.button
                          whileHover={{ scale: isBusy ? 1 : 1.03 }}
                          whileTap={{ scale: isBusy ? 1 : 0.97 }}
                          onClick={() => review(w._id, "rejected")}
                          disabled={isBusy}
                          className="text-sm font-medium px-4 py-2 rounded-xl border border-[#C1502E]/30 text-[#C1502E] hover:bg-[#FBEAEA] transition-colors disabled:opacity-60"
                        >
                          Reject
                        </motion.button>
                      )}
                      {status === "approved" && (
                        <motion.button
                          whileHover={{ scale: isBusy ? 1 : 1.03 }}
                          whileTap={{ scale: isBusy ? 1 : 0.97 }}
                          onClick={() => review(w._id, "suspended")}
                          disabled={isBusy}
                          className="text-sm font-medium px-4 py-2 rounded-xl border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors disabled:opacity-60"
                        >
                          Suspend
                        </motion.button>
                      )}
                      {status === "suspended" && (
                        <motion.button
                          whileHover={{ scale: isBusy ? 1 : 1.03 }}
                          whileTap={{ scale: isBusy ? 1 : 0.97 }}
                          onClick={() => review(w._id, "activated")}
                          disabled={isBusy}
                          className="text-sm font-medium px-4 py-2 rounded-xl border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-colors disabled:opacity-60"
                        >
                          Activate
                        </motion.button>
                      )}
                      {status !== "suspended" && (
                        <motion.button
                          whileHover={{ scale: isBusy ? 1 : 1.03 }}
                          whileTap={{ scale: isBusy ? 1 : 0.97 }}
                          onClick={() => suspendAccount(account._id || account.id, w._id)}
                          disabled={isBusy}
                          className="text-sm font-medium px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-60"
                        >
                          Suspend user
                        </motion.button>
                      )}
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
    <RequireAuth role="admin">
      <AdminPanel />
    </RequireAuth>
  );
}