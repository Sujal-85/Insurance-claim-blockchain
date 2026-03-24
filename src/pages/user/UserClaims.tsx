import { UserLayout } from "@/components/layout/UserLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BlockchainBadge } from "@/components/ui/BlockchainBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  FileText,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  DollarSign,
} from "lucide-react";

import { useState, useEffect } from "react";
import { getContractReadOnly, getSignerAddress } from "@/lib/ethereum";
import { toast } from "sonner";

const statusIcons = {
  pending: Clock,
  processing: Loader2,
  approved: CheckCircle,
  rejected: XCircle,
};

export default function UserClaims() {
  const [claims, setClaims] = useState<any[]>([]);

  useEffect(() => {
    const fetchMyClaims = async () => {
      try {
        const address = await getSignerAddress();
        const contract = getContractReadOnly();
        const count = await contract.claimCount();
        const fetched = [];

        for (let i = 1; i <= Number(count); i++) {
          const claim = await contract.claims(i);
          if (claim.claimant.toLowerCase() === address.toLowerCase()) {
            let statusString = "pending";
            let progress = 25;
            if (claim.processed && claim.approved) { statusString = "approved"; progress = 100; }
            if (claim.processed && !claim.approved) { statusString = "rejected"; progress = 100; }

            fetched.push({
              id: claim.claimId.toString(),
              type: "Blockchain Claim",
              description: claim.reason || "Incident reported",
              amount: "N/A", // Amount not applicable in new contract schema
              status: statusString as any,
              date: "On-Chain",
              policyId: claim.policyId.toString(),
              progress,
            });
          }
        }
        setClaims(fetched);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch claims");
      }
    };
    fetchMyClaims();
  }, []);
  return (
    <UserLayout title="My Claims" subtitle="Track and manage all your insurance claims">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search claims by ID or description..."
            className="pl-10 h-12 bg-card"
          />
        </div>
        <Button variant="outline" className="h-12">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
        <Link to="/user/submit-claim">
          <Button className="h-12 bg-gradient-to-r from-primary to-secondary">
            New Claim
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="all">All Claims</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {claims.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="text-center py-16">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                  className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center relative"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <FileText className="h-10 w-10 text-primary" />
                  </motion.div>
                </motion.div>
                <h3 className="text-2xl font-semibold mb-3 font-display">No Claims Found</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                  There are currently no records tied to your account. Securely submit your first blockchain-verified claim today.
                </p>
                <Link to="/user/submit-claim">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary shadow-lg hover:shadow-primary/25 transition-all">
                    Submit New Claim
                  </Button>
                </Link>
              </GlassCard>
            </motion.div>
          ) : (
            claims.map((claim, index) => {
              const StatusIcon = statusIcons[claim.status as keyof typeof statusIcons];
              return (
                <motion.div
                  key={claim.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                <Link to={`/user/claims/${claim.id}`}>
                  <GlassCard className="hover:border-primary/30 cursor-pointer transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Claim Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          claim.status === "approved" ? "bg-success/10" :
                          claim.status === "rejected" ? "bg-destructive/10" :
                          claim.status === "processing" ? "bg-primary/10" :
                          "bg-warning/10"
                        }`}>
                          <StatusIcon className={`h-6 w-6 ${
                            claim.status === "approved" ? "text-success" :
                            claim.status === "rejected" ? "text-destructive" :
                            claim.status === "processing" ? "text-primary animate-spin" :
                            "text-warning"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold">{claim.id}</h3>
                            <StatusBadge status={claim.status} size="sm" showIcon={false} />
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{claim.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText className="h-3.5 w-3.5" />
                              {claim.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {claim.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Amount & Progress */}
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Claim Amount</p>
                          <p className="text-xl font-bold font-display">{claim.amount}</p>
                        </div>

                        {claim.status !== "rejected" && (
                          <div className="w-32">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{claim.progress}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${claim.progress}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className={`h-full rounded-full ${
                                  claim.status === "approved" 
                                    ? "bg-success" 
                                    : "bg-gradient-to-r from-primary to-secondary"
                                }`}
                              />
                            </div>
                          </div>
                        )}

                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })
          )}
        </TabsContent>

        {/* Other tabs would filter the claims */}
        <TabsContent value="pending">
          <GlassCard className="text-center py-12">
            <Clock className="h-12 w-12 text-warning mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Pending Claims</h3>
            <p className="text-muted-foreground">You have {claims.filter(c => c.status === "pending").length} claim(s) awaiting initial review</p>
          </GlassCard>
        </TabsContent>

        <TabsContent value="processing">
          <GlassCard className="text-center py-12">
            <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <h3 className="font-semibold mb-2">Processing Claims</h3>
            <p className="text-muted-foreground">You have {claims.filter(c => c.status === "processing").length} claim(s) being processed</p>
          </GlassCard>
        </TabsContent>

        <TabsContent value="approved">
          <GlassCard className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Approved Claims</h3>
            <p className="text-muted-foreground">You have {claims.filter(c => c.status === "approved").length} approved claim(s)</p>
          </GlassCard>
        </TabsContent>

        <TabsContent value="rejected">
          <GlassCard className="text-center py-12">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Rejected Claims</h3>
            <p className="text-muted-foreground">You have {claims.filter(c => c.status === "rejected").length} rejected claim(s)</p>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </UserLayout>
  );
}
