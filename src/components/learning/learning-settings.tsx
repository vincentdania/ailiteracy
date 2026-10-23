"use client";

import { useActionState, useState } from "react";
import { UserRound } from "lucide-react";
import { setCertificateNameAction } from "@/app/actions/preferences";

export function LearningSettings({ name }: { name: string }) {
  const [state, action, pending] = useActionState(setCertificateNameAction, { ok: false, message: "" });
  const [value, setValue] = useState(name);
  return <div className="surface min-w-0 p-5 sm:p-6"><h2 className="font-display text-xl font-bold text-[#10294f]">Certificate name</h2><form action={action} className="mt-4"><label className="grid gap-2 text-sm font-bold text-[#10294f]"><span className="flex items-center gap-2"><UserRound size={16} className="text-[#10294f]" />Your full name, as it should appear on your certificates</span><span className="flex flex-col gap-2 sm:flex-row"><input name="name" value={value} onChange={(e) => setValue(e.target.value)} required minLength={2} maxLength={80} autoComplete="name" className="tap w-full min-w-0 flex-1 rounded-xl border border-[#cbd5e1] bg-white px-4 font-normal" /><button disabled={pending || value.trim() === name} className="tap rounded-xl bg-[#10294f] px-5 text-sm font-bold text-white disabled:opacity-40">{pending ? "Saving…" : "Save name"}</button></span></label>{state.message && <p role="status" className={`mt-2 text-sm ${state.ok ? "text-[#146c43]" : "text-[#b3261e]"}`}>{state.message}</p>}</form></div>;
}
