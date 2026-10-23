import { redirect } from "next/navigation";
import { broadcastPushAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { accessStatus, formatAccessDate } from "@/lib/access";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TRACKS } from "@/lib/tracks";

export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const session = await auth();
  if (!session?.user.id || session.user.role !== "ADMIN") redirect("/dashboard");
  const currentAdmin = await db.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (currentAdmin?.role !== "ADMIN") redirect("/dashboard");
  const [courses, enrollments, transactions] = await Promise.all([
    db.course.findMany({ where: { slug: { in: TRACKS.map((track) => track.slug) } }, select: { slug: true, title: true, priceNgn: true, paystackProductCode: true, _count: { select: { modules: true } } } }),
    db.enrollment.findMany({ where: { course: { slug: { in: TRACKS.map((track) => track.slug) } } }, include: { user: { select: { name: true, email: true } }, course: { select: { title: true } } }, orderBy: { purchasedAt: "desc" }, take: 100 }),
    db.transaction.findMany({ where: { status: "SUCCESS", currency: "NGN", course: { slug: { in: TRACKS.map((track) => track.slug) } } }, select: { amount: true } }),
  ]);
  const revenue = transactions.reduce((sum, item) => sum + Number(item.amount), 0);
  return <div className="mx-auto max-w-6xl"><p className="eyebrow">Admin</p><h1 className="display mt-3 text-5xl text-[#10294f]">Track overview</h1><div className="mt-8 grid gap-4 sm:grid-cols-3"><div className="surface p-6"><p>Paid enrollments</p><strong className="mt-2 block text-3xl">{enrollments.length}</strong></div><div className="surface p-6"><p>Active access</p><strong className="mt-2 block text-3xl">{enrollments.filter((item) => accessStatus(item).active).length}</strong></div><div className="surface p-6"><p>NGN revenue</p><strong className="mt-2 block text-3xl">₦{revenue.toLocaleString()}</strong></div></div>
    <section className="mt-6 grid gap-4 lg:grid-cols-2">{courses.map((course) => <article key={course.slug} className="surface p-6"><h2 className="font-display text-xl font-bold">{course.title}</h2><p className="mt-3 text-sm text-[#4d5768]">₦{Number(course.priceNgn).toLocaleString()} · {course._count.modules} modules · Paystack product {course.paystackProductCode ?? "not configured"}</p></article>)}</section>
    <section className="surface mt-6 p-6"><h2 className="font-display text-xl font-bold">Push broadcast</h2><form action={broadcastPushAction} className="mt-4 grid gap-3"><input className="rounded-xl border p-3" name="title" defaultValue="Your next lesson is ready" aria-label="Title" /><textarea className="min-h-24 rounded-xl border p-3" name="body" defaultValue="Open your dashboard to continue your track." aria-label="Message" /><Button>Send to subscribers</Button></form></section>
    <section className="surface mt-6 overflow-hidden"><h2 className="border-b p-6 font-display text-xl font-bold">Learners</h2><ul className="divide-y">{enrollments.map((item) => <li className="flex flex-wrap justify-between gap-2 p-5 text-sm" key={item.id}><div><strong>{item.user.name ?? item.user.email}</strong><p className="text-[#4d5768]">{item.user.email} · {item.course.title}</p></div><p>{accessStatus(item).active ? "Active" : "Expired"} · purchased {formatAccessDate(item.purchasedAt)} · ends {item.expiresAt ? formatAccessDate(item.expiresAt) : "unknown"}</p></li>)}</ul></section>
  </div>;
}
