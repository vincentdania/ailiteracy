import { permanentRedirect } from "next/navigation";

// The Hermes Agent Masterclass is retired; old links land on the home page.
export default function HermesCourseLanding() {
  permanentRedirect("/");
}
