export const metadata = { title: "Investor relations — ServiceHub11" };

const HIGHLIGHTS = [
  { label: "Categories live", value: "6+" },
  { label: "Verification flow", value: "Live" },
  { label: "Founded by", value: "IIIT Kottayam" },
];

const CONTACT_EMAIL = "your.email@example.com"; // 👉 replace

export default function InvestorRelationsPage() {
  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <section className="relative overflow-hidden bg-blueprint">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#E8A33D]/15 blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-10">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#101B2B] bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D]" />
            Investor relations
          </span>
          <h1 className="font-display mt-4 text-3xl sm:text-4xl tracking-tight text-[#101B2B]">
            Building the trust layer for local services
          </h1>
          <p className="mt-3 text-slate-600 text-lg max-w-xl">
            ServiceHub11 connects everyday households with verified local workers — plumbers,
            electricians, tutors, and more.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        {/* snapshot stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {HIGHLIGHTS.map((h) => (
            <div key={h.label} className="rounded-2xl bg-white ticket-border shadow-sm p-5 text-center">
              <div className="font-display text-xl text-[#101B2B]">{h.value}</div>
              <div className="text-xs text-slate-500 mt-1">{h.label}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white ticket-border shadow-sm p-7 sm:p-8 space-y-8">
          <div>
            <h2 className="font-display text-xl text-[#101B2B] mb-2">The opportunity</h2>
            <p className="text-slate-600 leading-relaxed">
              Finding a trustworthy local worker is still slow, unreliable, and word-of-mouth
              driven for most households. ServiceHub11 is building a verified, on-demand
              marketplace — starting with hyperlocal categories like plumbing, electrical work,
              carpentry, tutoring, photography, and pet care — with a clear path to more
              categories and cities.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-[#101B2B] mb-2">Why now</h2>
            <p className="text-slate-600 leading-relaxed">
              Rising urban demand for reliable home services, combined with underused mobile-first
              trades workforces, creates room for a platform that verifies supply and makes
              booking effortless — with AI-assisted matching and support layered in as the
              platform scales.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-[#101B2B] mb-2">Founding team</h2>
            <p className="text-slate-600 leading-relaxed">
              Founded and built by Shivam, a final-year Computer Science student at IIIT Kottayam
              with full-stack and applied AI/ML experience — currently building the product
              end-to-end, from backend architecture to frontend design.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-[#101B2B] mb-2">Get in touch</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              For investment inquiries, decks, or a conversation about where ServiceHub11 is
              headed, reach out directly.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Investor inquiry — ServiceHub11`}
              className="inline-flex items-center gap-2 bg-[#101B2B] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1c2f47] transition-colors"
            >
              Email founder
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}