import StaticPageLayout from "../../components/StaticPageLayout";

export const metadata = { title: "Press — ServiceHub11" };

export default function PressPage() {
  return (
    <StaticPageLayout
      eyebrow="Press"
      title="Press & media"
      subtitle="Resources for journalists and media partners."
    >
      <h2>Media inquiries</h2>
      <p>
        For interviews, quotes, or press materials, reach out to{" "}
        <a href="mailto:press@servicehub11.com" className="text-[#2E6E8E] font-medium">
          press@servicehub11.com
        </a>
        .
      </p>
      <h2>Brand assets</h2>
      <p>Logo files and brand guidelines are available on request.</p>
    </StaticPageLayout>
  );
}