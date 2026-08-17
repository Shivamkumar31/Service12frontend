import StaticPageLayout from "../../components/StaticPageLayout";

export const metadata = { title: "Verification process — ServiceHub11" };

const STEPS = [
  { n: "01", t: "Apply", d: "Submit your category, experience, address, and a photo." },
  { n: "02", t: "Admin review", d: "Our team checks your application details." },
  { n: "03", t: "Get verified", d: "Once approved, you appear in search and can accept bookings." },
];

export default function VerificationProcessPage() {
  return (
    <StaticPageLayout
      eyebrow="For workers"
      title="Verification process"
      subtitle="How we review worker applications before they go live."
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