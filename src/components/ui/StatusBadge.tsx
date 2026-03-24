import { cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle, Loader2, AlertTriangle } from "lucide-react";

type StatusType = "pending" | "approved" | "rejected" | "processing" | "warning";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

const statusConfig: Record<StatusType, { icon: typeof CheckCircle; label: string; className: string }> = {
  pending: {
    icon: Clock,
    label: "Pending",
    className: "bg-warning/15 text-warning border-warning/30",
  },
  approved: {
    icon: CheckCircle,
    label: "Approved",
    className: "bg-success/15 text-success border-success/30",
  },
  rejected: {
    icon: XCircle,
    label: "Rejected",
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
  processing: {
    icon: Loader2,
    label: "Processing",
    className: "bg-primary/15 text-primary border-primary/30",
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    className: "bg-warning/15 text-warning border-warning/30",
  },
};

const sizeConfig = {
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-sm px-3 py-1 gap-1.5",
  lg: "text-base px-4 py-1.5 gap-2",
};

const iconSizeConfig = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function StatusBadge({ status, label, size = "md", showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const displayLabel = label || config.label;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border",
        config.className,
        sizeConfig[size]
      )}
    >
      {showIcon && (
        <Icon className={cn(iconSizeConfig[size], status === "processing" && "animate-spin")} />
      )}
      {displayLabel}
    </span>
  );
}
