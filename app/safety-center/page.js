import StaticPageLayout from "../../components/StaticPageLayout";

export const metadata = { title: "Safety center — ServiceHub11" };

export default function SafetyCenterPage() {
  return (
    <StaticPageLayout
      eyebrow="Trust & safety"
      title="Safety center"
      subtitle="What we do to keep bookings safe, and what you can do too."
    >
      <h2>Worker verification</h2>
      <p>
        Every worker goes through an admin review before they can accept bookings — we check
        their category, experience, and details before they go live.
      </p>
      <h2>While booking</h2>
      <ul>
        <li>Check the worker's rating and completed jobs before booking.</li>
        <li>Keep communication and payment details within what's needed for the job.</li>
        <li>Report any issue immediately through your booking's support option.</li>
      </ul>
      <h2>Report a concern</h2>
      <p>
        Email{" "}
        <a href="mailto:safety@servicehub11.com" className="text-[#2E6E8E] font-medium">
          safety@servicehub11.com
        </a>{" "}
        and we'll respond promptly.
      </p>
    </StaticPageLayout>
  );
}