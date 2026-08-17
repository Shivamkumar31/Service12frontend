"use client";

import { useState } from "react";

// 👉 replace these with your real details
const CONTACT = {
  email: "your.email@example.com",
  phoneDisplay: "+91 00000 00000",
  whatsappNumber: "910000000000", // country code + number, no + or spaces
};

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${form.name || "website visitor"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
  };

  const whatsappHref = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(
    "Hi, I'd like to get in touch regarding ServiceHub11."
  )}`;

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <section className="relative overflow-hidden bg-blueprint">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#E8A33D]/15 blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-10 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#101B2B] bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D]" />
            Contact
          </span>
          <h1 className="font-display mt-4 text-3xl sm:text-4xl tracking-tight text-[#101B2B]">
            Get in touch
          </h1>
          <p className="mt-3 text-slate-600 text-lg">
            Questions, feedback, or a partnership idea — reach out directly.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 grid sm:grid-cols-2 gap-4 -mt-2">
        {/* quick contact cards */}
        <a
          href={`mailto:${CONTACT.email}`}
          className="flex items-center gap-3 rounded-2xl bg-white ticket-border shadow-sm px-5 py-4 hover:border-[#E8A33D] transition-colors"
        >
          <span className="text-2xl">✉️</span>
          <div>
            <p className="text-xs text-slate-400">Email</p>
            <p className="text-sm font-semibold text-[#101B2B]">{CONTACT.email}</p>
          </div>
        </a>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl bg-white ticket-border shadow-sm px-5 py-4 hover:border-[#3F7D5C] transition-colors"
        >
          <span className="text-2xl">💬</span>
          <div>
            <p className="text-xs text-slate-400">WhatsApp</p>
            <p className="text-sm font-semibold text-[#101B2B]">{CONTACT.phoneDisplay}</p>
          </div>
        </a>

        {/* form */}
        <div className="sm:col-span-2 rounded-2xl bg-white ticket-border shadow-sm p-7 sm:p-8">
          <h2 className="font-display text-xl text-[#101B2B] mb-1">Send a message</h2>
          <p className="text-sm text-slate-500 mb-6">
            This opens your email app with the message pre-filled — just hit send.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">
                Your name
              </label>
              <input
                required
                className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">
                Your email
              </label>
              <input
                type="email"
                required
                className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block">
                Message
              </label>
              <textarea
                required
                rows={5}
                className="w-full rounded-xl border border-slate-200 bg-[#F7F5F0] px-3.5 py-2.5 text-sm text-[#101B2B] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/50 focus:border-[#E8A33D] transition resize-none"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#101B2B] text-white font-medium py-3 rounded-xl hover:bg-[#1c2f47] transition-colors shadow-sm"
            >
              Send message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}