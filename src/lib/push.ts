import webpush from "web-push";
import { db } from "@/lib/db";

export async function sendPushToUser(userId: string, payload: { title: string; body: string; url?: string }) {
  if (process.env.INTEGRATION_MODE === "mock" || !process.env.VAPID_PRIVATE_KEY || !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
    console.info(`[push:mock] user=${userId} title=${payload.title}`);
    return { sent: 0, mocked: true };
  }
  webpush.setVapidDetails(process.env.VAPID_SUBJECT ?? "mailto:admin@ailiteracy.ng", process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
  const subscriptions = await db.pushSubscription.findMany({ where: { userId } });
  let sent = 0;
  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification({ endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } }, JSON.stringify(payload));
      sent += 1;
    } catch (error) {
      if (error instanceof webpush.WebPushError && error.statusCode === 410) await db.pushSubscription.delete({ where: { endpoint: subscription.endpoint } });
    }
  }
  return { sent, mocked: false };
}
