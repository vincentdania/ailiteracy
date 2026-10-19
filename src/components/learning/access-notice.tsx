import Link from "next/link";
import { ArrowRight, CalendarClock, Infinity as InfinityIcon } from "lucide-react";
import { accessDays, formatAccessDate, type AccessStatus } from "@/lib/access";

/** Shown in place of lessons once a learner's paid access period has ended. */
export function AccessEndedNotice({ endedAt, timeZone }: { endedAt: Date; timeZone?: string }) {
  const days = accessDays();
  return <section className="surface-dark p-6 sm:p-8" aria-labelledby="access-ended-title" data-testid="access-ended">
    <p className="eyebrow !text-[#ffd36b]">Your access has ended</p>
    <h2 id="access-ended-title" className="display mt-3 text-3xl leading-tight sm:text-4xl">Thank you for learning with us.</h2>
    <p className="mt-3 max-w-2xl leading-7 text-white/80">Your {days} days of course access ended on {formatAccessDate(endedAt, timeZone)}. Your progress, XP and certificates are safe, and your certificate links still work.</p>
    <p className="mt-2 max-w-2xl leading-7 text-white/80">To carry on with the lessons, you can get access again. It gives you another {days} days from the day you pay, and you pick up where you left off.</p>
    <div className="mt-6 flex flex-wrap gap-3">
      <Link href="/checkout" className="tap inline-flex items-center gap-2 rounded-full bg-[#f2b01e] px-7 py-3 font-bold text-[#0b1c30]">Get access again <ArrowRight size={18} /></Link>
      <Link href="/certificates" className="tap inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white">View my certificates</Link>
    </div>
  </section>;
}

/** A small label with the learner's access end date, or that it never ends. */
export function AccessChip({ access, timeZone }: { access: AccessStatus; timeZone?: string }) {
  if (access.kind === "expired") return null;
  return <span className="chip bg-white text-[#4d5768] ring-1 ring-[#dfe5ee]" data-testid="access-chip">
    {access.kind === "timed" ? <><CalendarClock size={13} />Access until {formatAccessDate(access.endsAt, timeZone)}</> : <><InfinityIcon size={13} />{access.kind === "admin" ? "Admin access" : "Lifetime access"}</>}
  </span>;
}
