import StaticPageLayout from "../../components/StaticPageLayout";

export const metadata = { title: "About us — ServiceHub11" };

export default function AboutPage() {
  return (
    <StaticPageLayout
      eyebrow="Our story"
      title="About ServiceHub11"
      subtitle="We connect people with verified local tradespeople — plumbers, electricians, tutors, and more."
    >
      <h2>Why we started</h2>
      <p>
        Finding a trustworthy plumber or electrician at short notice is harder than it should be.
        ServiceHub11 was built to fix that — a simple, honest way to find verified workers near
        you, see what they charge, and book them in minutes.
      </p>
      <h2>What we stand for</h2>
      <ul>
        <li>Every worker on the platform goes through a verification review before they can take bookings.</li>
        <li>Transparent pricing — no hidden call-out fees.</li>
        <li>Local first — we prioritize workers near you, not the ones who pay the most.</li>
      </ul>
      <h2>Where we're headed</h2>
      <p>
        We're growing city by city, category by category — always with the same goal: make it
        easy to get trusted help, fast.
      </p>
    </StaticPageLayout>
  );
}