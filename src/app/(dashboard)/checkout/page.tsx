import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { createCheckoutAction } from "@/app/actions/checkout";
import { Button } from "@/components/ui/button";
import { accessStatus, formatAccessDate } from "@/lib/access";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTrack, TRACKS } from "@/lib/tracks";

const notices: Record<string, string> = {
  unavailable: "Checkout is temporarily unavailable. Please contact support if you need help.",
  failed: "Payment could not be confirmed. If you were charged, access will open when Paystack confirms it.",
};

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ course?: string; payment?: string }> }) {
  const session = await auth();
  if (!session?.user.id) redirect("/login?next=/checkout");
  const params = await searchParams;
  const track = getTrack(params.course ?? "");
  if (!track) return <div className="mx-auto max-w-4xl"><p className="eyebrow">Choose a track</p><h1 className="display mt-3 text-4xl text-[#10294f]">What would you like to build?</h1><div className="mt-8 grid gap-5 md:grid-cols-2">{TRACKS.map((item) => <article key={item.slug} className="surface p-6"><p className="eyebrow">{item.audience}</p><h2 className="mt-3 font-display text-2xl font-bold">{item.title}</h2><p className="mt-3 text-[#4d5768]">₦20,000 · 3 months access</p><Button asChild className="mt-5"><Link href={`/checkout?course=${item.slug}`}>Choose this track</Link></Button></article>)}</div></div>;

  const [course, previous] = await Promise.all([
    db.course.findUnique({ where: { slug: track.slug } }),
    db.enrollment.findFirst({ where: { userId: session.user.id, course: { slug: track.slug } } }),
  ]);
  const access = previous ? accessStatus(previous) : null;
  const ready = Boolean(course?.isPublished && course.paystackProductCode && process.env.PAYSTACK_SECRET_KEY && process.env.INTEGRATION_MODE !== "mock");
  return <div className="mx-auto max-w-3xl">
    <Link href={`/tracks/${track.slug}`} className="text-sm font-semibold text-[#214889] underline">Back to track details</Link>
    <p className="eyebrow mt-8">{track.audience}</p>
    <h1 className="display mt-3 text-4xl text-[#10294f] sm:text-5xl">{track.title}</h1>
    <p className="mt-4 text-lg leading-8 text-[#4d5768]">{track.subline}</p>
    {params.payment && notices[params.payment] && <p role="alert" className="mt-6 rounded-xl bg-[#fff4e5] px-4 py-3 text-sm text-[#7a4b00]">{notices[params.payment]}</p>}
    {access?.active ? <div className="surface mt-8 p-6"><h2 className="font-display text-2xl font-bold">You have access to this track.</h2><p className="mt-2 text-[#4d5768]">Your lessons are open until {formatAccessDate(access.endsAt)}.</p><Button asChild className="mt-5"><Link href={`/challenge?course=${track.slug}`}>Go to lessons</Link></Button></div>
      : <div className="surface mt-8 p-6 sm:p-8"><div className="flex items-center gap-3"><ShieldCheck className="text-[#214889]" /><p className="font-semibold">Secure checkout with Paystack</p></div><strong className="mt-5 block font-display text-4xl text-[#10294f]">₦20,000</strong><p className="mt-2 text-sm text-[#4d5768]">One track · 3 months access from purchase · Tool and message costs are paid separately to providers.</p>{previous && <p className="mt-4 text-sm text-[#4d5768]">Your earlier access ended on {formatAccessDate(access!.endsAt)}. Renewing keeps your progress and certificates.</p>}{ready ? <form action={createCheckoutAction} className="mt-6"><input type="hidden" name="course" value={track.slug} /><Button size="lg" className="w-full">Pay ₦20,000 and enrol</Button></form> : <p className="mt-6 rounded-xl bg-[#eaf2ff] p-4 text-sm text-[#214889]">Checkout is being prepared. Contact <a className="font-bold underline" href={`mailto:${process.env.SUPPORT_EMAIL ?? "team@hyrax.ng"}`}>support</a> for an update.</p>}</div>}
  </div>;
}
