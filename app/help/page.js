import StaticPageLayout from "../../components/StaticPageLayout";

export const metadata = { title: "Help & support — ServiceHub11" };

const FAQS = [
  { q: "How do I cancel a booking?", a: "Go to My bookings from your dashboard and cancel from there." },
  { q: "How are workers verified?", a: "Every applicant is reviewed by an admin before they can accept bookings." },
  { q: "Is there a call-out fee?", a: "Pricing is set per worker and shown upfront on their profile — no hidden fees." },
  { q: "How do I become a worker?", a: "Sign up, then choose 'Become a worker' from your account menu." },
];

export default function HelpPage() {
  return (
    <StaticPageLayout
      eyebrow="Support"
      title="Help & support"
      subtitle="Answers to common questions — or reach us directly."
    >
      <div className="space-y-4 not-prose">
        {FAQS.map((faq) => (
          <div key={faq.q} className="border-b border-dashed border-slate-200 pb-4 last:border-0">
            <p className="font-semibold text-[#101B2B] text-sm">{faq.q}</p>
            <p className="text-sm text-slate-500 mt-1">{faq.a}</p>
          </div>
        ))}
      </div>
      <h2>Still need help?</h2>
      <p>
        Email{" "}
        <a href="mailto:support@servicehub11.com" className="text-[#2E6E8E] font-medium">
          support@servicehub11.com
        </a>{" "}
        and we'll get back within a day.
      </p>
    </StaticPageLayout>
  );
}