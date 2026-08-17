"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function StaticPageLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <section className="relative overflow-hidden bg-blueprint">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#E8A33D]/15 blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-14 pb-10">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-[#101B2B] transition-colors inline-flex items-center gap-1"
          >
            ← Back home
          </Link>

          {eyebrow && (
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-5 inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#101B2B] bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D]" />
              {eyebrow}
            </motion.span>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display mt-4 text-3xl sm:text-4xl tracking-tight text-[#101B2B]"
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-3 text-slate-600 text-lg max-w-xl"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 pb-20"
      >
        <div className="rounded-2xl bg-white ticket-border shadow-sm p-7 sm:p-10 prose-content">
          {children}
        </div>
      </motion.section>
    </div>
  );
}