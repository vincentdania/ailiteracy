export async function initializePaystack(input: { email: string; amountNgn: number; userId: string; courseId: string }) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("Paystack is not configured");
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" },
    body: JSON.stringify({ email: input.email, amount: input.amountNgn * 100, metadata: { userId: input.userId, courseId: input.courseId }, callback_url: `${process.env.NEXTAUTH_URL}/dashboard` }),
  });
  if (!response.ok) throw new Error("Unable to initialize Paystack checkout");
  return response.json() as Promise<{ data: { authorization_url: string; reference: string } }>;
}
