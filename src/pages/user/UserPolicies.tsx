import { UserLayout } from "@/components/layout/UserLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { BlockchainBadge } from "@/components/ui/BlockchainBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield,
  Calendar,
  DollarSign,
  FileText,
  Check,
  AlertTriangle,
  ChevronRight,
  Download,
  Plus,
  RefreshCw,
} from "lucide-react";

import { useState, useEffect } from "react";
import { getContractReadOnly, getSignerAddress, getContractWithSigner, hasWallet } from "@/lib/ethereum";
import { toast } from "sonner";

export default function UserPolicies() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);
  const [formData, setFormData] = useState({ premium: "", coverage: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMyPolicies = async () => {
    setIsLoading(true);
    try {
      const address = await getSignerAddress();
      const contract = getContractReadOnly();
      const count = await contract.policyCount();
      const fetched = [];
      // In InsuranceClaimSystem, ids start at 1
      for (let i = 1; i <= Number(count); i++) {
        const policy = await contract.policies(i);
        // policy.holder is the owner
        if (policy.holder.toLowerCase() === address.toLowerCase()) {
          fetched.push({
            id: policy.policyId.toString(),
            name: `Smart Policy #${policy.policyId.toString()}`,
            type: "Custom",
            coverage: `${policy.coverage.toString()} wei`,
            premium: `${policy.premium.toString()} wei`,
            startDate: "On-Chain", // Timestamp isn't saved in the new contract
            endDate: "N/A",
            status: policy.active ? "active" : "inactive",
            features: ["Blockchain Verified", "Transparent"],
          });
        }
      }
      setPolicies(fetched);
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to fetch policies: ${err.message || "Unknown Error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPolicies();
  }, []);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.premium || !formData.coverage) {
      toast.error("Please fill all fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const contract = await getContractWithSigner();
      const tx = await contract.createPolicy(BigInt(formData.premium), BigInt(formData.coverage));
      toast.info("Transaction submitted. Waiting for confirmation...");
      await tx.wait();
      toast.success("Policy purchased successfully!");
      setIsBuying(false);
      setFormData({ premium: "", coverage: "" });
      fetchMyPolicies();
    } catch (err: any) {
      console.error(err);
      toast.error(err.reason || err.message || "Failed to purchase policy");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UserLayout title="My Policies" subtitle="View, manage, and purchase new insurance policies on the blockchain.">
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-display font-semibold">Your Active Covers</h2>
            <Button variant="ghost" size="icon" onClick={fetchMyPolicies} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
          {hasWallet() ? (
            <Button onClick={() => setIsBuying(!isBuying)} className="bg-gradient-to-r from-primary to-secondary">
              {isBuying ? "Cancel Purchase" : "Purchase Policy"}
              {!isBuying && <Plus className="ml-2 h-4 w-4" />}
            </Button>
          ) : (
            <Button onClick={() => toast.error("Please install MetaMask to purchase a policy")} className="bg-muted text-muted-foreground">
              MetaMask Required
            </Button>
          )}
        </div>

        <AnimatePresence>
          {isBuying && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <GlassCard variant="glow" className="mb-6">
                <form onSubmit={handlePurchase} className="space-y-4">
                  <h3 className="font-semibold text-lg mb-4">Initialize New On-Chain Policy</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Standard Premium (in wei)</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 1000"
                        className="bg-muted/50"
                        value={formData.premium}
                        onChange={(e) => setFormData({ ...formData, premium: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Coverage (in wei)</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 50000"
                        className="bg-muted/50"
                        value={formData.coverage}
                        onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  {hasWallet() ? (
                    <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Sign & Create via MetaMask"}
                    </Button>
                  ) : (
                    <Button type="button" className="w-full md:w-auto bg-muted text-muted-foreground" onClick={() => toast.error("Please install MetaMask")}>
                      Install MetaMask to Continue
                    </Button>
                  )}
                </form>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {policies.length === 0 && !isLoading && (
          <p className="text-muted-foreground pt-4">No policies found for your connected wallet. Purchase one above!</p>
        )}

        {policies.map((policy, index) => (
          <motion.div
            key={policy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard variant="elevated" className="overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Policy Header */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Shield className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-semibold">{policy.name}</h3>
                        <p className="text-sm text-muted-foreground">ID: {policy.id}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium capitalize">
                      {policy.status}
                    </span>
                  </div>

                  <BlockchainBadge type="secured" className="mb-4" />

                  {/* Policy Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-xs">Coverage</span>
                      </div>
                      <p className="font-semibold">{policy.coverage}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-xs">Premium</span>
                      </div>
                      <p className="font-semibold">{policy.premium}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs">Start Date</span>
                      </div>
                      <p className="font-semibold">{policy.startDate}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs">End Date</span>
                      </div>
                      <p className="font-semibold">{policy.endDate}</p>
                    </div>
                  </div>

                  {/* Coverage Features */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-3">Verified By Smart Contract:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {policy.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                            <Check className="h-3 w-3 text-success" />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 lg:w-48">
                  <Link to="/user/submit-claim" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                      File a Claim
                    </Button>
                  </Link>
                  <Button variant="outline" className="justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Explorer View
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </UserLayout>
  );
}
