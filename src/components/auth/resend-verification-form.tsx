"use client";

import { useActionState } from "react";
import { resendVerificationAction, type AuthActionState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

const initialState: AuthActionState = { ok: false, message: "" };

/** Signed-in learners get the link at their account address, so they see no email field. */
export function ResendVerificationForm({ signedInEmail }: { signedInEmail?: string | null }) {
  const [state, action, pending] = useActionState(resendVerificationAction, initialState);
  return <form action={action} className="grid gap-4 text-left">{signedInEmail ? <p className="text-center text-sm text-[#4d5768]">We will send it to <strong className="text-[#0b1c30]">{signedInEmail}</strong>.</p> : <label className="grid gap-2 text-sm font-bold">Email address<input required type="email" name="email" autoComplete="email" className="focus-ring h-12 rounded-xl border border-[#cbd5e1] bg-white px-4 font-normal" placeholder="ada@example.com" /></label>}{state.message && <div role="status" className={`rounded-xl px-4 py-3 text-sm ${state.ok ? "bg-[#eaf2ff] text-[#214889]" : "bg-red-50 text-red-700"}`}>{state.message}</div>}<Button size="lg" disabled={pending}>{pending ? "Sending…" : "Send a new link"}</Button></form>;
}
