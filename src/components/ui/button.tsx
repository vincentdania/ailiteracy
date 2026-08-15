import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; variant?: "primary" | "secondary" | "ghost"; size?: "sm" | "md" | "lg" };

export function Button({ asChild, variant = "primary", size = "md", className, ...props }: Props) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn("focus-ring inline-flex items-center justify-center rounded-full font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-55", variant === "primary" && "bg-[#123c31] text-white hover:-translate-y-0.5 hover:bg-[#1d604d]", variant === "secondary" && "border border-[#b9c6bf] bg-white text-[#123c31] hover:border-[#123c31]", variant === "ghost" && "text-[#123c31] hover:bg-[#e9eee9]", size === "sm" && "h-9 px-4 text-sm", size === "md" && "h-11 px-5", size === "lg" && "h-14 px-7 text-lg", className)} {...props} />;
}
