import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "elevated" | "bordered" | "glow";
  hover?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", hover = true, children, ...props }, ref) => {
    const variants = {
      default: "bg-card/80 backdrop-blur-xl border border-white/20 shadow-card",
      elevated: "bg-card/90 backdrop-blur-2xl border border-white/30 shadow-lg",
      bordered: "bg-card/70 backdrop-blur-xl border-2 border-primary/20 shadow-card",
      glow: "bg-card/80 backdrop-blur-xl border border-white/20 shadow-glow",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-2xl p-6",
          variants[variant],
          hover && "transition-all duration-300 hover:shadow-lg hover:border-white/40",
          className
        )}
        whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
