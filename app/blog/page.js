import StaticPageLayout from "../../components/StaticPageLayout";

export const metadata = { title: "Blog", description: "Guides, updates, and stories from Getworkfy.", alternates: { canonical: "/blog" } };

const POSTS = [
  { title: "5 questions to ask before hiring an electrician", tag: "Guides" },
  { title: "How worker verification actually works", tag: "Trust & Safety" },
  { title: "Behind the scenes: launching in a new city", tag: "Company" },
];

export default function BlogPage() {
  return (
    <StaticPageLayout
      eyebrow="Blog"
      title="Notes from Getworkfy"
      subtitle="Guides, updates, and stories from the team."
    >
      <div className="space-y-3 not-prose">
        {POSTS.map((post) => (
          <article
            key={post.title}
            className="rounded-xl border border-slate-200 px-4 py-4"
          >
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[#E8A33D]">
              {post.tag}
            </span>
            <p className="text-sm font-semibold text-[#101B2B] mt-1">{post.title}</p>
            <p className="text-xs text-slate-500 mt-2">Article coming soon</p>
          </article>
        ))}
      </div>
    </StaticPageLayout>
  );
}
