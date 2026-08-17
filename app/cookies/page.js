import StaticPageLayout from "../../components/StaticPageLayout";

export const metadata = { title: "Cookie policy — ServiceHub11" };

export default function CookiesPage() {
  return (
    <StaticPageLayout eyebrow="Legal" title="Cookie policy" subtitle="Last updated: 2026">
      <h2>What cookies we use</h2>
      <p>We use essential cookies to keep you logged in and remember your session.</p>
      <h2>Your choices</h2>
      <p>You can clear cookies anytime from your browser settings — this will log you out.</p>
    </StaticPageLayout>
  );
}