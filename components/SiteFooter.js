import Link from "next/link";

const FOOTER_LINKS = {
  Company: [{ label: "About us", href: "/about" }, { label: "Careers", href: "/careers" }, { label: "Blog", href: "/blog" }, { label: "Press", href: "/press" }],
  Customers: [{ label: "Find workers", href: "/workers" }, { label: "How it works", href: "/how-it-works" }, { label: "Safety center", href: "/safety-center" }, { label: "Help and support", href: "/help" }],
  Workers: [{ label: "Become a worker", href: "/become-worker" }, { label: "Worker resources", href: "/worker-resources" }, { label: "Verification process", href: "/verification-process" }],
  Legal: [{ label: "Terms of service", href: "/terms" }, { label: "Privacy policy", href: "/privacy" }, { label: "Cookie policy", href: "/cookies" }],
};

export default function SiteFooter() {
  return (
    <footer className="bg-[#101B2B] text-slate-300 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-10">
          <div className="md:col-span-1">
            <Link href="/" className="font-display text-xl tracking-tight text-white flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#E8A33D]" />Getworkfy</Link>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed max-w-[220px]">Verified local workers, booked in minutes.</p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">{heading}</h2>
              <ul className="space-y-2.5">{links.map((link) => <li key={link.label}><Link href={link.href} className="text-sm text-slate-300 hover:text-[#E8A33D] transition-colors">{link.label}</Link></li>)}</ul>
            </div>
          ))}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Contact</h2>
            <Link href="/contact-us" className="text-sm text-slate-300 hover:text-[#E8A33D] transition-colors">Contact us</Link>
            <Link href="/about-me" className="block mt-2.5 text-sm text-slate-300 hover:text-[#E8A33D] transition-colors">About the founder</Link>
            <Link href="/investors" className="block mt-2.5 text-sm text-slate-300 hover:text-[#E8A33D] transition-colors">Investor relations</Link>
          </div>
        </div>
        <p className="mt-12 pt-6 border-t border-dashed border-white/10 text-xs text-slate-500">© {new Date().getFullYear()} Getworkfy. All rights reserved.</p>
      </div>
    </footer>
  );
}
