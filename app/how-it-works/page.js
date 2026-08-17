import StaticPageLayout from "../../components/StaticPageLayout";

export const metadata = { title: "How it works — ServiceHub11" };

const STEPS = [
  { n: "01", t: "Search your need", d: "Pick a category — plumbing, electrical, tutoring, and more — or search directly." },
  { n: "02", t: "Compare workers", d: "See ratings, distance, experience, and hourly rate before you decide." },
  { n: "03", t: "Book instantly", d: "Pick a date and time — the worker confirms, and you're set." },
  { n: "04", t: "Get help, rate it", d: "After the job's done, leave a rating to help the next customer." },
];

export default function HowItWorksPage() {
  return (
    <StaticPageLayout
      eyebrow="Guide"
      title="How ServiceHub11 works"
      subtitle="From search to booking in four simple steps."
    >
      <div className="space-y-5 not-prose">
        {STEPS.map((step) => (
          <div key={step.n} className="flex gap-4">
            <span className="font-display text-2xl text-[#E8A33D] shrink-0">{step.n}</span>
            <div>
              <p className="font-semibold text-[#101B2B]">{step.t}</p>
              <p className="text-sm text-slate-500 mt-0.5">{step.d}</p>
            </div>
          </div>
        ))}
      </div>
    </StaticPageLayout>
  );
}