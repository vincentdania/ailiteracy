import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return <main className="container-shell grid min-h-screen place-items-center py-16"><div className="max-w-xl text-left"><span className="grid size-20 place-items-center rounded-full bg-[#f6e7d8]"><WifiOff size={34} /></span><p className="eyebrow mt-7">You are offline</p><h1 className="display mt-3 text-[clamp(2.125rem,3.4vw,3rem)] text-[#10294f]">Your saved progress is safe.</h1><p className="mt-5 text-lg leading-8 text-[#4d5768]">Reconnect to the internet to open lessons and mark them complete. You will pick up where you left off.</p><Button asChild className="mt-8"><Link href="/dashboard">Go to your dashboard</Link></Button></div></main>;
}
