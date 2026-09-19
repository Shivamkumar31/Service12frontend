import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "../../../components/SiteFooter";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const SITE_URL = "https://www.getworkfy.in";

function slugify(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data.categories || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return null;
  }
}

async function getCategory(slug) {
  const categories = await getCategories();

  if (!categories) {
    return null;
  }

  return (
    categories.find((category) => slugify(category.name) === slug) || null
  );
}

/* ---------------- SEO METADATA ---------------- */

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const category = await getCategory(slug);

  if (!category) {
    return {
      title: "Service Not Found | Getworkfy",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const name = category.name;

  return {
    title: `${name} Services Near You`,

    description: `Find trusted and verified ${name.toLowerCase()} service providers near you. Compare professionals and book local ${name.toLowerCase()} services with Getworkfy.`,

    keywords: [
      `${name} near me`,
      `${name} services near me`,
      `hire ${name}`,
      `book ${name}`,
      `local ${name}`,
      `verified ${name} workers`,
      `${name} service providers`,
    ],

    alternates: {
      canonical: `${SITE_URL}/services/${slug}`,
    },

    openGraph: {
      title: `${name} Services Near You | Getworkfy`,
      description: `Find trusted ${name.toLowerCase()} service providers near you with Getworkfy.`,
      url: `${SITE_URL}/services/${slug}`,
      siteName: "Getworkfy",
      type: "website",
      locale: "en_IN",
    },

    twitter: {
      card: "summary_large_image",
      title: `${name} Services Near You | Getworkfy`,
      description: `Find trusted ${name.toLowerCase()} service providers near you.`,
    },
  };
}

/* ---------------- PAGE ---------------- */

export default async function ServicePage({ params }) {
  const { slug } = await params;

  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const name = category.name;

  /* ---------------- SERVICE SCHEMA ---------------- */

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: `${name} Services`,

    description: `Find trusted ${name.toLowerCase()} service providers near you with Getworkfy.`,

    url: `${SITE_URL}/services/${slug}`,

    provider: {
      "@type": "Organization",
      name: "Getworkfy",
      url: SITE_URL,
    },

    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Find workers",
        item: `${SITE_URL}/workers`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name,
        item: `${SITE_URL}/services/${slug}`,
      },
    ],
  };

  const faqItems = [
    {
      question: `What ${name.toLowerCase()} services can I find on Getworkfy?`,
      answer: `Getworkfy helps you explore local ${name.toLowerCase()} professionals for your service needs. Available profiles and service details depend on the professionals currently listed on the platform.`,
    },
    {
      question: `How do I find a ${name.toLowerCase()} professional near me?`,
      answer: `Open the worker search from this page, choose the relevant service category and use the available search options to explore professionals near you.`,
    },
    {
      question: `Can I compare ${name.toLowerCase()} professionals before booking?`,
      answer: `Yes. Review the information shown on available professional profiles and choose a provider whose service details and availability match your requirements.`,
    },
    {
      question: `Do I need an account to browse ${name.toLowerCase()} professionals?`,
      answer: `You can browse available service categories and professional profiles before deciding whether to continue with a booking.`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <main className="min-h-screen bg-[#F7F5F0]">
        {/* HERO */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-slate-500 mb-8"
          >
            <Link href="/" className="hover:underline">
              Home
            </Link>

            <span className="mx-2">/</span>

            <Link href="/workers" className="hover:underline">Find workers</Link>

            <span className="mx-2">/</span>

            <span>{name}</span>
          </nav>

          {/* Main heading */}
          <header>
            <h1 className="font-display text-4xl sm:text-5xl text-[#101B2B]">
              {name} Services Near You
            </h1>

            <p className="mt-5 text-lg text-slate-600 max-w-2xl leading-8">
              Find trusted and verified {name.toLowerCase()} service
              providers near you. Compare local professionals, check
              availability and book the right worker for your needs.
            </p>

            <div className="mt-8">
              <Link
                href={`/workers?category=${category._id}`}
                className="inline-flex items-center gap-2 bg-[#101B2B] text-white px-6 py-3.5 rounded-full font-medium hover:bg-[#1c2f47] transition"
              >
                Find {name} Workers
                <span aria-hidden>→</span>
              </Link>
            </div>
          </header>
        </section>

        {/* INFORMATION */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
          <div className="grid md:grid-cols-3 gap-6">
            <article className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#101B2B]">
                Verified Professionals
              </h2>

              <p className="mt-3 text-slate-600 leading-7">
                Discover local {name.toLowerCase()} professionals available
                through Getworkfy.
              </p>
            </article>

            <article className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#101B2B]">
                Compare Workers
              </h2>

              <p className="mt-3 text-slate-600 leading-7">
                Compare workers based on their profiles, ratings, location
                and availability.
              </p>
            </article>

            <article className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#101B2B]">
                Book Easily
              </h2>

              <p className="mt-3 text-slate-600 leading-7">
                Find a professional that matches your requirements and
                request a booking.
              </p>
            </article>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
          <div className="grid md:grid-cols-2 gap-6">
            <article className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#101B2B]">
                What you can find
              </h2>
              <p className="mt-3 text-slate-600 leading-7">
                Getworkfy helps you explore local {name.toLowerCase()} professionals for your
                everyday service needs. Review available profiles, compare relevant details and
                request a booking through the platform when available.
              </p>
            </article>
            <article className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#101B2B]">
                How to choose a {name.toLowerCase()} professional
              </h2>
              <p className="mt-3 text-slate-600 leading-7">
                Start by describing the help you need, then compare available professional
                profiles and the information shown on Getworkfy. Choose a professional whose
                experience, availability and service details match your requirements.
              </p>
            </article>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
          <h2 className="font-display text-3xl text-[#101B2B]">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {faqItems.map((item) => (
              <article key={item.question} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#101B2B]">{item.question}</h3>
                <p className="mt-2 text-slate-600 leading-7">{item.answer}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link href="/workers" className="text-[#2E6E8E] hover:underline">Browse workers</Link>
            <Link href="/how-it-works" className="text-[#2E6E8E] hover:underline">How it works</Link>
            <Link href="/safety-center" className="text-[#2E6E8E] hover:underline">Safety center</Link>
            <Link href="/verification-process" className="text-[#2E6E8E] hover:underline">Verification process</Link>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
          <div className="rounded-3xl bg-[#101B2B] text-white p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-semibold">
              Looking for a {name}?
            </h2>

            <p className="mt-3 text-slate-300">
              Browse available {name.toLowerCase()} workers near you.
            </p>

            <Link
              href={`/workers?category=${category._id}`}
              className="inline-flex mt-6 bg-[#E8A33D] text-[#101B2B] px-6 py-3 rounded-full font-semibold"
            >
              Browse {name} Workers
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
