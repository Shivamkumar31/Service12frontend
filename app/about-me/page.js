import { permanentRedirect } from "next/navigation";

export default function AboutMePage() {
  permanentRedirect("/about#founder");
}
