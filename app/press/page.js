import StaticPageLayout from "../../components/StaticPageLayout";

export const metadata = { title: "Press", description: "Getworkfy press information and enquiries.", alternates: { canonical: "/press" } };

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
        <a href="mailto:support@getworkfy.in" className="text-[#2E6E8E] font-medium">
          support@getworkfy.in
        </a>
        .
      </p>
      <h2>Brand assets</h2>
      <p>Logo files and brand guidelines are available on request.</p>
    </StaticPageLayout>
  );
}
