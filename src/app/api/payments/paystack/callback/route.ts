import { redirect } from "next/navigation";
// Paystack sends the learner here after checkout. Only the verified webhook
// grants access; a browser redirect is never proof of payment.
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const reference = params.get("reference") ?? params.get("trxref");
  if (!reference) redirect("/checkout?payment=failed");
  redirect("/dashboard?payment=pending");
}
