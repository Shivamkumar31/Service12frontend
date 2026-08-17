"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import ErrorText from "../components/ErrorText";

// purely presentational — cycles an accent color per category card, no data/logic change
const ACCENTS = [
  { bg: "#FDF1DC", ring: "#E8A33D" }, // amber
  { bg: "#E7F0F4", ring: "#2E6E8E" }, // steel
  { bg: "#EDEEF7", ring: "#5B5FA6" }, // indigo
  { bg: "#E9F5EE", ring: "#3F7D5C" }, // green
  { bg: "#FBEAEA", ring: "#C1502E" }, // rust
  { bg: "#F0EDE4", ring: "#8A7A56" }, // brass
];

const FOOTER_LINKS = {
  Company: [
    { label: "About us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Press", href: "/press" },
  ],
  Customers: [
    { label: "Find workers", href: "/workers" },
    { label: "How it works", href: "/how-it-works" },
    { label: "Safety center", href: "/safety-center" },
    { label: "Help & support", href: "/help" },
  ],
  Workers: [
    { label: "Become a worker", href: "/become-worker" },
    { label: "Worker resources", href: "/worker-resources" },
    { label: "Verification process", href: "/verification-process" },
  ],
  Legal: [
    { label: "Terms of service", href: "/terms" },
    { label: "Privacy policy", href: "/privacy" },
    { label: "Cookie policy", href: "/cookies" },
  ],
  Founders: [
    {label:"About me", href:"/about-me"},
    { label: "Contact us", href: "/contact-us" },
    { label: "Investor relations", href: "/investors" },
  ],          
};

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listCategories()
      .then((res) => setCategories(res.categories))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#F7F5F0]">
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-blueprint">
        {/* radial glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#E8A33D]/20 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-2 gap-12 items-center">
          {/* left: copy */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#101B2B] bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#3F7D5C]" />
              Verified · Nearby · Ready
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display mt-5 text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.05] tracking-tight text-[#101B2B]"
            >
              Book trusted local
              <br />
              workers<span className="text-[#E8A33D]">.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-slate-600 text-lg max-w-md"
            >
              Plumbers, electricians, tutors and more — verified, nearby, ready to help.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex items-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/workers"
                  className="inline-flex items-center gap-2 bg-[#101B2B] text-white px-6 py-3.5 rounded-full font-medium shadow-lg shadow-[#101B2B]/10 hover:bg-[#1c2f47] transition-colors"
                >
                  Find a worker
                  <span aria-hidden>→</span>
                </Link>
              </motion.div>
              <span className="text-sm text-slate-500">No sign-up needed to browse</span>
            </motion.div>

            {/* trust row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex items-center gap-6"
            >
              <div className="flex -space-x-2.5">
                {["#E8A33D", "#2E6E8E", "#3F7D5C", "#5B5FA6"].map((c, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-[#F7F5F0] flex items-center justify-center text-white text-xs font-semibold"
                    style={{ backgroundColor: c }}
                  >
                    {["RK", "AP", "SM", "NV"][i]}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-semibold text-[#101B2B]">4.8/5</span>
                <span className="text-slate-500"> from 1,200+ bookings</span>
              </div>
            </motion.div>
          </div>

          {/* right: built-in visual — no external image needed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative h-[420px] hidden sm:block"
          >
            {/* main "booking confirmed" card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 w-[280px] rounded-3xl bg-white ticket-border shadow-xl p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FDF1DC] flex items-center justify-center text-xl">
                  🔧
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#101B2B]">Ramesh Kumar</div>
                  <div className="text-xs text-slate-500">Electrician · 2.1 km away</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-dashed border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">Today, 4:30 PM</span>
                <span className="text-[10px] font-semibold uppercase tracking-wide bg-[#E9F5EE] text-[#3F7D5C] px-2 py-1 rounded-full">
                  ✅ Confirmed
                </span>
              </div>
            </motion.div>

            {/* floating rating chip */}
            <motion.div
              className="animate-floaty absolute top-2 -left-2 bg-white rounded-2xl shadow-md px-3.5 py-2.5"
              style={{ "--r": "-4deg" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-sm font-semibold text-[#101B2B]">⭐ 4.9</div>
              <div className="text-[10px] text-slate-400">128 reviews</div>
            </motion.div>

            {/* floating "nearby" chip */}
            <motion.div
              className="animate-floaty absolute top-24 -right-2 bg-white rounded-2xl shadow-md px-3.5 py-2.5"
              style={{ "--r": "5deg", animationDelay: "0.8s" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
            >
              <div className="text-sm font-semibold text-[#101B2B]">📍 2.1 km</div>
              <div className="text-[10px] text-slate-400">nearest match</div>
            </motion.div>

            {/* category tag stack behind */}
            {[
              { label: "🪚 Carpentry", top: "260px", left: "8%", r: "-6deg" },
              { label: "🐾 Pet Care", top: "300px", left: "58%", r: "4deg" },
              { label: "📷 Photography", top: "355px", left: "22%", r: "3deg" },
            ].map((tag, i) => (
              <motion.div
                key={tag.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="absolute bg-white ticket-border rounded-xl px-3 py-1.5 text-xs font-medium text-[#101B2B] shadow-sm"
                style={{ top: tag.top, left: tag.left, transform: `rotate(${tag.r})` }}
              >
                {tag.label}
              </motion.div>
            ))}

            {/* soft accent blob behind everything */}
            <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full bg-[#2E6E8E]/10 blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* ---------------- CATEGORIES ---------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-[#101B2B]">
              Browse by category
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Pick a trade, see verified workers near you.
            </p>
          </div>
        </div>

        <ErrorText>{error}</ErrorText>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl ticket-border p-5 h-[120px] animate-shimmer"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((c, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              return (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  whileHover={{ y: -6, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
                >
                  <Link
                    href={`/workers?category=${c._id}`}
                    className="block rounded-2xl bg-white ticket-border p-5 text-center shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div
                      className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-2xl mb-3"
                      style={{ backgroundColor: accent.bg, boxShadow: `inset 0 0 0 1.5px ${accent.ring}33` }}
                    >
                      {c.icon}
                    </div>
                    <div className="text-sm font-semibold text-[#101B2B]">{c.name}</div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="rounded-3xl bg-[#101B2B] text-white px-6 sm:px-10 py-12 grid sm:grid-cols-3 gap-8">
          {[
            { n: "01", t: "Search your need", d: "Pick a category or search a service near you." },
            { n: "02", t: "Compare workers", d: "Check ratings, distance and availability." },
            { n: "03", t: "Book instantly", d: "Confirm a slot and get help, verified and ready." },
          ].map((step) => (
            <div key={step.n}>
              <span className="font-display text-[#E8A33D] text-3xl">{step.n}</span>
              <h3 className="font-display text-lg mt-2">{step.t}</h3>
              <p className="text-slate-300 text-sm mt-1">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="bg-[#101B2B] text-slate-300 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-10">
            <div className="md:col-span-1">
              <Link
                href="/"
                className="font-display text-xl tracking-tight text-white flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#E8A33D]" />
                ServiceHub<span className="text-[#E8A33D]">11</span>
              </Link>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed max-w-[220px]">
                Verified local workers, booked in minutes.
              </p>
            </div>

            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
                  {heading}
                </h3>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-300 hover:text-[#E8A33D] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-dashed border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} ServiceHub11. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <Link href="#" className="hover:text-[#E8A33D] transition-colors text-sm">
                Instagram
              </Link>
              <Link href="#" className="hover:text-[#E8A33D] transition-colors text-sm">
                LinkedIn
              </Link>
              <Link href="#" className="hover:text-[#E8A33D] transition-colors text-sm">
                Twitter
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}