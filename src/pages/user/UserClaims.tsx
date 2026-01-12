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

const claims = [
  {
    id: "CLM-2024-001",
    type: "Auto Insurance",
    description: "Vehicle collision damage claim",
    amount: "$2,500",
    status: "processing" as const,
    date: "Jan 15, 2024",
    policyId: "POL-AUTO-2024",
    progress: 60,
  },
  {
    id: "CLM-2024-002",
    type: "Health Insurance",
    description: "Medical procedure reimbursement",
    amount: "$850",
    status: "approved" as const,
    date: "Jan 12, 2024",
    policyId: "POL-HEALTH-2024",
    progress: 100,
  },
  {
    id: "CLM-2024-003",
    type: "Property Insurance",
    description: "Water damage restoration",
    amount: "$5,200",
    status: "pending" as const,
    date: "Jan 10, 2024",
    policyId: "POL-PROP-2024",
    progress: 25,
  },
  {
    id: "CLM-2023-045",
    type: "Auto Insurance",
    description: "Windshield replacement",
    amount: "$450",
    status: "approved" as const,
    date: "Dec 5, 2023",
    policyId: "POL-AUTO-2024",
    progress: 100,
  },
  {
    id: "CLM-2023-032",
    type: "Health Insurance",
    description: "Annual health checkup",
    amount: "$200",
    status: "rejected" as const,
    date: "Nov 20, 2023",
    policyId: "POL-HEALTH-2024",
    progress: 100,
  },
];

const statusIcons = {
  pending: Clock,
  processing: Loader2,
  approved: CheckCircle,
  rejected: XCircle,
};

export default function UserClaims() {
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
          {claims.map((claim, index) => {
            const StatusIcon = statusIcons[claim.status];
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
          })}
        </TabsContent>

        {/* Other tabs would filter the claims */}
        <TabsContent value="pending">
          <GlassCard className="text-center py-12">
            <Clock className="h-12 w-12 text-warning mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Pending Claims</h3>
            <p className="text-muted-foreground">You have 1 claim awaiting initial review</p>
          </GlassCard>
        </TabsContent>

        <TabsContent value="processing">
          <GlassCard className="text-center py-12">
            <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <h3 className="font-semibold mb-2">Processing Claims</h3>
            <p className="text-muted-foreground">You have 1 claim being processed</p>
          </GlassCard>
        </TabsContent>

        <TabsContent value="approved">
          <GlassCard className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Approved Claims</h3>
            <p className="text-muted-foreground">You have 2 approved claims</p>
          </GlassCard>
        </TabsContent>

        <TabsContent value="rejected">
          <GlassCard className="text-center py-12">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Rejected Claims</h3>
            <p className="text-muted-foreground">You have 1 rejected claim</p>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </UserLayout>
  );
}
