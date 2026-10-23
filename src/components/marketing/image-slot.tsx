import { cn } from "@/lib/utils";

type ImageSlotProps = {
  kind: "photo" | "screenshot";
  brief: string;
  className?: string;
};

/** Reserved for approved, real Academy photography and product captures. */
export function ImageSlot({ kind, brief, className }: ImageSlotProps) {
  const isPhoto = kind === "photo";
  return <figure className={cn("flex min-h-[18rem] flex-col justify-between border border-dashed border-[#c8742b] bg-[#f3eae0] p-6 text-[#10294f] sm:p-8", className)}>
    <span className="text-xs font-semibold uppercase tracking-[.16em] text-[#8b4c1d]">{isPhoto ? "Real photo slot" : "Real product screenshot slot"}</span>
    <figcaption className="max-w-sm"><span className="block font-display text-2xl font-semibold leading-tight sm:text-3xl">{isPhoto ? "Show the people behind the work." : "Show the assistant in action."}</span><span className="mt-3 block text-sm leading-6 text-[#394b63]">{brief}</span></figcaption>
  </figure>;
}
