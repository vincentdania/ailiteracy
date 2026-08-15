import { Currency, PaymentProvider } from "@prisma/client";
import { verifyPaystackSignature } from "@/lib/payments/signatures";
import { processSuccessfulPayment } from "@/lib/payments/process";

type PaystackEvent = { event: string; data: { reference: string; amount: number; currency: string; metadata?: { userId?: string; courseId?: string } } };

export async function POST(request: Request) {
  const payload = await request.text();
  if (!verifyPaystackSignature(payload, request.headers.get("x-paystack-signature"), process.env.PAYSTACK_SECRET_KEY ?? "")) return Response.json({ error: "Invalid signature" }, { status: 400 });
  let event: PaystackEvent;
  try { event = JSON.parse(payload) as PaystackEvent; }
  catch { return Response.json({ error: "Invalid payload" }, { status: 400 }); }
  const { userId, courseId } = event.data.metadata ?? {};
  if (event.event !== "charge.success" || event.data.currency !== "NGN" || !userId || !courseId) return Response.json({ received: true });
  await processSuccessfulPayment({ userId, courseId, provider: PaymentProvider.PAYSTACK, referenceId: event.data.reference, amount: event.data.amount / 100, currency: Currency.NGN, rawPayload: event });
  return Response.json({ received: true });
}
