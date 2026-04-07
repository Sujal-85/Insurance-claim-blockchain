import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, Filter, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function AdminClaims() {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const response = await api.get('/claims');
      const backendClaims = response.data;

      const mappedClaims = backendClaims.map((claim: any) => ({
        id: claim.id,
        user: claim.user?.name || "Unknown User",
        walletAddress: claim.user?.walletAddress || "N/A",
        type: claim.userPolicy?.policy?.policyName || "N/A",
        amount: `$${claim.amount.toLocaleString()}`,
        risk: Math.round(claim.aiRiskScore || 10),
        status: claim.status === 'ai_verified' ? 'processing' : claim.status.toLowerCase(),
        date: new Date(claim.createdAt).toLocaleDateString(),
      }));

      setClaims(mappedClaims);
    } catch (err) {
      console.error("Error fetching admin claims:", err);
      toast.error("Failed to fetch claims from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleProcessClaim = async (claimId: string, isApprove: boolean) => {
    try {
      const status = isApprove ? 'APPROVED' : 'REJECTED';
      await api.post(`/claims/${claimId}/status`, { 
        status,
        reason: isApprove ? "Claim approved after review." : "Claim rejected due to insufficient evidence."
      });
      
      toast.success(`Claim ${isApprove ? 'approved' : 'rejected'} successfully`);
      fetchClaims();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to process claim");
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
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{claim.user}</span>
                      <span className="text-xs text-muted-foreground truncate w-32" title={claim.walletAddress}>
                        {claim.walletAddress}
                      </span>
                    </div>
                  </td>
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
                      {["pending", "processing"].includes(claim.status) && (
                        <>
                          <Button variant="ghost" size="icon" className="text-success" onClick={() => handleProcessClaim(claim.id, true)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleProcessClaim(claim.id, false)}>
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
