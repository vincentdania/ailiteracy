"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReferralCard({ code, origin }: { code: string; origin: string }) {
  const [copied, setCopied] = useState(false);
  const link = `${origin}/join?ref=${code}`;
  return <div className="rounded-3xl bg-[#123c31] p-7 text-white card-shadow"><p className="eyebrow eyebrow-inverse">Your personal invite</p><p className="mt-4 break-all rounded-xl bg-black/20 p-4 font-mono text-sm">{link}</p><Button className="mt-4 bg-[#d9f99d] text-[#123c31] hover:bg-white" onClick={async () => { await navigator.clipboard.writeText(link); setCopied(true); }}>{copied ? <Check className="mr-2" size={17} /> : <Copy className="mr-2" size={17} />}{copied ? "Copied" : "Copy invite link"}</Button></div>;
}
