import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, Filter, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const claims = [
  { id: "CLM-2024-015", user: "Alice Johnson", type: "Auto", amount: "$3,200", risk: 18, status: "pending" as const, date: "Jan 15, 2024" },
  { id: "CLM-2024-014", user: "Bob Smith", type: "Health", amount: "$8,500", risk: 75, status: "processing" as const, date: "Jan 14, 2024" },
  { id: "CLM-2024-013", user: "Carol White", type: "Property", amount: "$1,200", risk: 12, status: "approved" as const, date: "Jan 13, 2024" },
  { id: "CLM-2024-012", user: "David Brown", type: "Auto", amount: "$15,000", risk: 45, status: "pending" as const, date: "Jan 12, 2024" },
  { id: "CLM-2024-011", user: "Eva Martinez", type: "Health", amount: "$650", risk: 8, status: "approved" as const, date: "Jan 11, 2024" },
  { id: "CLM-2024-010", user: "Frank Lee", type: "Property", amount: "$22,000", risk: 82, status: "rejected" as const, date: "Jan 10, 2024" },
];

export default function AdminClaims() {
  return (
    <AdminLayout title="Claims Management" subtitle="Review and process insurance claims">
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search claims..." className="pl-10 h-12 bg-card" />
        </div>
        <Button variant="outline" className="h-12"><Filter className="mr-2 h-4 w-4" />Filters</Button>
      </div>

      <GlassCard variant="elevated">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Claim ID</th>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Policyholder</th>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Type</th>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Risk Score</th>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim, index) => (
                <motion.tr
                  key={claim.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border/50 hover:bg-muted/30"
                >
                  <td className="py-4 px-4 font-medium">{claim.id}</td>
                  <td className="py-4 px-4">{claim.user}</td>
                  <td className="py-4 px-4">{claim.type}</td>
                  <td className="py-4 px-4 font-semibold">{claim.amount}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      claim.risk >= 70 ? "bg-destructive/10 text-destructive" :
                      claim.risk >= 40 ? "bg-warning/10 text-warning" :
                      "bg-success/10 text-success"
                    }`}>
                      {claim.risk}/100
                    </span>
                  </td>
                  <td className="py-4 px-4"><StatusBadge status={claim.status} size="sm" /></td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-success"><CheckCircle className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive"><XCircle className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </AdminLayout>
  );
}
