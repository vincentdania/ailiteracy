import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppNav } from "@/components/dashboard/app-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <div className="min-h-screen bg-[#f5f6f1]"><AppNav role={session.user.role} /><main className="px-4 py-8 sm:px-7 lg:ml-64 lg:px-10 lg:py-10">{children}</main></div>;
}
