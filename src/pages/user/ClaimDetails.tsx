import { UserLayout } from "@/components/layout/UserLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BlockchainBadge } from "@/components/ui/BlockchainBadge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { analyzeClaim } from "@/lib/gemini";
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
  AlertCircle,
} from "lucide-react";

export default function ClaimDetails() {
  const { id } = useParams();
  const [claim, setClaim] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchClaimData = async () => {
      try {
        const response = await api.get(`/claims/${id}`);
        setClaim(response.data);
        
        // Load documents from localStorage
        const storedDocs = localStorage.getItem(`claim_docs_${id}`);
        if (storedDocs) {
          setDocuments(JSON.parse(storedDocs));
        }

        // Trigger AI analysis
        performAIAnalysis(response.data);
      } catch (error) {
        console.error("Error fetching claim details:", error);
        toast.error("Failed to load claim details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchClaimData();
  }, [id]);

  const performAIAnalysis = async (claimData: any) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeClaim(claimData);
      setAiAnalysis(result);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = async () => {
    if (!exportRef.current) return;
    
    toast.info("Generating your claim report...");
    try {
      const canvas = await html2canvas(exportRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Claim_Report_${id}.pdf`);
      toast.success("Claim report exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export report.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </UserLayout>
    );
  }

  if (!claim) {
    return (
      <UserLayout>
        <div className="text-center py-20">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Claim Not Found</h2>
          <Link to="/user/claims">
            <Button variant="outline">Back to Claims</Button>
          </Link>
        </div>
      </UserLayout>
    );
  }

  const timelineSteps = [
    { title: "Claim Submitted", date: new Date(claim.createdAt).toLocaleString(), completed: true, icon: FileText },
    { title: "Documents Stored", date: "Verified Immutable", completed: true, icon: CheckCircle },
    { title: "AI Risk Assessment", date: aiAnalysis ? "Analysis Complete" : "In Progress", completed: !!aiAnalysis, current: isAnalyzing, icon: Sparkles },
    { title: "Blockchain Recorded", date: claim.blockchainTxHash ? "Immutable Proof Secured" : "Pending Record", completed: !!claim.blockchainTxHash, icon: Shield },
    { title: "Final Review", date: claim.status === "PENDING" ? "Processing" : "Completed", completed: claim.status !== "PENDING", current: claim.status === "PENDING", icon: Loader2 },
  ];

  return (
    <UserLayout>
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
              <h1 className="text-3xl font-display font-bold">Claim #{id?.slice(-8).toUpperCase() || "Details"}</h1>
              <StatusBadge status={claim.status.toLowerCase()} />
            </div>
            <p className="text-muted-foreground">{claim.incidentType.toUpperCase()} - Reference: {id}</p>
          </div>
          <div className="flex items-center gap-3">
            <BlockchainBadge type={claim.blockchainTxHash ? "verified" : "pending"} />
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Record
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8" ref={exportRef}>
        <div className="lg:col-span-2 space-y-6">
          <GlassCard variant="elevated">
            <h2 className="text-lg font-semibold mb-4">Claim Overview</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Requested Amount</p>
                  <p className="text-xl font-bold">${claim.amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Incident Date</p>
                  <p className="font-medium">{new Date(claim.incidentDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Policy Association</p>
                  <p className="font-medium">{claim.userPolicy?.policy?.policyName || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{claim.location}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/30">
              <p className="text-sm text-muted-foreground mb-2">Detailed Narrative</p>
              <p className="text-sm leading-relaxed">
                {claim.description}
              </p>
            </div>
          </GlassCard>

          <GlassCard variant="glow" className={`border-primary/20 ${!aiAnalysis && "animate-pulse"}`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">AI-Driven Risk & Integrity Assessment</h3>
                {isAnalyzing ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" /> Analyzing claim narrative and documentation...
                    </p>
                  </div>
                ) : aiAnalysis ? (
                  <>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                        <p className="text-xs text-muted-foreground mb-1">Authenticity</p>
                        <p className="font-semibold text-success">{aiAnalysis.authenticity}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                        <p className="text-xs text-muted-foreground mb-1">Policy Coverage</p>
                        <p className="font-semibold text-success">{aiAnalysis.policyCoverage}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                        <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
                        <p className="font-semibold text-warning">{aiAnalysis.riskScore}/100</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {aiAnalysis.analysis}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Analysis not yet performed.</p>
                )}
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="elevated">
            <h2 className="text-lg font-semibold mb-4">Supporting Evidence ({documents.length})</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {documents.length > 0 ? (
                documents.map((doc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        {doc.type === "pdf" ? <File className="h-5 w-5 text-primary" /> : <Image className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="max-w-[150px]">
                        <p className="font-medium text-sm truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={doc.content} download={doc.name}>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-muted-foreground italic bg-muted/10 rounded-xl border border-dashed">
                  No digital evidence attached to this claim.
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard variant="elevated">
            <h2 className="text-lg font-semibold mb-4">Verification Timeline</h2>
            <div className="relative">
              {timelineSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4 pb-6 last:pb-0"
                  >
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                          step.completed ? "bg-success text-white" : step.current ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${step.current ? "animate-spin" : ""}`} />
                      </div>
                      {index < timelineSteps.length - 1 && (
                        <div className={`absolute top-10 w-0.5 h-full ${step.completed ? "bg-success" : "bg-muted"}`} />
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${step.current ? "text-primary" : ""}`}>{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.date}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard variant="elevated" className="border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Trust & Verification</h3>
                <p className="text-xs text-muted-foreground">Secured via Smart Contract</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Blockchain Security ID</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono truncate">{claim.blockchainTxHash || "Not yet recorded"}</code>
                  {claim.blockchainTxHash && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(claim.blockchainTxHash)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Immutable Ledger Order</p>
                <code className="text-xs font-mono">#{claim.id.slice(-6).toUpperCase()}</code>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Network</p>
                <code className="text-xs font-mono">SecureChain Protocol v2.1</code>
              </div>
            </div>

            {claim.blockchainTxHash && (
              <Button variant="outline" className="w-full mt-4" size="sm" asChild>
                <a href={`https://etherscan.io/tx/${claim.blockchainTxHash}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Public Verification
                </a>
              </Button>
            )}
          </GlassCard>
        </div>
      </div>
    </UserLayout>
  );
}

