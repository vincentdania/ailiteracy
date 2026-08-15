import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function referralCode(seed?: string) {
  const prefix = seed?.replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase() || "AI";
  const values = crypto.getRandomValues(new Uint8Array(4));
  return `${prefix}${Array.from(values, (value) => value.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

export function formatMoney(amount: number, currency: "NGN" | "USD") {
  return new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "NGN" ? 0 : 2,
  }).format(amount);
}
