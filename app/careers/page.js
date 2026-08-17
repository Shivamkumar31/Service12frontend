import StaticPageLayout from "../../components/StaticPageLayout";

export const metadata = { title: "Careers — ServiceHub11" };

const OPEN_ROLES = [
  { title: "Backend Engineer", type: "Full-time · Remote" },
  { title: "Product Designer", type: "Full-time · Hybrid" },
  { title: "City Operations Lead", type: "Full-time · On-site" },
  { title: "Customer Support Associate", type: "Part-time · Remote" },
];

export default function CareersPage() {
  return (
    <StaticPageLayout
      eyebrow="Join us"
      title="Careers at ServiceHub11"
      subtitle="Help us build the easiest way to find trusted local help."
    >
      <h2>Open roles</h2>
      <div className="space-y-3 not-prose">
        {OPEN_ROLES.map((role) => (
          <div
            key={role.title}
            className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3.5"
          >
            <div>
              <p className="text-sm font-semibold text-[#101B2B]">{role.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{role.type}</p>
            </div>
            <a
              href="mailto:careers@servicehub11.com"
              className="text-sm font-medium text-[#2E6E8E] hover:text-[#101B2B] transition-colors"
            >
              Apply →
            </a>
          </div>
        ))}
      </div>
      <h2>Don't see a fit?</h2>
      <p>
        We're always open to meeting good people. Write to us at{" "}
        <a href="mailto:careers@servicehub11.com" className="text-[#2E6E8E] font-medium">
          careers@servicehub11.com
        </a>
        .
      </p>
    </StaticPageLayout>
  );
}