import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; variant?: "primary" | "secondary" | "ghost"; size?: "sm" | "md" | "lg" };

export function Button({ asChild, variant = "primary", size = "md", className, ...props }: Props) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn("focus-ring inline-flex items-center justify-center rounded-xl font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-55", variant === "primary" && "bg-[#00261d] text-white hover:-translate-y-0.5 hover:bg-[#123c31]", variant === "secondary" && "border border-[#9aa6a1] bg-transparent text-[#00261d] hover:bg-white", variant === "ghost" && "text-[#00261d] hover:bg-[#eef1ec]", size === "sm" && "h-10 px-4 text-sm", size === "md" && "h-11 px-5", size === "lg" && "h-13 px-7 text-sm", className)} {...props} />;
}
