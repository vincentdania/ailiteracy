import { redirect } from "next/navigation";

export default async function JoinPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  redirect(`/signup${ref ? `?ref=${encodeURIComponent(ref)}` : ""}`);
}
