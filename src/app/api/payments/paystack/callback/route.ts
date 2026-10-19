import { redirect } from "next/navigation";
import { recordPaystackCharge, verifyPaystackTransaction } from "@/lib/payments/paystack";

// Paystack sends the learner back here after checkout. Verifying the reference with Paystack
// enrolls them straight away, so access never depends on the webhook arriving first.
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const reference = params.get("reference") ?? params.get("trxref");
  if (!reference) redirect("/checkout?payment=failed");
  let recorded = false;
  try {
    const charge = await verifyPaystackTransaction(reference);
    recorded = charge ? await recordPaystackCharge(charge, { verify: charge }) : false;
  } catch (error) {
    console.error("Paystack verification failed", error instanceof Error ? error.message : error);
  }
  redirect(recorded ? "/dashboard?checkout=success" : "/checkout?payment=failed");
}
