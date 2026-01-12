import { UserLayout } from "@/components/layout/UserLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BlockchainBadge } from "@/components/ui/BlockchainBadge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  CheckCircle,
  Loader2,
  Shield,
  Download,
  ExternalLink,
  Sparkles,
  Copy,
  Image,
  File,
} from "lucide-react";

const timelineSteps = [
  { title: "Claim Submitted", date: "Jan 15, 2024 • 10:30 AM", completed: true, icon: FileText },
  { title: "Documents Verified", date: "Jan 15, 2024 • 11:45 AM", completed: true, icon: CheckCircle },
  { title: "AI Risk Assessment", date: "Jan 15, 2024 • 12:00 PM", completed: true, icon: Sparkles },
  { title: "Blockchain Recorded", date: "Jan 15, 2024 • 12:05 PM", completed: true, icon: Shield },
  { title: "Under Review", date: "In Progress", completed: false, current: true, icon: Loader2 },
  { title: "Final Decision", date: "Pending", completed: false, icon: Clock },
];

const documents = [
  { name: "police-report.pdf", size: "2.4 MB", type: "pdf" },
  { name: "damage-photo-1.jpg", size: "1.8 MB", type: "image" },
  { name: "damage-photo-2.jpg", size: "2.1 MB", type: "image" },
  { name: "medical-report.pdf", size: "856 KB", type: "pdf" },
];

export default function ClaimDetails() {
  const { id } = useParams();

  return (
    <UserLayout>
      {/* Back Button & Header */}
      <div className="mb-6">
        <Link to="/user/claims">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Claims
          </Button>
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-display font-bold">{id || "CLM-2024-001"}</h1>
              <StatusBadge status="processing" />
            </div>
            <p className="text-muted-foreground">Vehicle collision damage claim</p>
          </div>
          <div className="flex items-center gap-3">
            <BlockchainBadge type="verified" />
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Claim Summary */}
          <GlassCard variant="elevated">
            <h2 className="text-lg font-semibold mb-4">Claim Summary</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Claim Amount</p>
                  <p className="text-xl font-bold">$2,500.00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Incident Date</p>
                  <p className="font-medium">January 15, 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Policy</p>
                  <p className="font-medium">POL-AUTO-2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">123 Main St, City</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/30">
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p>
                Minor collision at intersection. Another vehicle ran a red light and 
                hit the front bumper of my car. Police report was filed at the scene. 
                No injuries reported, only vehicle damage to front bumper and headlight assembly.
              </p>
            </div>
          </GlassCard>

          {/* AI Analysis */}
          <GlassCard variant="glow" className="border-primary/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">AI Verification Analysis</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                    <p className="text-xs text-muted-foreground mb-1">Document Authenticity</p>
                    <p className="font-semibold text-success">Verified ✓</p>
                  </div>
                  <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                    <p className="text-xs text-muted-foreground mb-1">Policy Coverage</p>
                    <p className="font-semibold text-success">Eligible ✓</p>
                  </div>
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
                    <p className="font-semibold text-warning">Low (18/100)</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI analysis complete. All submitted documents have been verified for authenticity. 
                  Claim appears to be within policy coverage limits. Recommended for approval.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Documents */}
          <GlassCard variant="elevated">
            <h2 className="text-lg font-semibold mb-4">Attached Documents</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {documents.map((doc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {doc.type === "pdf" ? (
                        <File className="h-5 w-5 text-primary" />
                      ) : (
                        <Image className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <GlassCard variant="elevated">
            <h2 className="text-lg font-semibold mb-4">Claim Timeline</h2>
            
            <div className="relative">
              {timelineSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 pb-6 last:pb-0"
                  >
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                          step.completed
                            ? "bg-success text-white"
                            : step.current
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${step.current ? "animate-spin" : ""}`} />
                      </div>
                      {index < timelineSteps.length - 1 && (
                        <div
                          className={`absolute top-10 w-0.5 h-full ${
                            step.completed ? "bg-success" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <p className={`font-medium ${step.current ? "text-primary" : ""}`}>
                        {step.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{step.date}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>

          {/* Blockchain Record */}
          <GlassCard variant="elevated" className="border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Blockchain Record</h3>
                <p className="text-xs text-muted-foreground">Immutable on-chain data</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono truncate">0x8f2b...4a9c</code>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Block Number</p>
                <code className="text-xs font-mono">18,452,391</code>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Network</p>
                <code className="text-xs font-mono">Ethereum Mainnet</code>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Explorer
            </Button>
          </GlassCard>
        </div>
      </div>
    </UserLayout>
  );
}
