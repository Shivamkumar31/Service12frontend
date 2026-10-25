import Link from "next/link";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "Page not found",
  description: "The Getworkfy page you requested could not be found.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <main className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
        <span className="rounded-full bg-[#FFF5E5] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#B87516]">
          404
        </span>
        <h1 className="font-display mt-5 text-4xl tracking-tight text-[#101B2B]">
          This page could not be found
        </h1>
        <p className="mt-3 max-w-md text-slate-600">
          The link may be outdated, or the page may have moved. You can return home or browse
          verified local professionals.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-[#101B2B] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1c2f47]">
            Back to home
          </Link>
          <Link href="/workers" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-[#101B2B] transition hover:border-[#2E6E8E] hover:text-[#2E6E8E]">
            Find workers
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
