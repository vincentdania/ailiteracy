import Link from "next/link";
import { Award, BookOpen, FolderOpen, LayoutDashboard, LogOut, Map, Settings, Users } from "lucide-react";
import { signOut } from "@/lib/auth";

const navItems = [
  [LayoutDashboard, "Dashboard", "/dashboard"],
  [Map, "Roadmap", "/challenge"],
  [BookOpen, "Curriculum", "/challenge"],
  [FolderOpen, "Resources", "/dashboard#resources"],
] as const;

export function AppNav({ role, name }: { role: "USER" | "ADMIN"; name: string }) {
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <>
    <aside className="border-b border-[#e2e8f0] bg-[#f2f3ff] lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-72 lg:border-b-0 lg:border-r">
      <div className="container-shell flex h-[72px] items-center justify-between lg:h-full lg:w-auto lg:flex-col lg:items-stretch lg:p-5">
        <Link href="/dashboard" className="font-serif text-2xl font-bold text-[#00261d]">AI Literacy</Link>
        <nav className="hidden flex-1 gap-2 pt-14 lg:grid lg:content-start" aria-label="Learning navigation">
          {navItems.map(([Icon, label, href], index) => <Link key={label} href={href} className={`flex items-center gap-4 rounded-r-full px-5 py-4 text-sm font-bold transition ${index === 0 ? "bg-[#00261d] text-white" : "text-[#414845] hover:bg-white hover:text-[#00261d]"}`}><Icon size={20} strokeWidth={1.7} />{label}</Link>)}
          {role === "ADMIN" && <Link href="/admin" className="mt-3 rounded-xl bg-[#00261d] px-4 py-3 text-sm font-bold text-white">Admin control plane</Link>}
        </nav>
        <div className="hidden lg:block">
          <Link href="/dashboard#settings" className="mb-5 flex items-center gap-4 px-5 py-3 text-sm font-bold text-[#414845]"><Settings size={20} />Settings</Link>
          <div className="border-t border-[#d9ddea] pt-5"><div className="flex items-center gap-3 px-4"><span className="grid size-11 place-items-center rounded-full bg-[#123c31] text-sm font-bold text-white">{initials}</span><div className="min-w-0"><strong className="block truncate text-sm">{name}</strong><span className="text-xs text-[#717975]">Learner</span></div></div><form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}><button className="mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-[#717975] hover:bg-white hover:text-red-700"><LogOut size={17} />Sign out</button></form></div>
        </div>
        <div className="flex items-center gap-1 lg:hidden"><Link className="p-2" href="/challenge" aria-label="Curriculum"><BookOpen size={20} /></Link><Link className="p-2" href="/referrals" aria-label="Referrals"><Users size={20} /></Link></div>
      </div>
    </aside>
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-[#e2e8f0] bg-white/95 px-2 pt-2 backdrop-blur lg:hidden" aria-label="Mobile learning navigation">
      {[[LayoutDashboard,"Home","/dashboard"],[Map,"Roadmap","/challenge"],[Users,"Refer","/referrals"],[Award,"Awards","/dashboard#certificates"]].map(([Icon,label,href], index) => { const ItemIcon = Icon as typeof LayoutDashboard; return <Link key={String(label)} href={String(href)} className={`flex flex-col items-center gap-1 rounded-full py-2 text-[11px] font-bold ${index === 0 ? "text-[#00261d]" : "text-[#717975]"}`}><ItemIcon size={19} /><span>{String(label)}</span></Link>; })}
    </nav>
  </>;
}
