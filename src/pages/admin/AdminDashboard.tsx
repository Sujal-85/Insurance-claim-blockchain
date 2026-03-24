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
  Clock,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  ArrowRight,
} from "lucide-react";

import { useState, useEffect } from "react";
import { getContractReadOnly } from "@/lib/ethereum";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalClaims: 0, pendingReview: 0, approvedToday: 0 });
  const [recentClaims, setRecentClaims] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const contract = getContractReadOnly();
      const count = await contract.claimCount();
      let pending = 0, approved = 0;
      const fetchedClaims = [];

      for (let i = 1; i <= Number(count); i++) {
        const claim = await contract.claims(i);
        if (!claim.processed) pending++;
        if (claim.approved) approved++;

        fetchedClaims.push({
          id: claim.claimId.toString(),
          user: claim.claimant,
          amount: claim.reason.substring(0, 15) + "...", // Used reason as amount replacement in UI since there's no amount
          risk: "low", // Dummy risk
          status: claim.processed ? (claim.approved ? "approved" : "rejected") : "pending",
        });
      }

      setStats({
        totalClaims: Number(count),
        pendingReview: pending,
        approvedToday: approved
      });
      // Sort to get recent
      setRecentClaims(fetchedClaims.reverse().slice(0, 4));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AdminLayout title="Admin Dashboard" subtitle="Insurance claim management overview">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Claims" value={stats.totalClaims.toString()} icon={FileStack} change={{ value: 12, trend: "up" }} />
        <StatsCard title="Pending Review" value={stats.pendingReview.toString()} icon={Clock} iconColor="bg-warning/10 text-warning" />
        <StatsCard title="Approved Contracts" value={stats.approvedToday.toString()} icon={CheckCircle} iconColor="bg-success/10 text-success" />
        <StatsCard title="Total Payouts" value="N/A" icon={DollarSign} change={{ value: 8, trend: "up" }} />
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
              {recentClaims.length === 0 && <p className="text-muted-foreground text-sm">No claims in the queue.</p>}
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
                      <p className="font-medium">Claim #{claim.id}</p>
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
                    <p className="font-semibold w-24 text-right truncate" title={claim.amount}>{claim.amount}</p>
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
