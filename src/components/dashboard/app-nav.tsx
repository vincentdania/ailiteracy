import Link from "next/link";
import { Award, LayoutDashboard, Map, Settings, Trophy, Users } from "lucide-react";
import { signOut } from "@/lib/auth";
import { AcademyLockup, HyraxMark } from "@/components/brand/hyrax-logo";
import { NavLink } from "@/components/dashboard/nav-link";
import { SignOutButton } from "@/components/dashboard/sign-out-button";

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
  { icon: Map, label: "Lessons", href: "/challenge" },
  { icon: Trophy, label: "Achievements", href: "/achievements" },
  { icon: Award, label: "Certificates", href: "/certificates" },
  { icon: Users, label: "Refer a friend", href: "/referrals" },
] as const;

export function AppNav({ role, name }: { role: "USER" | "ADMIN"; name: string }) {
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <>
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-bold">Skip to content</a>
    <aside className="no-print border-b border-[#dfe5ee] bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-16 items-center justify-between px-4 lg:h-full lg:flex-col lg:items-stretch lg:p-6">
        <Link href="/dashboard" className="text-xl lg:pt-1" aria-label="Hyrax AI Academy home"><AcademyLockup /></Link>
        <nav className="hidden flex-1 gap-1 pt-10 lg:grid lg:content-start" aria-label="Learning navigation">
          {navItems.map(({ icon: Icon, label, href }) => <NavLink key={href} href={href} className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold text-[#4d5768] transition hover:bg-[#f6f8fb] hover:text-[#0b1c30]" activeClassName="!bg-[#eaf2ff] !text-[#0058be]"><Icon size={19} strokeWidth={1.8} />{label}</NavLink>)}
          {role === "ADMIN" && <Link href="/admin" className="mt-4 rounded-xl border border-[#dfe5ee] px-4 py-3 text-sm font-bold text-[#0b1c30]">Admin</Link>}
        </nav>
        <div className="hidden lg:block">
          <Link href="/dashboard#settings" className="mb-3 flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold text-[#4d5768] hover:bg-[#f6f8fb]"><Settings size={19} />Settings</Link>
          <div className="border-t border-[#dfe5ee] pt-5"><div className="flex items-center gap-3 px-2"><span className="grid size-10 place-items-center rounded-full bg-[#214889] text-sm font-bold text-white">{initials}</span><div className="min-w-0"><strong className="block truncate text-sm">{name}</strong><span className="text-xs text-[#677284]">Learner</span></div></div><form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}><SignOutButton /></form></div>
          <p className="mt-4 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-[.12em] text-[#97a3b6]"><HyraxMark className="size-3.5 text-[#214889]" />The AI Enablement Company</p>
        </div>
        <Link href="/dashboard#settings" className="tap grid size-11 place-items-center rounded-full text-[#4d5768] lg:hidden" aria-label="Settings"><Settings size={20} /></Link>
      </div>
    </aside>
    <nav className="no-print safe-bottom fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-[#dfe5ee] bg-white/95 px-2 pt-1.5 backdrop-blur lg:hidden" aria-label="Mobile learning navigation">
      {navItems.slice(0, 4).map(({ icon: Icon, label, href }) => <NavLink key={href} href={href} className="tap flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-xs font-bold text-[#677284]" activeClassName="!text-[#0058be]"><Icon size={20} /><span>{label}</span></NavLink>)}
    </nav>
  </>;
}
