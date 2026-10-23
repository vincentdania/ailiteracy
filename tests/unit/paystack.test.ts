import { beforeEach, describe, expect, it, vi } from "vitest";
import { Currency, PaymentProvider, TransactionStatus } from "@prisma/client";

const state = vi.hoisted(() => ({
  userFind: vi.fn(), courseFind: vi.fn(), orderFind: vi.fn(), orderUpdate: vi.fn(), enrollmentFind: vi.fn(), enrollmentCreate: vi.fn(), enrollmentUpdate: vi.fn(), streakUpsert: vi.fn(), capture: vi.fn(),
}));
vi.mock("@/lib/db", () => ({ db: {
  user: { findUnique: state.userFind }, course: { findUnique: state.courseFind },
  transaction: { findUnique: state.orderFind },
  $transaction: async (fn: (tx: unknown) => Promise<unknown>) => fn({
    transaction: { findUnique: state.orderFind, updateMany: state.orderUpdate },
    enrollment: { findUnique: state.enrollmentFind, create: state.enrollmentCreate, update: state.enrollmentUpdate },
    streak: { upsert: state.streakUpsert },
  }),
} }));
vi.mock("@/lib/analytics", () => ({ captureServerEvent: state.capture }));
const { processSuccessfulPayment } = await import("@/lib/payments/process");

const payment = { userId: "user1", courseId: "course1", provider: PaymentProvider.PAYSTACK, referenceId: "ref1", amount: 20_000, currency: Currency.NGN, rawPayload: {}, purchasedAt: new Date("2026-10-22T12:00:00Z") };

describe("verified payment processing", () => {
  beforeEach(() => {
    for (const fn of Object.values(state)) fn.mockReset();
    state.userFind.mockResolvedValue({ id: "user1" });
    state.courseFind.mockResolvedValue({ slug: "small-business", isPublished: true, priceNgn: 20_000, priceUsd: 0 });
    state.orderFind.mockResolvedValue({ userId: "user1", courseId: "course1", provider: PaymentProvider.PAYSTACK, referenceId: "ref1", amount: 20_000, currency: Currency.NGN, status: TransactionStatus.PENDING });
    state.orderUpdate.mockResolvedValue({ count: 1 });
    state.enrollmentFind.mockResolvedValue(null);
    state.enrollmentCreate.mockResolvedValue({ id: "enrollment1" });
    state.streakUpsert.mockResolvedValue({});
  });

  it("grants only the purchased track and sets its calendar expiry", async () => {
    expect(await processSuccessfulPayment(payment)).toMatchObject({ created: true });
    expect(state.enrollmentCreate).toHaveBeenCalledWith({ data: { userId: "user1", courseId: "course1", purchasedAt: payment.purchasedAt, expiresAt: new Date("2027-01-22T12:00:00Z") } });
  });

  it("does not renew on duplicate or concurrent webhook delivery", async () => {
    await processSuccessfulPayment(payment);
    state.orderUpdate.mockResolvedValueOnce({ count: 0 });
    expect(await processSuccessfulPayment(payment)).toMatchObject({ created: false });
    expect(state.enrollmentCreate).toHaveBeenCalledOnce();
  });

  it("rejects mismatched amount and an unknown order", async () => {
    await expect(processSuccessfulPayment({ ...payment, amount: 100 })).rejects.toThrow(/amount/);
    state.orderFind.mockResolvedValue(null);
    await expect(processSuccessfulPayment(payment)).rejects.toThrow(/pending order/);
    expect(state.enrollmentCreate).not.toHaveBeenCalled();
  });
});
