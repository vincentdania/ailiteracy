import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; variant?: "primary" | "secondary" | "ghost"; size?: "sm" | "md" | "lg" };

export function Button({ asChild, variant = "primary", size = "md", className, ...props }: Props) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn("focus-ring inline-flex items-center justify-center rounded-xl font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55", variant === "primary" && "bg-[#10294f] text-white hover:bg-[#1c3a65]", variant === "secondary" && "border border-[#10294f] bg-transparent text-[#10294f] hover:bg-[#f6e7d8]", variant === "ghost" && "text-[#10294f] hover:bg-[#f6e7d8]", size === "sm" && "h-10 px-4 text-sm", size === "md" && "h-11 px-5", size === "lg" && "h-13 px-7 text-sm", className)} {...props} />;
}
