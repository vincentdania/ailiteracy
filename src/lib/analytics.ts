export type AnalyticsEvent = { name: string; distinctId: string; properties?: Record<string, string | number | boolean> };

export async function captureServerEvent(event: AnalyticsEvent) {
  if (process.env.NEXT_PUBLIC_POSTHOG_ENABLED !== "true" || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  await fetch(`${process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com"}/capture/`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ api_key: process.env.NEXT_PUBLIC_POSTHOG_KEY, event: event.name, distinct_id: event.distinctId, properties: event.properties }),
  });
}
