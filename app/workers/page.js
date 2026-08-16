"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../lib/api";
import WorkerCard from "../../components/WorkerCard";
import ErrorText from "../../components/ErrorText";

function WorkersContent() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [coords, setCoords] = useState(null);
  const [radiusKm, setRadiusKm] = useState(25);
  const [workers, setWorkers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    api.listCategories().then((res) => setCategories(res.categories)).catch(() => {});
  }, []);

  const search = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getNearbyWorkers({
        category: category || undefined,
        lat: coords?.lat,
        lng: coords?.lng,
        radiusKm,
      });
      setWorkers(res.workers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detectLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setError("Could not get your location. Showing all verified workers instead.");
        setLocating(false);
      }
    );
  };

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* header */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#101B2B] bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3F7D5C]" />
            {workers.length} {workers.length === 1 ? "worker" : "workers"} found
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#101B2B] mt-3 tracking-tight">
            Find workers
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Filter by trade, set your radius, and book verified help near you.
          </p>
        </div>

        {/* filter panel — styled like a job-ticket control strip */}
        <div className="rounded-2xl bg-white ticket-border shadow-sm p-5 mb-8">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">
                Category
              </label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-28">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">
                Radius (km)
              </label>
              <input
                type="number"
                className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition"
                value={radiusKm}
                onChange={(e) => setRadiusKm(e.target.value)}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={detectLocation}
              disabled={locating}
              className="inline-flex items-center gap-1.5 text-sm font-medium border border-slate-200 px-4 py-2.5 rounded-xl hover:border-[#2E6E8E] hover:text-[#2E6E8E] transition-colors disabled:opacity-60"
            >
              {locating ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-[#2E6E8E] rounded-full animate-spin" />
                  Detecting...
                </>
              ) : coords ? (
                <>📍 Location set</>
              ) : (
                <>📍 Use my location</>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={search}
              disabled={loading}
              className="inline-flex items-center gap-1.5 bg-[#101B2B] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#1c2f47] transition-colors disabled:opacity-60 shadow-sm"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </motion.button>
          </div>
        </div>

        <ErrorText>{error}</ErrorText>

        {/* results */}
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl ticket-border h-32 animate-shimmer" />
            ))}
          </div>
        ) : workers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl ticket-border bg-white p-10 text-center mt-4"
          >
            <span className="text-3xl">🔍</span>
            <p className="text-slate-600 font-medium mt-3">No verified workers found</p>
            <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
              Try a wider radius, a different category, or check back after an admin verifies some
              worker applications.
            </p>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            <AnimatePresence>
              {workers.map((w, i) => (
                <motion.div
                  key={w._id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <WorkerCard worker={w} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WorkersPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#F7F5F0] min-h-screen flex items-center justify-center">
          <span className="w-6 h-6 border-2 border-slate-300 border-t-[#E8A33D] rounded-full animate-spin" />
        </div>
      }
    >
      <WorkersContent />
    </Suspense>
  );
}