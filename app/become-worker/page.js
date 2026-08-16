"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import RequireAuth from "../../components/RequireAuth";
import ErrorText from "../../components/ErrorText";

function BecomeWorkerForm() {
  const router = useRouter();
  const { user, refresh } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    categoryId: "",
    experience: "",
    description: "",
    address: user?.address || "",
  });
  const [coords, setCoords] = useState(
    user?.location?.coordinates?.length === 2 && user.location.coordinates[0] !== 0
      ? { lat: user.location.coordinates[1], lng: user.location.coordinates[0] }
      : null
  );
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.listCategories().then((res) => setCategories(res.categories)).catch(() => {});
  }, []);

  const alreadyApplied = user?.roles?.includes("WORKER");

  const detectLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setError("Could not get location — enter address manually and try again, or continue without it.");
        setLocating(false);
      }
    );
  };

  const onPhotoChange = (e) => {
    const file = e.target.files?.[0];
    setPhotoFile(file || null);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!coords) {
      setError("Location is required — click 'Use my current location'.");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("categoryId", form.categoryId);
      fd.append("experience", form.experience);
      fd.append("description", form.description);
      fd.append("address", form.address);
      fd.append("lat", coords.lat);
      fd.append("lng", coords.lng);
      if (photoFile) fd.append("photo", photoFile);

      await api.applyAsWorker(fd);
      await refresh();
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (alreadyApplied) {
    const status = user.workerProfile?.verification?.status;
    const statusStyle =
      status === "VERIFIED"
        ? { bg: "#E9F5EE", ring: "#3F7D5C", label: "✅ Verified" }
        : status === "REJECTED"
        ? { bg: "#FBEAEA", ring: "#C1502E", label: "❌ Rejected" }
        : { bg: "#FDF1DC", ring: "#E8A33D", label: "⏳ Pending review" };

    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#F7F5F0] bg-blueprint flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-2xl bg-white ticket-border shadow-sm p-8 text-center"
        >
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full"
            style={{ backgroundColor: statusStyle.bg, color: statusStyle.ring }}
          >
            {statusStyle.label}
          </span>
          <p className="text-slate-700 mt-4">
            You've already applied as a worker.
          </p>
          {status === "PENDING" && (
            <p className="text-sm text-slate-500 mt-2">
              An admin needs to verify your application before you can receive bookings.
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F7F5F0] bg-blueprint px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <div className="rounded-2xl bg-white ticket-border shadow-sm p-7 sm:p-8">
          <h1 className="font-display text-2xl text-[#101B2B] tracking-tight">
            Become a worker
          </h1>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Submit your details — an admin will verify your application before you show up in
            search.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div className="flex items-center gap-4">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="preview"
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-[#E8A33D]/30"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#F7F5F0] border border-dashed border-slate-300 flex items-center justify-center text-xl">
                  📷
                </div>
              )}
              <label className="text-sm">
                <span className="inline-block cursor-pointer border border-slate-200 px-3.5 py-2 rounded-xl hover:border-[#2E6E8E] hover:text-[#2E6E8E] transition-colors font-medium">
                  Upload photo
                </span>
                <input type="file" accept="image/*" onChange={onPhotoChange} className="hidden" />
              </label>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">
                Category
              </label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition"
                required
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">
                Experience (years)
              </label>
              <input
                type="number"
                min="0"
                className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">
                Address
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <motion.button
              whileHover={{ scale: locating ? 1 : 1.01 }}
              whileTap={{ scale: locating ? 1 : 0.98 }}
              type="button"
              onClick={detectLocation}
              disabled={locating}
              className="w-full inline-flex items-center justify-center gap-1.5 text-sm font-medium border border-slate-200 px-4 py-2.5 rounded-xl hover:border-[#2E6E8E] hover:text-[#2E6E8E] transition-colors disabled:opacity-60"
            >
              {locating ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-[#2E6E8E] rounded-full animate-spin" />
                  Detecting...
                </>
              ) : coords ? (
                <>📍 Location captured</>
              ) : (
                <>📍 Use my current location</>
              )}
            </motion.button>

            <ErrorText>{error}</ErrorText>

            <motion.button
              whileHover={{ scale: submitting ? 1 : 1.01 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#101B2B] text-white font-medium py-3 rounded-xl hover:bg-[#1c2f47] transition-colors disabled:opacity-60 shadow-sm"
            >
              {submitting && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {submitting ? "Submitting..." : "Submit application"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default function BecomeWorkerPage() {
  return (
    <RequireAuth>
      <BecomeWorkerForm />
    </RequireAuth>
  );
}