import { auth } from "@/lib/auth";
import { AppNav } from "@/components/dashboard/app-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <div className="min-h-screen bg-[#f8f7f1]">
      {session?.user ? <AppNav role={session.user.role} name={session.user.name ?? "Learner"} /> : null}
      <main className={session?.user ? "px-4 pb-28 pt-7 sm:px-7 lg:ml-72 lg:px-12 lg:pb-10 lg:pt-12" : "px-4 pb-16 pt-7 sm:px-7"}>{children}</main>
    </div>
  );
}
