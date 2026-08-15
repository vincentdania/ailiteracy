import * as ProgressPrimitive from "@radix-ui/react-progress";

export function Progress({ value, label }: { value: number; label?: string }) {
  return <div><div className="mb-2 flex items-center justify-between text-sm font-semibold"><span>{label ?? "Progress"}</span><span>{Math.round(value)}%</span></div><ProgressPrimitive.Root className="h-2.5 overflow-hidden rounded-full bg-[#dfe6e1]" value={value}><ProgressPrimitive.Indicator className="h-full rounded-full bg-[#1d604d] transition-transform duration-500" style={{ transform: `translateX(-${100 - value}%)` }} /></ProgressPrimitive.Root></div>;
}
