"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction, type AuthActionState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

const initialState: AuthActionState = { ok: false, message: "" };

export function SignupForm({ referral }: { referral?: string }) {
  const [state, action, pending] = useActionState(signupAction, initialState);
  return <form action={action} className="grid gap-4"><input type="hidden" name="referral" value={referral ?? ""} /><label className="grid gap-2 text-sm font-bold">Full name<input required name="name" autoComplete="name" className="focus-ring h-12 rounded-xl border border-[#cad4ce] bg-white px-4 font-normal" placeholder="Ada Okafor" /></label><label className="grid gap-2 text-sm font-bold">Email address<input required type="email" name="email" autoComplete="email" className="focus-ring h-12 rounded-xl border border-[#cad4ce] bg-white px-4 font-normal" placeholder="ada@example.com" /></label><label className="grid gap-2 text-sm font-bold">Password<input required type="password" name="password" minLength={8} autoComplete="new-password" className="focus-ring h-12 rounded-xl border border-[#cad4ce] bg-white px-4 font-normal" placeholder="At least 8 characters" /></label>{state.message && <div className={`rounded-xl px-4 py-3 text-sm ${state.ok ? "bg-[#e7f6d4] text-[#123c31]" : "bg-red-50 text-red-700"}`}>{state.message}{state.verificationPath && <Link className="ml-2 font-bold underline" href={state.verificationPath}>Verify now</Link>}</div>}<Button size="lg" disabled={pending}>{pending ? "Creating account…" : "Create my account"}</Button><p className="text-center text-sm text-[#5f6f67]">Already have an account? <Link className="font-bold text-[#123c31]" href="/login">Sign in</Link></p></form>;
}
