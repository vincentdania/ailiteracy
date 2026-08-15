import { ShieldCheck } from "lucide-react";
import { createCheckoutAction } from "@/app/actions/checkout";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const mockEnabled = process.env.INTEGRATION_MODE === "mock" && process.env.ALLOW_MOCK_CHECKOUT === "true";
  const options = [
    { currency: "NGN", price: "₦20,000", provider: "Paystack", copy: "Best for Nigerian cards and bank payments.", ready: mockEnabled || Boolean(process.env.PAYSTACK_SECRET_KEY) },
    { currency: "USD", price: "$39", provider: "Stripe", copy: "Best for international cards.", ready: mockEnabled || Boolean(process.env.STRIPE_SECRET_KEY) },
  ].filter((option) => option.ready);
  return <div className="mx-auto max-w-3xl"><p className="eyebrow">Activate your programme</p><h1 className="display mt-3 text-6xl">Your learning plan is ready.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-[#5f6f67]">Enrollment unlocks all 21 applied lessons, project evidence, capstone review, referrals and your verified certificate.</p>{options.length > 0 ? <div className={`mt-9 grid gap-5 ${options.length > 1 ? "sm:grid-cols-2" : "mx-auto max-w-sm"}`}>{options.map((option) => <form key={option.currency} action={createCheckoutAction} className="rounded-3xl bg-white p-7 card-shadow"><input type="hidden" name="currency" value={option.currency} /><p className="eyebrow">{option.provider}</p><strong className="mt-4 block text-5xl tracking-tight">{option.price}</strong><p className="my-6 min-h-12 text-sm leading-6 text-[#5f6f67]">{option.copy}</p><Button size="lg" className="w-full">Pay in {option.currency}</Button></form>)}</div> : <div className="mt-9 rounded-3xl border border-[#dce2dd] bg-white p-8 card-shadow"><span className="grid size-12 place-items-center rounded-2xl bg-[#e6efdf] text-[#123c31]"><ShieldCheck /></span><h2 className="mt-5 text-2xl font-black">Secure enrollment is being connected.</h2><p className="mt-3 max-w-xl leading-7 text-[#5f6f67]">Your personalized plan is saved. We have disabled test checkout on this public server so nobody can receive unpaid access. Return here once live payment credentials are configured.</p></div>}{mockEnabled && <p className="mt-5 rounded-xl bg-[#e7f6d4] px-4 py-3 text-sm text-[#123c31]">Explicit test checkout mode is active. No payment provider will be contacted.</p>}</div>;
}
