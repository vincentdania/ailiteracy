import { verifyPaystackSignature } from "@/lib/payments/signatures";
import { recordPaystackCharge, type PaystackCharge } from "@/lib/payments/paystack";

type PaystackEvent = { event: string; data: PaystackCharge };

export async function POST(request: Request) {
  const payload = await request.text();
  if (!verifyPaystackSignature(payload, request.headers.get("x-paystack-signature"), process.env.PAYSTACK_SECRET_KEY ?? "")) return Response.json({ error: "Invalid signature" }, { status: 400 });
  let event: PaystackEvent;
  try { event = JSON.parse(payload) as PaystackEvent; }
  catch { return Response.json({ error: "Invalid payload" }, { status: 400 }); }
  if (event.event === "charge.success") await recordPaystackCharge(event.data, event);
  return Response.json({ received: true });
}
