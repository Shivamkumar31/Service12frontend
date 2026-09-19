const SITE_URL = "https://www.getworkfy.in";

export const metadata = {
  title: "Contact us",
  description: "Contact Getworkfy for questions, feedback, partnerships, and support.",
  alternates: { canonical: `${SITE_URL}/contact-us` },
};

export default function ContactUsLayout({ children }) {
  return children;
}
