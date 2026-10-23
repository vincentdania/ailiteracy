import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import { formatAccessDate, type AccessStatus } from "@/lib/access";

/** Shown in place of lessons once a learner's paid access period has ended. */
export function AccessEndedNotice({ endedAt, timeZone, courseSlug }: { endedAt: Date; timeZone?: string; courseSlug?: string }) {
  return <section className="surface-dark p-6 sm:p-8" aria-labelledby="access-ended-title" data-testid="access-ended">
    <p className="eyebrow !text-[#f6e7d8]">Your access has ended</p>
    <h2 id="access-ended-title" className="display mt-3 text-3xl leading-tight sm:text-4xl">Thank you for learning with us.</h2>
    <p className="mt-3 max-w-2xl leading-7 text-white/80">Your track access ended on {formatAccessDate(endedAt, timeZone)}. Your progress and certificate links remain available.</p>
    <p className="mt-2 max-w-2xl leading-7 text-white/80">Renew to continue the lessons. A new payment gives you three calendar months of access from the purchase date.</p>
    <div className="mt-6 flex flex-wrap gap-3">
      <Link href={courseSlug ? `/checkout?course=${courseSlug}` : "/dashboard"} className="tap inline-flex items-center gap-2 rounded-full bg-[#c8742b] px-7 py-3 font-bold text-[#10294f]">Renew access <ArrowRight size={18} /></Link>
      <Link href="/certificates" className="tap inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white">View my certificates</Link>
    </div>
  </section>;
}

/** A small label with the learner's access end date. */
export function AccessChip({ access, timeZone }: { access: AccessStatus; timeZone?: string }) {
  if (access.kind === "expired") return null;
  return <span className="chip bg-white text-[#4d5768] ring-1 ring-[#dfe5ee]" data-testid="access-chip">
    <CalendarClock size={13} />Access until {formatAccessDate(access.endsAt, timeZone)}
  </span>;
}
