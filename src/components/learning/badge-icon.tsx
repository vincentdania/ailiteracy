import { BookOpen, Bolt, Compass, Flag, Layers, Medal, RefreshCw, Rocket, ShieldCheck, Sparkles, Target, Trophy, type LucideIcon } from "lucide-react";
import { BADGES, type BadgeDefinition } from "@/lib/learning/rewards";

const ICONS: Record<BadgeDefinition["icon"], LucideIcon> = { spark: Sparkles, target: Target, compass: Compass, shield: ShieldCheck, trophy: Trophy, rocket: Rocket, book: BookOpen, medal: Medal, refresh: RefreshCw, layers: Layers, bolt: Bolt, flag: Flag };

/** Accepts a badge key ("first-mission") or an icon name ("target"). */
export function BadgeIcon({ icon, size = 20 }: { icon: string; size?: number }) {
  const name = (BADGES.find((badge) => badge.key === icon)?.icon ?? icon) as BadgeDefinition["icon"];
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon size={size} aria-hidden />;
}
