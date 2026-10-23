import { auth } from "@/lib/auth";
import { AppNav } from "@/components/dashboard/app-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return <div className="min-h-screen bg-[#faf7f2]">{session?.user ? <AppNav role={session.user.role} name={session.user.name ?? "Learner"} /> : null}<main id="main" className={session?.user ? "px-4 pb-28 pt-6 sm:px-7 lg:ml-72 lg:px-12 lg:pb-12 lg:pt-10" : "px-4 pb-16 pt-7 sm:px-7"}>{children}</main></div>;
}
