"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingToggle() {
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");
  return <div className="mx-auto max-w-xl rounded-[2rem] bg-[#123c31] p-2 text-white card-shadow"><div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-6 sm:p-9"><div className="mb-7 flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-[#d9f99d]">One payment. Lifetime access.</p><div className="mt-1 text-5xl font-black tracking-tight">{currency === "NGN" ? "₦20,000" : "$39"}</div></div><div className="flex rounded-full bg-black/20 p-1" aria-label="Currency"><button onClick={() => setCurrency("NGN")} className={`rounded-full px-3 py-2 text-xs font-bold ${currency === "NGN" ? "bg-white text-[#123c31]" : "text-white/70"}`}>NGN</button><button onClick={() => setCurrency("USD")} className={`rounded-full px-3 py-2 text-xs font-bold ${currency === "USD" ? "bg-white text-[#123c31]" : "text-white/70"}`}>USD</button></div></div><ul className="mb-8 grid gap-3 text-sm text-white/82">{["Personalized learning plan", "21 applied lessons and saved evidence", "African and global case studies", "Outcome-focused capstone review", "Verified certificate with public record"].map((item) => <li key={item} className="flex items-center gap-3"><Check className="text-[#d9f99d]" size={18} />{item}</li>)}</ul><Button asChild size="lg" className="w-full bg-[#d9f99d] text-[#123c31] hover:bg-white"><Link href={`/signup?currency=${currency}`}>Start my personalized programme</Link></Button><p className="mt-4 text-center text-xs text-white/55">Secure checkout · Paystack for NGN · Stripe for USD</p></div></div>;
}
