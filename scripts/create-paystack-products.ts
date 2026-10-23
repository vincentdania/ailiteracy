/** Create or locate the two fixed-price products in a Paystack TEST account only. */
import { TRACKS, TRACK_PRICE_NGN } from "../src/lib/tracks";

const key = process.env.PAYSTACK_SECRET_KEY;
if (!key?.startsWith("sk_test_")) throw new Error("Set a Paystack TEST secret key (sk_test_...). Live keys are blocked.");

async function paystack<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`https://api.paystack.co${path}`, { ...init, headers: { authorization: `Bearer ${key}`, "content-type": "application/json", ...init?.headers } });
  const body = await response.json() as { status: boolean; message?: string; data: T };
  if (!response.ok || !body.status) throw new Error(body.message ?? `Paystack returned ${response.status}`);
  return body.data;
}

type Product = { name: string; product_code: string; price: number; currency: string };
const existing: Product[] = [];
for (let page = 1; page <= 10; page++) {
  const batch = await paystack<Product[]>(`/product?perPage=100&page=${page}`);
  existing.push(...batch);
  if (batch.length < 100) break;
}
for (const track of TRACKS) {
  const name = `Hyrax AI Academy · ${track.audience}`;
  const price = TRACK_PRICE_NGN * 100;
  const matches = existing.filter((item) => item.name === name);
  if (matches.some((item) => item.price !== price || item.currency !== "NGN")) throw new Error(`A product named ${name} has a different price or currency. Review it in Paystack.`);
  const product = matches[0] ?? await paystack<Product>("/product", { method: "POST", body: JSON.stringify({ name, description: track.subline, price, currency: "NGN", unlimited: true }) });
  console.info(`${track.slug}: ${product.product_code} · ₦${TRACK_PRICE_NGN.toLocaleString("en-NG")}`);
}
