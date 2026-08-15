import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppNav } from "@/components/dashboard/app-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <div className="min-h-screen bg-[#f8f7f1]"><AppNav role={session.user.role} name={session.user.name ?? "Learner"} /><main className="px-4 pb-28 pt-7 sm:px-7 lg:ml-72 lg:px-12 lg:pb-10 lg:pt-12">{children}</main></div>;
}
