export const metadata = { title: "About me — ServiceHub11" };

const EXPERTISE = [
  "Full-Stack Development (MERN)",
  "Next.js & TypeScript",
  "AI / ML Model Integration",
  "LangChain & FAISS",
  "FastAPI",
  "Product & UI/UX",
];

const CONTACT = {
  linkedin: "https://www.linkedin.com/in/shivam-kumar-95a70324b/", // 👉 replace
  instagram: "https://www.instagram.com/shivamkumaryadav328/",  // 👉 replace
  github: "https://github.com/Shivamkumar31",
};

export default function AboutMePage() {
  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-blueprint">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#E8A33D]/15 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-16 grid md:grid-cols-[220px_1fr] gap-10 items-center">
          {/* photo slot */}
          <div className="mx-auto md:mx-0">
            <div className="w-44 h-44 rounded-3xl ticket-border bg-white overflow-hidden shadow-sm flex items-center justify-center">
             
                
                <img src="/founder.png" alt="Shivam — Founder & CEO"
                     className="w-full h-full object-cover" />
              
              <span className="text-4xl">🧑‍💻</span>
            </div>
          </div>

          {/* intro */}
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#101B2B] bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D]" />
              Founder & CEO
            </span>

            <h1 className="font-display mt-4 text-3xl sm:text-4xl tracking-tight text-[#101B2B]">
              Hi, I'm Shivam
            </h1>

            <p className="mt-3 text-slate-600 text-lg leading-relaxed max-w-xl">
              Final-year B.Tech Computer Science student at IIIT Kottayam, and founder of
              ServiceHub11 — a platform to connect people with verified local workers.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium bg-white border border-slate-200 px-4 py-2 rounded-full hover:border-[#2E6E8E] hover:text-[#2E6E8E] transition-colors"
              >
                🔗 LinkedIn
              </a>
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium bg-white border border-slate-200 px-4 py-2 rounded-full hover:border-[#C1502E] hover:text-[#C1502E] transition-colors"
              >
                📸 Instagram
              </a>
              <a
                href={CONTACT.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium bg-white border border-slate-200 px-4 py-2 rounded-full hover:border-[#101B2B] hover:text-[#101B2B] transition-colors"
              >
                💻 GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- ABOUT + EXPERTISE ---------------- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-2xl bg-white ticket-border shadow-sm p-7 sm:p-8">
          <h2 className="font-display text-xl text-[#101B2B] mb-3">About me</h2>
          <p className="text-slate-600 leading-relaxed">
            I'm a final-year Computer Science student at IIIT Kottayam, working across full-stack
            web development and applied AI/ML. I build with the MERN stack, Next.js, and
            TypeScript on the frontend and backend, and integrate AI/ML models — from LangChain
            and FAISS-based retrieval systems to computer vision and applied machine learning —
            into real, usable products.
          </p>
          <p className="text-slate-600 leading-relaxed mt-3">
            As founder and CEO of ServiceHub11, I'm building the product end-to-end — backend
            architecture, frontend design, and the AI-assisted features layered on top — with the
            goal of making it simple and reliable to find trustworthy local help.
          </p>
        </div>

        <div className="rounded-2xl bg-white ticket-border shadow-sm p-7">
          <h2 className="font-display text-lg text-[#101B2B] mb-4">Expertise</h2>
          <ul className="space-y-2.5">
            {EXPERTISE.map((skill) => (
              <li key={skill} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D] mt-1.5 shrink-0" />
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}