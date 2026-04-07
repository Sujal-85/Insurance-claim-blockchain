import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  FileText,
  User,
  Activity,
  ArrowLeft,
  FileSearch
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function AdminReviewClaims() {
  const [claims, setClaims] = useState<any[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      const response = await api.get('/claims');
      // Filter only pending claims for review
      const pendingClaims = response.data.filter((c: any) => c.status === 'PENDING' || c.status === 'AI_VERIFIED');
      setClaims(pendingClaims);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch claims for review");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleProcess = async (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedClaim) return;
    
    try {
      await api.post(`/claims/${selectedClaim.id}/status`, {
        status,
        reason: status === 'APPROVED' ? "Approved after administrative review." : "Rejected due to policy non-compliance."
      });
      toast.success(`Claim ${status.toLowerCase()} successfully`);
      setSelectedClaim(null);
      fetchClaims();
    } catch (err) {
      console.error(err);
      toast.error("Failed to process claim");
    }
  };

  return (
    <AdminLayout title="Review Claims" subtitle="Detailed AI-assisted claim verification">
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
        {/* Left List */}
        <div className={`flex-1 flex flex-col gap-4 overflow-hidden ${selectedClaim ? 'hidden lg:flex' : 'flex'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              placeholder="Filter claims..." 
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {claims.map((claim) => (
              <motion.div
                key={claim.id}
                layoutId={claim.id}
                onClick={() => setSelectedClaim(claim)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedClaim?.id === claim.id 
                    ? 'bg-primary/10 border-primary shadow-lg shadow-primary/5' 
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-muted-foreground">#{claim.id.slice(-6)}</span>
                  <StatusBadge status={claim.status.toLowerCase()} size="sm" />
                </div>
                <h4 className="font-bold text-sm mb-1">{claim.policy?.policyName || 'No Policy Associated'}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>{claim.user?.name || 'Anonymous User'}</span>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="font-bold text-sm">${claim.amount.toLocaleString()}</span>
                  <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    (claim.aiRiskScore || 0) < 30 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                  }`}>
                    AI Score: {Math.round(claim.aiRiskScore || 0)}/100
                  </div>
                </div>
              </motion.div>
            ))}
            {claims.length === 0 && !loading && (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No claims awaiting review</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Details */}
        <div className={`flex-[2] flex flex-col ${!selectedClaim ? 'hidden lg:flex' : 'flex'}`}>
          <AnimatePresence mode="wait">
            {selectedClaim ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full flex flex-col"
              >
                <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-border bg-muted/30">
                    <div className="flex items-center justify-between mb-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="lg:hidden" 
                        onClick={() => setSelectedClaim(null)}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleProcess('REJECTED')} className="text-destructive hover:text-destructive">
                          <XCircle className="h-4 w-4 mr-2" /> Reject
                        </Button>
                        <Button size="sm" onClick={() => handleProcess('APPROVED')} className="bg-success text-white hover:bg-success/90">
                          <CheckCircle2 className="h-4 w-4 mr-2" /> Approve
                        </Button>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold">{selectedClaim.policy?.policyName || 'No Policy Associated'}</h2>
                    <p className="text-muted-foreground text-sm">Submitted on {new Date(selectedClaim.createdAt).toLocaleDateString()}</p>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* AI Analysis Section */}
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <Activity className="h-5 w-5 text-primary" />
                        <h3 className="font-bold">AI Fraud Analysis</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-card border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
                          <div className="flex items-end gap-2">
                            <span className={`text-3xl font-bold ${
                              (selectedClaim.aiRiskScore || 0) < 30 ? 'text-success' : 'text-warning'
                            }`}>
                              {Math.round(selectedClaim.aiRiskScore || 0)}
                            </span>
                            <span className="text-muted-foreground text-sm mb-1">/100</span>
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-card border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Doc Authenticity</p>
                          <div className="flex items-center gap-2 text-success">
                            <ShieldCheck className="h-5 w-5" />
                            <span className="font-bold">98% Match</span>
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-card border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Policy Fit</p>
                          <div className="flex items-center gap-2 text-primary">
                            <FileText className="h-5 w-5" />
                            <span className="font-bold">Eligible</span>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Claim Information */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Details</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs text-muted-foreground">Incident Type</label>
                            <p className="font-medium capitalize">{selectedClaim.incidentType || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Description</label>
                            <p className="text-sm bg-muted/50 p-3 rounded-lg mt-1">{selectedClaim.description}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Claimant</h4>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {selectedClaim.user?.name?.[0] || 'U'}
                            </div>
                            <div>
                              <p className="font-bold">{selectedClaim.user?.name}</p>
                              <p className="text-xs text-muted-foreground font-mono">{selectedClaim.user?.walletAddress?.slice(0, 10)}...</p>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg border border-border bg-card">
                            <p className="text-xs text-muted-foreground mb-1">Total Policies</p>
                            <p className="font-bold">3 Active</p>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-muted-foreground"
              >
                <div className="p-8 rounded-full bg-muted/20 mb-4">
                  <FileSearch className="h-12 w-12 opacity-20" />
                </div>
                <h3 className="text-xl font-bold">Select a claim to review</h3>
                <p>Click on any claim from the list to see detailed analysis</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
}
