import { UserLayout } from "@/components/layout/UserLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
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
} from "lucide-react";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

const statusIcons = {
  pending: Clock,
  processing: Loader2,
  approved: CheckCircle,
  rejected: XCircle,
};

export default function UserClaims() {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyClaims = async () => {
      try {
        setLoading(true);
        const response = await api.get('/claims/my-claims');
        
        const mappedClaims = response.data.map((claim: any) => ({
          id: claim.id,
          type: claim.userPolicy?.policy?.policyName || "Insurance Claim",
          description: claim.description || "Incident reported",
          amount: `$${claim.amount.toLocaleString()}`,
          status: claim.status.toLowerCase(),
          date: new Date(claim.createdAt).toLocaleDateString(),
          policyId: claim.userPolicy?.policy?.id || "N/A",
          progress: claim.status === 'APPROVED' ? 100 : (claim.status === 'REJECTED' ? 100 : 50),
        }));

        setClaims(mappedClaims);
      } catch (err) {
        console.error("Error fetching claims:", err);
        toast.error("Failed to fetch claims from server");
      } finally {
        setLoading(false);
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
          <Button className="h-12 bg-gradient-to-r from-primary to-secondary text-white">
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
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : claims.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 font-display">No Claims Found</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                  There are currently no records tied to your account. Securely submit your first blockchain-verified claim today.
                </p>
                <Link to="/user/submit-claim">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/25 transition-all">
                    Submit New Claim
                  </Button>
                </Link>
              </GlassCard>
            </motion.div>
          ) : (
            claims.map((claim, index) => {
              const StatusIcon = statusIcons[claim.status as keyof typeof statusIcons] || Clock;
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
                              <h3 className="font-semibold text-sm truncate max-w-[150px]">{claim.id}</h3>
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

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Claim Amount</p>
                            <p className="text-xl font-bold font-display">{claim.amount}</p>
                          </div>

                          {claim.status !== "rejected" && (
                            <div className="w-32 hidden md:block">
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
