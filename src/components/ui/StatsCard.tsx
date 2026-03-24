import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: "up" | "down" | "neutral";
  };
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function StatsCard({ title, value, change, icon: Icon, iconColor, className }: StatsCardProps) {
  return (
    <GlassCard className={cn("relative overflow-hidden", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold font-display tracking-tight"
          >
            {value}
          </motion.p>
          {change && (
            <div
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium",
                change.trend === "up" && "text-success",
                change.trend === "down" && "text-destructive",
                change.trend === "neutral" && "text-muted-foreground"
              )}
            >
              <span>
                {change.trend === "up" ? "↑" : change.trend === "down" ? "↓" : "→"}
              </span>
              <span>{Math.abs(change.value)}%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-xl",
            iconColor || "bg-primary/10"
          )}
        >
          <Icon className={cn("h-6 w-6", iconColor ? "text-current" : "text-primary")} />
        </div>
      </div>
      {/* Decorative gradient */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-2xl" />
    </GlassCard>
  );
}
