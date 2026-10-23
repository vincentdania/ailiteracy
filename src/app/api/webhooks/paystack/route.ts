import { verifyPaystackSignature } from "@/lib/payments/signatures";
import { recordPaystackCharge, verifyPaystackTransaction, type PaystackCharge } from "@/lib/payments/paystack";

type PaystackEvent = { event: string; data: PaystackCharge };

export async function POST(request: Request) {
  const payload = await request.text();
  if (!verifyPaystackSignature(payload, request.headers.get("x-paystack-signature"), process.env.PAYSTACK_SECRET_KEY ?? "")) return Response.json({ error: "Invalid signature" }, { status: 400 });
  let event: PaystackEvent;
  try { event = JSON.parse(payload) as PaystackEvent; }
  catch { return Response.json({ error: "Invalid payload" }, { status: 400 }); }
  if (event.event === "charge.success") {
    const reference = event.data?.reference;
    if (!reference) return Response.json({ error: "Missing reference" }, { status: 400 });
    try {
      const verified = await verifyPaystackTransaction(reference);
      if (!verified || verified.reference !== reference || verified.status !== "success") {
        return Response.json({ error: "Payment verification pending" }, { status: 503 });
      }
      if (!await recordPaystackCharge(verified, event)) return Response.json({ error: "Unknown payment" }, { status: 400 });
    } catch (error) {
      console.error("Paystack webhook processing failed", error instanceof Error ? error.message : error);
      return Response.json({ error: "Payment processing failed" }, { status: 503 });
    }
  }
  return Response.json({ received: true });
}
