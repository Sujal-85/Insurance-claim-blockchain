import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, Filter, Eye, CheckCircle, XCircle, AlertTriangle, X, Clock, User, FileText, IndianRupee, Shield, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function AdminClaims() {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const response = await api.get('/claims');
      const backendClaims = response.data;

      console.log("Raw backend claims:", backendClaims);
      
      const mappedClaims = backendClaims.map((claim: any) => {
        const rawStatus = claim.status;
        // Handle both lowercase and uppercase statuses from backend
        const normalizedStatus = rawStatus?.toLowerCase() || '';
        const displayStatus = normalizedStatus === 'ai_verified' ? 'processing' : normalizedStatus;
        
        console.log(`Claim ${claim.id}: rawStatus=${rawStatus}, normalized=${normalizedStatus}, display=${displayStatus}`);
        
        return {
          id: claim.id,
          user: claim.user?.name || "Unknown User",
          walletAddress: claim.user?.walletAddress || "N/A",
          type: claim.userPolicy?.policy?.policyName || "N/A",
          amount: formatCurrency(claim.amount || 0),
          risk: Math.round(claim.aiRiskScore || 10),
          status: displayStatus,
          rawStatus: rawStatus, // Keep original for debugging
          date: new Date(claim.createdAt).toLocaleDateString(),
        };
      });

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
      console.log(`Processing claim ${claimId} with status ${status}`);
      
      const { signMessage, getSignerAddress } = await import("@/lib/ethereum");
      
      // Ensure wallet is connected
      const address = await getSignerAddress();
      if (!address) {
        toast.error("Please connect your Admin wallet to process this claim.");
        return;
      }

      const message = `Admin action: ${status} claim ${claimId} at ${new Date().toISOString()}`;
      const signature = await signMessage(message);

      const response = await api.post(`/claims/${claimId}/status`, { 
        status,
        reason: isApprove ? "Claim approved after review." : "Claim rejected due to insufficient evidence.",
        signature,
        message
      });
      
      console.log("Process claim response:", response.data);
      toast.success(`Claim ${isApprove ? 'approved' : 'rejected'} successfully`);
      fetchClaims();
    } catch (err: any) {
      console.error("Process claim error:", err);
      console.error("Error response:", err.response?.data);
      toast.error(err.response?.data?.message || err.message || "Failed to process claim");
    }
  };

  return (
    <>
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
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedClaim(claim); setDialogOpen(true); }}><Eye className="h-4 w-4" /></Button>
                      {(claim.status === "pending" || claim.status === "processing" || claim.rawStatus === "PENDING" || claim.rawStatus === "AI_VERIFIED") && (
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

    {/* Claim Details Dialog */}
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Claim Details
            </DialogTitle>
            <DialogDescription>
              Full information about the selected claim
            </DialogDescription>
          </DialogHeader>
          
          {selectedClaim && (
            <div className="space-y-6 mt-4">
              {/* Claim ID & Status */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Claim ID</p>
                  <p className="font-mono font-medium">{selectedClaim.id}</p>
                </div>
                <StatusBadge status={selectedClaim.status} size="lg" />
              </div>

              {/* User Info */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Policyholder Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedClaim.user}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Wallet Address</p>
                    <p className="font-mono text-xs truncate">{selectedClaim.walletAddress}</p>
                  </div>
                </div>
              </div>

              {/* Policy Info */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Policy Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Policy Type</p>
                    <p className="font-medium">{selectedClaim.type}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Submitted Date</p>
                    <p className="font-medium">{selectedClaim.date}</p>
                  </div>
                </div>
              </div>

              {/* Financial Info */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <IndianRupee className="h-4 w-4" />
                  Financial Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Claim Amount</p>
                    <p className="font-medium text-lg">{selectedClaim.amount}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Risk Score</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        selectedClaim.risk >= 70 ? "bg-destructive/10 text-destructive" :
                        selectedClaim.risk >= 40 ? "bg-warning/10 text-warning" :
                        "bg-success/10 text-success"
                      }`}>
                        {selectedClaim.risk}/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Pending Claims */}
              {(selectedClaim.status === "pending" || selectedClaim.status === "processing" || selectedClaim.rawStatus === "PENDING" || selectedClaim.rawStatus === "AI_VERIFIED") && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1 bg-success hover:bg-success/90" 
                    onClick={() => { handleProcessClaim(selectedClaim.id, true); setDialogOpen(false); }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Claim
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => { handleProcessClaim(selectedClaim.id, false); setDialogOpen(false); }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Claim
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
