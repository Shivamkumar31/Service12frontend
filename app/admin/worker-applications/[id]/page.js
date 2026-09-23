"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "../../../../lib/api";
import RequireAuth from "../../../../components/RequireAuth";
import ErrorText from "../../../../components/ErrorText";

function ApplicationDetails() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.getWorkerApplications()
      .then((response) => {
        const applications = response.workerProfiles || response.data?.workerProfiles || [];
        setApplication(applications.find((item) => item._id === id) || null);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const review = async (action) => {
    setBusy(true);
    setError("");
    try {
      const handlers = {
        approve: api.approveWorker,
        reject: api.rejectWorker,
        suspend: api.suspendWorker,
        activate: api.activateWorker,
      };
      await handlers[action](id);
      const response = await api.getWorkerApplications();
      const applications = response.workerProfiles || response.data?.workerProfiles || [];
      setApplication(applications.find((item) => item._id === id) || application);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!application) {
    return <div className="mx-auto max-w-2xl px-4 py-16"><ErrorText>{error || "Loading application..."}</ErrorText></div>;
  }

  const profile = application.workerProfile || application;
  const account = application.userId || application;
  const status = String(profile.status || "pending").toLowerCase();
  return (
    <div className="min-h-screen bg-[#F7F5F0] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/admin" className="text-sm font-medium text-[#2E6E8E]">← Back to applications</Link>
        <article className="mt-4 rounded-2xl bg-white p-7 shadow-sm ticket-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#2E6E8E]">Worker application</p>
          <h1 className="mt-1 font-display text-3xl text-[#101B2B]">{account.name || "Worker"}</h1>
          <p className="mt-1 text-sm text-slate-500">{account.email || "No email provided"}</p>
          <div className="mt-6 grid gap-4 border-y border-dashed border-slate-200 py-5 text-sm sm:grid-cols-2">
            <div><p className="text-xs font-semibold uppercase text-slate-400">Status</p><p className="mt-1 font-semibold capitalize">{status}</p></div>
            <div><p className="text-xs font-semibold uppercase text-slate-400">Category</p><p className="mt-1">{(profile.serviceCategory || profile.category)?.name || "Unspecified"}</p></div>
            <div><p className="text-xs font-semibold uppercase text-slate-400">Experience</p><p className="mt-1">{profile.experienceYears ?? profile.experience ?? 0} years</p></div>
            <div><p className="text-xs font-semibold uppercase text-slate-400">Address</p><p className="mt-1">{profile.address || "No address"}</p></div>
          </div>
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase text-slate-400">Description</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{profile.description || "No description provided."}</p>
          </div>
          <ErrorText>{error}</ErrorText>
          <div className="mt-6 flex flex-wrap gap-2">
            {status !== "approved" && <button className="btn-primary" disabled={busy} onClick={() => review("approve")}>Approve</button>}
            {status !== "rejected" && <button className="btn-danger" disabled={busy} onClick={() => review("reject")}>Reject</button>}
            {status === "approved" && <button className="btn-secondary" disabled={busy} onClick={() => review("suspend")}>Suspend worker</button>}
            {status === "suspended" && <button className="btn-secondary" disabled={busy} onClick={() => review("activate")}>Activate worker</button>}
          </div>
        </article>
      </div>
    </div>
  );
}

export default function WorkerApplicationDetailsPage() {
  return <RequireAuth role="admin"><ApplicationDetails /></RequireAuth>;
}
