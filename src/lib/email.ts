import { Resend } from "resend";

type EmailMessage = { to: string; subject: string; text: string };

export async function sendEmail(message: EmailMessage) {
  if (process.env.INTEGRATION_MODE === "mock" || !process.env.RESEND_API_KEY) {
    console.info(`[email:mock] to=${message.to} subject=${message.subject}`);
    return { id: `mock-${Date.now()}` };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "AI Literacy <noreply@ailiteracy.ng>",
    ...message,
  });
  if (result.error) throw new Error(result.error.message);
  return result.data;
}
