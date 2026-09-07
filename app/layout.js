import "./globals.css";
import { AuthProvider } from "../lib/auth-context";
import Navbar from "../components/Navbar";
import Script from "next/script";

export const metadata = {
  title: "Getworkfy - Book Verified Local Workers Near You",
  description:
    "Getworkfy helps you find and book verified local workers near you. Discover trusted professionals for your service needs.",
  keywords: [
    "local workers",
    "verified workers",
    "book local workers",
    "local services",
    "home services",
    "Getworkfy",
  ],
  metadataBase: new URL("https://www.getworkfy.in"),
  alternates: {
    canonical: "https://www.getworkfy.in",
  },
  openGraph: {
    title: "Getworkfy - Book Verified Local Workers Near You",
    description:
      "Find and book verified local workers near you with Getworkfy.",
    url: "https://www.getworkfy.in",
    siteName: "Getworkfy",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7WZ2RZGS6R');
          `}
        </Script>
      </body>
    </html>
  );
}