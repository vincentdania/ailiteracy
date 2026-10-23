import Image from "next/image";
import { cn } from "@/lib/utils";

type Track = "small-business" | "professionals";

const examples = {
  "small-business": {
    src: "/images/academy/business-assistant-example.png",
    title: "Customer replies, ready for your approval",
    alt: "Illustrative assistant screen showing a WhatsApp customer question, a suggested reply awaiting approval, a lead follow-up and a weekly report",
  },
  professionals: {
    src: "/images/academy/professional-assistant-example.png",
    title: "A morning brief and a proposal draft to review",
    alt: "Illustrative assistant screen showing a morning briefing, a proposal draft awaiting approval and client access controls",
  },
} as const;

export function AcademyPhoto({ person, className }: { person: "owner" | "professional"; className?: string }) {
  const owner = person === "owner";
  return <div className={cn("overflow-hidden border border-[#e5ded4] bg-[#f2ece4]", className)}>
    <div className="relative aspect-[3/2] w-full lg:aspect-[4/3]">
      <Image
        src={owner ? "/images/academy/business-owner.png" : "/images/academy/professional.png"}
        alt={owner ? "Illustration of a Nigerian business owner reviewing a message in her shop" : "Illustration of a Nigerian professional reviewing work at a laptop"}
        fill
        priority={owner}
        sizes="(max-width: 1024px) 100vw, 45vw"
        className="object-cover"
      />
    </div>
  </div>;
}

export function AssistantExample({ track, className }: { track: Track; className?: string }) {
  const example = examples[track];
  return <figure className={cn("overflow-hidden border border-[#e5ded4] bg-white", className)}>
    <Image src={example.src} alt={example.alt} width={1586} height={992} sizes="(max-width: 1024px) 100vw, 50vw" className="h-auto w-full" />
    <figcaption className="border-t border-[#e5ded4] px-4 py-4 sm:px-6">
      <span className="block font-display text-lg font-semibold text-[#10294f]">{example.title}</span>
    </figcaption>
  </figure>;
}
