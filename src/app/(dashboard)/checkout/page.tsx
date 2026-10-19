import { ShieldCheck } from "lucide-react";
import { createCheckoutAction } from "@/app/actions/checkout";
import { activateFreeEnrollmentAction } from "@/app/actions/enrollment";
import { Button } from "@/components/ui/button";
import { paystackUsdEnabled } from "@/lib/payments/paystack";

const PAYMENT_NOTICES: Record<string, string> = {
  failed: "We could not confirm your payment. If money left your account, the course will open as soon as Paystack confirms it. If not, please try again.",
  unavailable: "That payment option is not available right now. Please try again in a few minutes.",
};

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ payment?: string }> }) {
  const notice = PAYMENT_NOTICES[(await searchParams).payment ?? ""];
  const freeEnrollment = process.env.FREE_ENROLLMENT_ENABLED === "true";
  const mockEnabled = process.env.INTEGRATION_MODE === "mock" && process.env.ALLOW_MOCK_CHECKOUT === "true";
  const options = [
    { currency: "NGN", price: "₦20,000", provider: "Paystack", copy: "Pay with a Nigerian card, bank transfer or USSD.", ready: mockEnabled || Boolean(process.env.PAYSTACK_SECRET_KEY) },
    { currency: "USD", price: "$29", provider: "Paystack", copy: "Pay with a Visa or Mastercard card issued outside Nigeria.", ready: mockEnabled || paystackUsdEnabled() },
  ].filter((option) => option.ready);
  return <div className="mx-auto max-w-3xl"><p className="eyebrow">Enrol</p><h1 className="display mt-3 text-6xl">Get full access to the course.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-[#4d5768]">Enrolment opens all 10 days: seven days on your own work, then Agents Week. It also includes the quizzes, the referral programme and a verified certificate when you finish.</p>{notice && <p role="alert" className="mt-6 rounded-xl bg-[#fff4e5] px-4 py-3 text-sm text-[#7a4b00]">{notice}</p>}{freeEnrollment ? <form action={activateFreeEnrollmentAction} className="mt-9 rounded-3xl bg-[#214889] p-8 text-white card-shadow"><p className="eyebrow eyebrow-inverse">Free while we test</p><h2 className="mt-4 font-display text-3xl font-semibold">Start learning for free.</h2><p className="mt-3 text-white/75">You don&apos;t need to enter any payment details.</p><Button size="lg" className="mt-7 w-full bg-[#bcd6ff] text-[#214889] hover:bg-white">Activate free access</Button></form> : options.length > 0 ? <div className={`mt-9 grid gap-5 ${options.length > 1 ? "sm:grid-cols-2" : "mx-auto max-w-sm"}`}>{options.map((option) => <form key={option.currency} action={createCheckoutAction} className="rounded-3xl bg-white p-7 card-shadow"><input type="hidden" name="currency" value={option.currency} /><p className="eyebrow">{option.provider}</p><strong className="mt-4 block text-5xl tracking-tight">{option.price}</strong><p className="my-6 min-h-12 text-sm leading-6 text-[#4d5768]">{option.copy}</p><Button size="lg" className="w-full">Pay in {option.currency}</Button></form>)}</div> : <div className="mt-9 rounded-3xl border border-[#dfe5ee] bg-white p-8 card-shadow"><span className="grid size-12 place-items-center rounded-2xl bg-[#eaf2ff] text-[#214889]"><ShieldCheck /></span><h2 className="mt-5 text-2xl font-black">Payments are not open yet.</h2><p className="mt-3 max-w-xl leading-7 text-[#4d5768]">Your learning plan is saved. Please check back soon to enrol.</p></div>}{mockEnabled && !freeEnrollment && <p className="mt-5 rounded-xl bg-[#eaf2ff] px-4 py-3 text-sm text-[#214889]">Test checkout is on. No payment provider will be contacted and no money will be taken.</p>}</div>;
}
