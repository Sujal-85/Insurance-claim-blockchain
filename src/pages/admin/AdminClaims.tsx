import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, Filter, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { getContractReadOnly, getContractWithSigner } from "@/lib/ethereum";
import { toast } from "sonner";

export default function AdminClaims() {
  const [claims, setClaims] = useState<any[]>([]);

  const fetchClaims = async () => {
    try {
      const contract = getContractReadOnly();
      const count = await contract.claimCount();
      const fetched = [];
      for (let i = 1; i <= Number(count); i++) {
        const claimData = await contract.claims(i);
        let statusString = "pending";
        if (claimData.processed && claimData.approved) statusString = "approved";
        if (claimData.processed && !claimData.approved) statusString = "rejected";

        fetched.push({
          id: claimData.claimId.toString(),
          user: claimData.claimant,
          type: "N/A", // policy type derived from policy could be added
          amount: claimData.reason.substring(0, 20) + '...', // Mock amount with reason limits
          risk: 10, // Default risk
          status: statusString as any,
          date: "On-Chain", // Timestamp omitted
        });
      }
      setClaims(fetched);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch claims from blockchain");
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleProcessClaim = async (claimIdNum: bigint, isApprove: boolean) => {
    try {
      const contract = await getContractWithSigner();
      let tx;
      if (isApprove) {
        tx = await contract.approveClaim(claimIdNum);
      } else {
        tx = await contract.rejectClaim(claimIdNum);
      }
      toast.info("Processing transaction...");
      await tx.wait();
      toast.success(`Claim ${isApprove ? 'approved' : 'rejected'} successfully`);
      fetchClaims();
    } catch (err: any) {
      console.error(err);
      toast.error(err.reason || err.message || "Failed to process claim");
    }
  };

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
                      {claim.status === "pending" && (
                        <>
                          <Button variant="ghost" size="icon" className="text-success" onClick={() => handleProcessClaim(BigInt(claim.id), true)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleProcessClaim(BigInt(claim.id), false)}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
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
