import { ShieldCheck } from "lucide-react";
import { createCheckoutAction } from "@/app/actions/checkout";
import { activateFreeEnrollmentAction } from "@/app/actions/enrollment";
import { Button } from "@/components/ui/button";
import { paystackUsdEnabled } from "@/lib/payments/paystack";

const PAYMENT_NOTICES: Record<string, string> = {
  failed: "We could not confirm that payment. If you were charged, your course unlocks as soon as Paystack confirms it; otherwise please try again.",
  unavailable: "That payment option is not available right now. Please try again shortly or choose another currency.",
};

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ payment?: string }> }) {
  const notice = PAYMENT_NOTICES[(await searchParams).payment ?? ""];
  const freeEnrollment = process.env.FREE_ENROLLMENT_ENABLED === "true";
  const mockEnabled = process.env.INTEGRATION_MODE === "mock" && process.env.ALLOW_MOCK_CHECKOUT === "true";
  const options = [
    { currency: "NGN", price: "₦20,000", provider: "Paystack", copy: "Nigerian cards, bank transfer and USSD.", ready: mockEnabled || Boolean(process.env.PAYSTACK_SECRET_KEY) },
    { currency: "USD", price: "$29", provider: "Paystack", copy: "Visa and Mastercard cards issued outside Nigeria.", ready: mockEnabled || paystackUsdEnabled() },
  ].filter((option) => option.ready);
  return <div className="mx-auto max-w-3xl"><p className="eyebrow">Activate your course</p><h1 className="display mt-3 text-6xl">Your AI assistant is ready to learn your work.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-[#4d5768]">Enrollment unlocks all 10 days — seven to results, then the Agents Week — plus quizzes, referrals and your verified certificate.</p>{notice && <p role="alert" className="mt-6 rounded-xl bg-[#fff4e5] px-4 py-3 text-sm text-[#7a4b00]">{notice}</p>}{freeEnrollment ? <form action={activateFreeEnrollmentAction} className="mt-9 rounded-3xl bg-[#214889] p-8 text-white card-shadow"><p className="eyebrow eyebrow-inverse">Testing period</p><h2 className="mt-4 font-display text-3xl font-semibold">Start learning free.</h2><p className="mt-3 text-white/75">No payment details required.</p><Button size="lg" className="mt-7 w-full bg-[#bcd6ff] text-[#214889] hover:bg-white">Activate free access</Button></form> : options.length > 0 ? <div className={`mt-9 grid gap-5 ${options.length > 1 ? "sm:grid-cols-2" : "mx-auto max-w-sm"}`}>{options.map((option) => <form key={option.currency} action={createCheckoutAction} className="rounded-3xl bg-white p-7 card-shadow"><input type="hidden" name="currency" value={option.currency} /><p className="eyebrow">{option.provider}</p><strong className="mt-4 block text-5xl tracking-tight">{option.price}</strong><p className="my-6 min-h-12 text-sm leading-6 text-[#4d5768]">{option.copy}</p><Button size="lg" className="w-full">Pay in {option.currency}</Button></form>)}</div> : <div className="mt-9 rounded-3xl border border-[#dfe5ee] bg-white p-8 card-shadow"><span className="grid size-12 place-items-center rounded-2xl bg-[#eaf2ff] text-[#214889]"><ShieldCheck /></span><h2 className="mt-5 text-2xl font-black">Secure enrollment is being connected.</h2><p className="mt-3 max-w-xl leading-7 text-[#4d5768]">Your personalised plan is saved. Return here when enrollment opens.</p></div>}{mockEnabled && !freeEnrollment && <p className="mt-5 rounded-xl bg-[#eaf2ff] px-4 py-3 text-sm text-[#214889]">Explicit test checkout mode is active. No payment provider will be contacted.</p>}</div>;
}
