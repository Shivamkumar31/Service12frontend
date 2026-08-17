import StaticPageLayout from "../../components/StaticPageLayout";

export const metadata = { title: "Blog — ServiceHub11" };

const POSTS = [
  { title: "5 questions to ask before hiring an electrician", tag: "Guides" },
  { title: "How worker verification actually works", tag: "Trust & Safety" },
  { title: "Behind the scenes: launching in a new city", tag: "Company" },
];

export default function BlogPage() {
  return (
    <StaticPageLayout
      eyebrow="Blog"
      title="Notes from ServiceHub11"
      subtitle="Guides, updates, and stories from the team."
    >
      <div className="space-y-3 not-prose">
        {POSTS.map((post) => (
          <div
            key={post.title}
            className="rounded-xl border border-slate-200 px-4 py-4 hover:border-[#E8A33D] transition-colors"
          >
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[#E8A33D]">
              {post.tag}
            </span>
            <p className="text-sm font-semibold text-[#101B2B] mt-1">{post.title}</p>
          </div>
        ))}
      </div>
    </StaticPageLayout>
  );
}