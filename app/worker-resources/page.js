import StaticPageLayout from "../../components/StaticPageLayout";

export const metadata = { title: "Worker resources — ServiceHub11" };

export default function WorkerResourcesPage() {
  return (
    <StaticPageLayout
      eyebrow="For workers"
      title="Worker resources"
      subtitle="Tips to get more bookings and great ratings on ServiceHub11."
    >
      <h2>Getting more bookings</h2>
      <ul>
        <li>Keep your availability toggled on when you're free to take jobs.</li>
        <li>Add a clear profile photo and a detailed description.</li>
        <li>Respond to booking requests quickly — response time affects visibility.</li>
      </ul>
      <h2>Getting verified</h2>
      <p>
        Submit your application from <strong>Become a worker</strong> with accurate category,
        experience, and address — most reviews are completed within a few days.
      </p>
    </StaticPageLayout>
  );
}