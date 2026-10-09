const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const SITE_URL = "https://www.getworkfy.in";

async function getWorker(id) {
  try {
    const response = await fetch(`${API_URL}/workers/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.workerProfile || data.worker || data.data?.workerProfile || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const worker = await getWorker(params.id);

  if (!worker) {
    return {
      title: "Worker Profile Not Found | Getworkfy",
      robots: { index: false, follow: false },
    };
  }

  const account = worker.userId || {};
  const name = account.name || worker.name || "Service Professional";
  const service = worker.serviceCategory?.name || worker.category?.name || "Local Service";
  const url = `${SITE_URL}/workers/${params.id}`;
  const title = `${name} – ${service} | Getworkfy`;
  const description = `View ${name}'s profile on Getworkfy and explore their ${service.toLowerCase()} services.`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Getworkfy",
      type: "profile",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default function WorkerProfileLayout({ children }) {
  return children;
}
