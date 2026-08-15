import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return <main className="container-shell grid min-h-screen place-items-center py-16"><div className="max-w-xl text-center"><span className="mx-auto grid size-20 place-items-center rounded-full bg-[#e7f6d4]"><WifiOff size={34} /></span><p className="eyebrow mt-7">You are offline</p><h1 className="display mt-3 text-6xl text-[#00261d]">Your progress is safely waiting.</h1><p className="mt-5 text-lg leading-8 text-[#414845]">Reconnect to open protected lessons, save completion, or refresh your streak. The app will pick up where you left off.</p><Button asChild className="mt-8"><Link href="/dashboard">Try your dashboard</Link></Button></div></main>;
}
