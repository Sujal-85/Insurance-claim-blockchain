import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatsCard } from "@/components/ui/StatsCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileStack,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  ArrowRight,
  BarChart3,
} from "lucide-react";

const recentClaims = [
  { id: "CLM-2024-015", user: "Alice Johnson", amount: "$3,200", risk: "low", status: "pending" as const },
  { id: "CLM-2024-014", user: "Bob Smith", amount: "$8,500", risk: "high", status: "processing" as const },
  { id: "CLM-2024-013", user: "Carol White", amount: "$1,200", risk: "low", status: "approved" as const },
  { id: "CLM-2024-012", user: "David Brown", amount: "$15,000", risk: "medium", status: "pending" as const },
];

export default function AdminDashboard() {
  return (
    <AdminLayout title="Admin Dashboard" subtitle="Insurance claim management overview">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Claims" value="1,234" icon={FileStack} change={{ value: 12, trend: "up" }} />
        <StatsCard title="Pending Review" value="47" icon={Clock} iconColor="bg-warning/10 text-warning" />
        <StatsCard title="Approved Today" value="23" icon={CheckCircle} iconColor="bg-success/10 text-success" />
        <StatsCard title="Total Payouts" value="$2.4M" icon={DollarSign} change={{ value: 8, trend: "up" }} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Claims Queue */}
        <div className="lg:col-span-2">
          <GlassCard variant="elevated">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold">Claims Queue</h2>
              <Link to="/admin/claims">
                <Button variant="ghost" size="sm">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </div>
            <div className="space-y-4">
              {recentClaims.map((claim, index) => (
                <motion.div
                  key={claim.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {claim.user.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{claim.id}</p>
                      <p className="text-sm text-muted-foreground">{claim.user}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      claim.risk === "high" ? "bg-destructive/10 text-destructive" :
                      claim.risk === "medium" ? "bg-warning/10 text-warning" :
                      "bg-success/10 text-success"
                    }`}>
                      {claim.risk} risk
                    </span>
                    <p className="font-semibold w-20 text-right">{claim.amount}</p>
                    <StatusBadge status={claim.status} size="sm" />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <GlassCard variant="elevated">
            <h3 className="font-semibold mb-4">Fraud Detection</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <p className="text-3xl font-display font-bold">3</p>
                <p className="text-sm text-muted-foreground">High-risk claims flagged</p>
              </div>
            </div>
            <Link to="/admin/claims">
              <Button variant="outline" className="w-full">Review Flagged Claims</Button>
            </Link>
          </GlassCard>

          <GlassCard variant="glow">
            <h3 className="font-semibold mb-4">Processing Time</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
              <div>
                <p className="text-3xl font-display font-bold">1.8h</p>
                <p className="text-sm text-muted-foreground">Avg. processing time</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </AdminLayout>
  );
}
