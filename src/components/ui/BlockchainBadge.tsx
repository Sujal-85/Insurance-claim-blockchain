import { cn } from "@/lib/utils";
import { Shield, Link, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface BlockchainBadgeProps {
  type?: "verified" | "secured" | "linked";
  label?: string;
  className?: string;
}

const badgeConfig = {
  verified: {
    icon: Shield,
    label: "Blockchain Verified",
    gradient: "bg-primary",
  },
  secured: {
    icon: Lock,
    label: "Secured on Chain",
    gradient: "bg-security",
  },
  linked: {
    icon: Link,
    label: "On-Chain Record",
    gradient: "bg-secondary",
  },
};

export function BlockchainBadge({ type = "verified", label, className }: BlockchainBadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;
  const displayLabel = label || config.label;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
        "text-white shadow-md",
        config.gradient,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{displayLabel}</span>
      <motion.div
        className="w-1.5 h-1.5 rounded-full bg-white/80"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}
