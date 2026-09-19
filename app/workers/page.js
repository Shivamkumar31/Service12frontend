import WorkersClient from "./WorkersClient";
import SiteFooter from "../../components/SiteFooter";

export const metadata = {
  title: "Find Local Service Professionals Near You",

  description:
    "Find and book verified local service professionals near you. Discover plumbers, electricians, tutors, carpenters, cleaners and other trusted workers on Getworkfy.",

  keywords: [
    "local service professionals near me",
    "local workers",
    "verified local workers",
    "local service providers",
    "find workers near me",
    "hire local workers",
    "home services",
    "Getworkfy",
  ],

  alternates: {
    canonical: "https://www.getworkfy.in/workers",
  },

  openGraph: {
    title: "Find Local Service Professionals Near You | Getworkfy",

    description:
      "Discover and book trusted plumbers, electricians, tutors and other local service professionals near you.",

    url: "https://www.getworkfy.in/workers",

    siteName: "Getworkfy",

    locale: "en_IN",

    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function WorkersPage() {
  return <><WorkersClient /><SiteFooter /></>;
}
