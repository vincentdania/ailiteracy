import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; variant?: "primary" | "secondary" | "ghost"; size?: "sm" | "md" | "lg" };

export function Button({ asChild, variant = "primary", size = "md", className, ...props }: Props) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn("focus-ring inline-flex items-center justify-center rounded-xl font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-55", variant === "primary" && "bg-[#0058be] text-white hover:-translate-y-0.5 hover:bg-[#00479b]", variant === "secondary" && "border border-[#97a3b6] bg-transparent text-[#0b1c30] hover:bg-white", variant === "ghost" && "text-[#0b1c30] hover:bg-[#edf1f6]", size === "sm" && "h-10 px-4 text-sm", size === "md" && "h-11 px-5", size === "lg" && "h-13 px-7 text-sm", className)} {...props} />;
}
