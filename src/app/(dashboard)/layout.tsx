import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AppNav } from "@/components/dashboard/app-nav";
import { CelebrationProvider } from "@/components/learning/celebration";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const prefs = session?.user.id ? await db.user.findUnique({ where: { id: session.user.id }, select: { effectsEnabled: true, soundEnabled: true } }) : null;
  return (
    <CelebrationProvider initialPrefs={{ effectsEnabled: prefs?.effectsEnabled ?? true, soundEnabled: prefs?.soundEnabled ?? false }}>
      <div className="min-h-screen bg-[#f6f8fb]">
        {session?.user ? <AppNav role={session.user.role} name={session.user.name ?? "Learner"} /> : null}
        <main id="main" className={session?.user ? "px-4 pb-28 pt-6 sm:px-7 lg:ml-72 lg:px-12 lg:pb-12 lg:pt-10" : "px-4 pb-16 pt-7 sm:px-7"}>{children}</main>
      </div>
    </CelebrationProvider>
  );
}
