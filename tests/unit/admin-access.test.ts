import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.fn();
const findUnique = vi.fn();
const update = vi.fn();
vi.mock("@/lib/auth", () => ({ auth: () => auth() }));
vi.mock("@/lib/db", () => ({ db: { user: { findUnique: (...args: unknown[]) => findUnique(...args) }, enrollment: { update: (...args: unknown[]) => update(...args) } } }));
vi.mock("@/lib/push", () => ({ sendPushToUser: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const { grantLifetimeAccessAction, removeLifetimeAccessAction } = await import("@/app/actions/admin");

function form(enrollmentId = "enr_1") {
  const data = new FormData();
  data.set("enrollmentId", enrollmentId);
  return data;
}

describe("lifetime access admin actions", () => {
  beforeEach(() => {
    auth.mockReset();
    findUnique.mockReset();
    update.mockReset();
  });

  it("refuses visitors who are not signed in", async () => {
    auth.mockResolvedValue(null);
    await expect(grantLifetimeAccessAction(form())).rejects.toThrow("Admin access required");
    expect(update).not.toHaveBeenCalled();
  });

  it("refuses learners", async () => {
    auth.mockResolvedValue({ user: { id: "u1", role: "USER" } });
    await expect(grantLifetimeAccessAction(form())).rejects.toThrow("Admin access required");
    await expect(removeLifetimeAccessAction(form())).rejects.toThrow("Admin access required");
    expect(update).not.toHaveBeenCalled();
  });

  it("refuses a stale admin session once the database says otherwise", async () => {
    auth.mockResolvedValue({ user: { id: "u1", role: "ADMIN" } });
    findUnique.mockResolvedValue({ id: "u1", role: "USER" });
    await expect(grantLifetimeAccessAction(form())).rejects.toThrow("Admin access required");
    expect(update).not.toHaveBeenCalled();
  });

  it("grants and removes lifetime access for admins, recording who granted it", async () => {
    auth.mockResolvedValue({ user: { id: "admin1", role: "ADMIN" } });
    findUnique.mockResolvedValue({ id: "admin1", role: "ADMIN" });
    await grantLifetimeAccessAction(form());
    expect(update).toHaveBeenLastCalledWith({ where: { id: "enr_1" }, data: { lifetimeAccess: true, lifetimeGrantedAt: expect.any(Date), lifetimeGrantedBy: "admin1" } });
    await removeLifetimeAccessAction(form());
    expect(update).toHaveBeenLastCalledWith({ where: { id: "enr_1" }, data: { lifetimeAccess: false, lifetimeGrantedAt: null, lifetimeGrantedBy: null } });
  });
});
