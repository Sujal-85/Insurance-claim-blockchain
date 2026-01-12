import { UserLayout } from "@/components/layout/UserLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatsCard } from "@/components/ui/StatsCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BlockchainBadge } from "@/components/ui/BlockchainBadge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Shield,
  ArrowRight,
  Calendar,
  DollarSign,
} from "lucide-react";

const recentClaims = [
  {
    id: "CLM-2024-001",
    type: "Auto Insurance",
    amount: "$2,500",
    status: "processing" as const,
    date: "Jan 15, 2024",
  },
  {
    id: "CLM-2024-002",
    type: "Health Insurance",
    amount: "$850",
    status: "approved" as const,
    date: "Jan 12, 2024",
  },
  {
    id: "CLM-2024-003",
    type: "Property Insurance",
    amount: "$5,200",
    status: "pending" as const,
    date: "Jan 10, 2024",
  },
];

const quickActions = [
  { icon: Plus, label: "Submit New Claim", path: "/user/submit-claim", color: "from-primary to-secondary" },
  { icon: FileText, label: "View Policies", path: "/user/policies", color: "from-secondary to-trust" },
  { icon: Clock, label: "Track Claims", path: "/user/claims", color: "from-trust to-primary" },
];

export default function UserDashboard() {
  return (
    <UserLayout title="Dashboard" subtitle="Welcome back, John! Here's your insurance overview.">
      {/* Trust Indicators */}
      <div className="flex items-center gap-4 mb-8">
        <BlockchainBadge type="verified" />
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4 text-success" />
          <span>All records secured on blockchain</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Policies"
          value="3"
          icon={FileText}
          iconColor="bg-primary/10 text-primary"
        />
        <StatsCard
          title="Total Claims"
          value="7"
          icon={AlertCircle}
          change={{ value: 12, trend: "up" }}
          iconColor="bg-secondary/10 text-secondary"
        />
        <StatsCard
          title="Approved Claims"
          value="5"
          icon={CheckCircle}
          iconColor="bg-success/10 text-success"
        />
        <StatsCard
          title="Total Payouts"
          value="$12,450"
          icon={DollarSign}
          change={{ value: 8, trend: "up" }}
          iconColor="bg-trust/10 text-trust"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={action.path}>
              <GlassCard className="group cursor-pointer" variant="elevated">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{action.label}</p>
                    <p className="text-sm text-muted-foreground">Click to continue</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-2 transition-transform" />
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Claims */}
        <div className="lg:col-span-2">
          <GlassCard variant="elevated">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold">Recent Claims</h2>
              <Link to="/user/claims">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {recentClaims.map((claim, index) => (
                <motion.div
                  key={claim.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{claim.id}</p>
                      <p className="text-sm text-muted-foreground">{claim.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{claim.amount}</p>
                    <StatusBadge status={claim.status} size="sm" />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Policy Summary */}
        <div className="space-y-6">
          <GlassCard variant="elevated">
            <h2 className="text-xl font-display font-semibold mb-4">Active Policies</h2>
            
            <div className="space-y-4">
              {[
                { name: "Auto Insurance", coverage: "$50,000", expires: "Dec 2024" },
                { name: "Health Insurance", coverage: "$100,000", expires: "Mar 2025" },
                { name: "Property Insurance", coverage: "$250,000", expires: "Jun 2025" },
              ].map((policy, index) => (
                <div key={index} className="p-4 rounded-xl bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{policy.name}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Coverage: {policy.coverage}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {policy.expires}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/user/policies">
              <Button variant="outline" className="w-full mt-4">
                View All Policies
              </Button>
            </Link>
          </GlassCard>

          {/* Trust Score */}
          <GlassCard variant="glow" className="relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-success/20 to-trust/20 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trust Score</p>
                  <p className="text-2xl font-display font-bold text-success">Excellent</p>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-[92%] bg-gradient-to-r from-success to-trust rounded-full" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">92/100 - You're a trusted policyholder</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </UserLayout>
  );
}
