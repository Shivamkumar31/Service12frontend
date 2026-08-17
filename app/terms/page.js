import StaticPageLayout from "../../components/StaticPageLayout";

export const metadata = { title: "Terms of service — ServiceHub11" };

export default function TermsPage() {
  return (
    <StaticPageLayout eyebrow="Legal" title="Terms of service" subtitle="Last updated: 2026">
      <h2>1. Using ServiceHub11</h2>
      <p>
        By using ServiceHub11, you agree to book and provide services in good faith and in
        accordance with local laws.
      </p>
      <h2>2. Bookings</h2>
      <p>
        Bookings made through the platform are between the customer and the worker. ServiceHub11
        facilitates the connection but is not a party to the service agreement.
      </p>
      <h2>3. Worker verification</h2>
      <p>
        Verification reflects our review of submitted information and does not guarantee the
        quality of any specific job.
      </p>
      <h2>4. Changes</h2>
      <p>We may update these terms from time to time — continued use means you accept the changes.</p>
    </StaticPageLayout>
  );
}