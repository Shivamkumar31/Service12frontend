"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F7F5F0] px-4 text-center">
      <span className="rounded-full bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-red-700">
        Something went wrong
      </span>
      <h1 className="font-display mt-5 text-4xl tracking-tight text-[#101B2B]">
        We could not load this page
      </h1>
      <p className="mt-3 max-w-md text-slate-600">
        Please try again. If the problem continues, return home and contact Getworkfy support.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-[#101B2B] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1c2f47]"
        >
          Try again
        </button>
        <Link href="/" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-[#101B2B] transition hover:border-[#2E6E8E] hover:text-[#2E6E8E]">
          Back to home
        </Link>
      </div>
    </main>
  );
}
