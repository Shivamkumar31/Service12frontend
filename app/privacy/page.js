import StaticPageLayout from "../../components/StaticPageLayout";

export const metadata = { title: "Privacy policy", description: "Getworkfy's privacy policy.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <StaticPageLayout eyebrow="Legal" title="Privacy policy" subtitle="Last updated: 2026">
      <h2>What we collect</h2>
      <p>Name, email, address, and location data needed to match you with nearby workers or customers.</p>
      <h2>How we use it</h2>
      <ul>
        <li>To show relevant workers based on your location.</li>
        <li>To process and manage bookings.</li>
        <li>To verify worker applications.</li>
      </ul>
      <h2>Your data</h2>
      <p>
        You can update or request deletion of your data anytime by contacting{" "}
        <a href="mailto:support@getworkfy.in" className="text-[#2E6E8E] font-medium">
          support@getworkfy.in
        </a>
        .
      </p>
    </StaticPageLayout>
  );
}
