import { UserLayout } from "@/components/layout/UserLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { BlockchainBadge } from "@/components/ui/BlockchainBadge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Shield,
  Calendar,
  DollarSign,
  FileText,
  Check,
  AlertTriangle,
  ChevronRight,
  Download,
} from "lucide-react";

const policies = [
  {
    id: "POL-AUTO-2024",
    name: "Comprehensive Auto Insurance",
    type: "Auto",
    coverage: "$50,000",
    premium: "$125/month",
    startDate: "Jan 1, 2024",
    endDate: "Dec 31, 2024",
    status: "active",
    features: ["Collision Coverage", "Liability Protection", "Medical Payments", "Roadside Assistance"],
  },
  {
    id: "POL-HEALTH-2024",
    name: "Premium Health Coverage",
    type: "Health",
    coverage: "$100,000",
    premium: "$350/month",
    startDate: "Mar 1, 2024",
    endDate: "Feb 28, 2025",
    status: "active",
    features: ["Hospital Care", "Prescription Drugs", "Mental Health", "Preventive Care"],
  },
  {
    id: "POL-PROP-2024",
    name: "Home & Property Insurance",
    type: "Property",
    coverage: "$250,000",
    premium: "$200/month",
    startDate: "Jun 15, 2024",
    endDate: "Jun 14, 2025",
    status: "active",
    features: ["Dwelling Coverage", "Personal Property", "Liability Protection", "Natural Disasters"],
  },
];

export default function UserPolicies() {
  return (
    <UserLayout title="My Policies" subtitle="View and manage your insurance policies">
      <div className="space-y-6">
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
                        <p className="text-sm text-muted-foreground">{policy.id}</p>
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
                    <p className="text-sm font-medium text-muted-foreground mb-3">Coverage Includes:</p>
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
                  <Button variant="outline" className="justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    View Details
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    File a Claim
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}

        {/* Renewal Notice */}
        <GlassCard className="border-warning/30 bg-warning/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Policy Renewal Reminder</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your Auto Insurance policy (POL-AUTO-2024) is expiring on Dec 31, 2024. 
                Renew now to maintain continuous coverage.
              </p>
              <Button variant="outline" size="sm" className="border-warning text-warning hover:bg-warning/10">
                Renew Policy
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </UserLayout>
  );
}
