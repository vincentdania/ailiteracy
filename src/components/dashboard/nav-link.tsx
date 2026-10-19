"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, className, activeClassName, children }: { href: string; className: string; activeClassName: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
  return <Link href={href} aria-current={active ? "page" : undefined} className={`${className} ${active ? activeClassName : ""}`}>{children}</Link>;
}
