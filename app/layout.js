import "./globals.css";

import { AuthProvider } from "../lib/auth-context";
import Navbar from "../components/Navbar";
import Script from "next/script";

const SITE_URL = "https://www.getworkfy.in";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Getworkfy - Book Verified Local Workers Near You",
    template: "%s | Getworkfy",
  },

  description:
    "Getworkfy helps you find and book verified local workers near you. Discover trusted plumbers, electricians, tutors, carpenters, cleaners and other local service professionals.",

  keywords: [
    "Getworkfy",
    "local workers",
    "verified workers",
    "local service providers",
    "book local workers",
    "find workers near me",
    "local services",
    "home services",
    "plumber near me",
    "electrician near me",
    "tutor near me",
    "carpenter near me",
    "cleaning services",
  ],

  applicationName: "Getworkfy",

  authors: [
    {
      name: "Getworkfy",
      url: SITE_URL,
    },
  ],

  creator: "Getworkfy",
  publisher: "Getworkfy",
  category: "Local Services",

  alternates: {
    canonical: SITE_URL,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Getworkfy",
    title: "Getworkfy - Book Verified Local Workers Near You",
    description:
      "Find and book trusted local workers near you. Discover verified plumbers, electricians, tutors, carpenters and more with Getworkfy.",

    images: [
      {
        url: "/getworkfy-logo.png",
        width: 1200,
        height: 600,
        alt: "Getworkfy - Local Services Near You",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Getworkfy - Book Verified Local Workers Near You",
    description:
      "Find and book trusted local workers near you with Getworkfy.",
    images: ["/getworkfy-logo.png"],
  },

  // YOUR LOCAL WEBSITE FAVICON
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Getworkfy",
  url: SITE_URL,
  logo: `${SITE_URL}/getworkfy-logo.png`,
  description:
    "Getworkfy helps people discover and book verified local workers and service providers.",
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Getworkfy",
  url: SITE_URL,
  description:
    "Find and book verified local workers and service providers near you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* Website structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>

      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7WZ2RZGS6R"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              window.dataLayer.push(arguments);
            }

            gtag('js', new Date());
            gtag('config', 'G-7WZ2RZGS6R');
          `}
        </Script>
      </body>
    </html>
  );
}