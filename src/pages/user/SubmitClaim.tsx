import { UserLayout } from "@/components/layout/UserLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "sonner";
import { ethers } from "ethers";
import SecureChainABI from "@/lib/SecureChain.json";
import { formatCurrency } from "@/lib/utils";
import {
  Upload,
  FileText,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  IndianRupee,
  AlertCircle,
  Image,
  File,
  Shield,
  Sparkles,
  Wallet,
} from "lucide-react";

const steps = [
  { number: 1, title: "Policy Selection", description: "Choose your policy" },
  { number: 2, title: "Claim Details", description: "Describe the incident" },
  { number: 3, title: "Documentation", description: "Upload evidence" },
  { number: 4, title: "Review & Submit", description: "Confirm your claim" },
];

const incidentTypesByCategory: Record<string, { value: string; label: string }[]> = {
  Auto: [
    { value: "accident", label: "Vehicle Accident" },
    { value: "theft", label: "Theft / Stolen Vehicle" },
    { value: "vandalism", label: "Vandalism" },
    { value: "fire", label: "Fire Damage" },
    { value: "natural_disaster", label: "Natural Disaster (Flood, Storm)" },
    { value: "collision", label: "Collision" },
  ],
  Health: [
    { value: "medical_emergency", label: "Medical Emergency" },
    { value: "hospitalization", label: "Hospitalization" },
    { value: "surgery", label: "Surgery" },
    { value: "accident", label: "Accident Injury" },
    { value: "illness", label: "Critical Illness" },
  ],
  Property: [
    { value: "fire", label: "Fire Damage" },
    { value: "flood", label: "Flood Damage" },
    { value: "theft", label: "Theft / Burglary" },
    { value: "vandalism", label: "Vandalism" },
    { value: "natural_disaster", label: "Natural Disaster" },
    { value: "water_damage", label: "Water Damage" },
  ],
  Life: [
    { value: "death", label: "Death" },
    { value: "disability", label: "Permanent Disability" },
    { value: "critical_illness", label: "Critical Illness Diagnosis" },
  ],
  Travel: [
    { value: "trip_cancellation", label: "Trip Cancellation" },
    { value: "medical_emergency", label: "Medical Emergency Abroad" },
    { value: "lost_baggage", label: "Lost / Delayed Baggage" },
    { value: "flight_delay", label: "Flight Delay / Cancellation" },
    { value: "theft", label: "Theft During Travel" },
  ],
  default: [
    { value: "accident", label: "Accident" },
    { value: "theft", label: "Theft" },
    { value: "damage", label: "Damage" },
    { value: "other", label: "Other" },
  ],
};

export default function SubmitClaim() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, size: string, type: string, content: string}[]>([]);
  const [userPolicies, setUserPolicies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPolicyLoading, setIsPolicyLoading] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    policyId: "",
    incidentType: "",
    incidentDate: "",
    amount: 0,
    description: "",
    location: "",
  });

  useEffect(() => {
    const fetchUserPolicies = async () => {
      try {
        const response = await api.get('/policies/user/my-policies');
        setUserPolicies(response.data);
      } catch (error) {
        console.error("Error fetching user policies:", error);
        toast.error("Failed to load your policies");
      } finally {
        setIsPolicyLoading(false);
      }
    };
    fetchUserPolicies();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUploadedFiles(prev => [...prev, {
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: file.type.includes('pdf') ? 'pdf' : 'image',
          content: base64String
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const getSelectedPolicy = () => {
    return userPolicies.find((up) => up.policy.id === formData.policyId)?.policy;
  };

  const validateClaimAmount = () => {
    const policy = getSelectedPolicy();
    if (!policy) return { valid: false, message: "Please select a policy" };
    
    if (!formData.amount || formData.amount <= 0) {
      return { valid: false, message: "Please enter a valid claim amount" };
    }
    
    if (formData.amount > policy.coverageAmount) {
      return { 
        valid: false, 
        message: `Claim amount (${formatCurrency(formData.amount)}) exceeds policy coverage (${formatCurrency(policy.coverageAmount)})` 
      };
    }
    
    return { valid: true, message: "" };
  };

  const handleSubmit = async () => {
    const validation = validateClaimAmount();
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    setIsLoading(true);
    let txHash = "";
    let blockchainClaimId = "";

    try {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const userAddress = await signer.getAddress();
          console.log("Using wallet address:", userAddress);

          const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
          const contract = new ethers.Contract(contractAddress, (SecureChainABI as any).abi, signer);

          toast.info("Please confirm the transaction in MetaMask...");
          
          blockchainClaimId = `CLAIM-${Date.now()}`;
          const amountInWei = ethers.parseEther(formData.amount.toString() || "0");

          const tx = await contract.submitClaim(
            blockchainClaimId,
            formData.policyId,
            amountInWei
          );

          toast.info("Transaction submitted. Waiting for confirmation...");
          const receipt = await tx.wait();
          txHash = receipt.hash;
          toast.success("Blockchain transaction confirmed!");
        } catch (blockchainError: any) {
          console.error("Blockchain detailed error:", blockchainError);
          const errorMessage = blockchainError.reason || blockchainError.message || "Unknown blockchain error";
          
          if (blockchainError.code === 4001 || errorMessage.toLowerCase().includes("rejected")) {
            toast.error("Transaction was rejected in MetaMask.");
            setIsLoading(false);
            return;
          }
          
          toast.info(`Blockchain verification failed: ${errorMessage}. Continuing with database submission...`);
        }
      } else {
        toast.info("MetaMask not found. Claim will only be recorded in the database.");
      }

      const payload = {
        policyId: formData.policyId,
        amount: Number(formData.amount),
        description: String(formData.description || "No description"),
        incidentType: String(formData.incidentType || "accident"),
        incidentDate: formData.incidentDate ? new Date(formData.incidentDate).toISOString() : new Date().toISOString(),
        location: String(formData.location || "Unknown"),
        blockchainTxHash: txHash || undefined,
        blockchainClaimId: blockchainClaimId || undefined
      };

      try {
        const response = await api.post('/claims', payload);
        const newClaim = response.data.claim;
        
        // Save documents to localStorage associated with the claim ID
        if (uploadedFiles.length > 0) {
          localStorage.setItem(`claim_docs_${newClaim.id}`, JSON.stringify(uploadedFiles));
        }

        toast.success("Claim submitted successfully!");
        setCurrentStep(4);
      } catch (error: any) {
        console.error("Backend Error:", error);
        const backendMessage = error.response?.data?.message;
        toast.error(backendMessage || "Failed to submit claim.");
      }
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPolicy = userPolicies.find(up => up.policy.id === formData.policyId);

  return (
    <UserLayout title="Submit New Claim" subtitle="File a new insurance claim with blockchain verification">
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-medium transition-all ${
                    currentStep >= step.number
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                  animate={{ scale: currentStep === step.number ? 1.1 : 1 }}
                >
                  {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
                </motion.div>
                <div className="text-center mt-2 hidden md:block">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 lg:w-32 h-0.5 mx-2 ${currentStep > step.number ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <GlassCard variant="elevated">
                <h2 className="text-xl font-display font-semibold mb-6">Select Policy</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isPolicyLoading ? (
                    <div className="col-span-2 text-center py-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-sm text-muted-foreground mt-2">Loading your policies...</p>
                    </div>
                  ) : userPolicies.length > 0 ? (
                    userPolicies.map((up) => (
                      <div
                        key={up.id}
                        onClick={() => setFormData({ ...formData, policyId: up.policy.id, incidentType: "" })}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.policyId === up.policy.id
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/30 bg-card"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold">{up.policy.policyName}</h4>
                          {formData.policyId === up.policy.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{up.policy.category} • ID: {up.policy.id}</p>
                        <div className="flex justify-between text-xs font-medium">
                          <span>Max Coverage</span>
                          <span>{formatCurrency(up.policy.coverageAmount)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-10 bg-muted/20 rounded-xl border-2 border-dashed border-muted">
                      <p className="text-sm text-muted-foreground">No active policies found.</p>
                      <Link to="/user/policies" className="text-primary text-sm font-medium hover:underline mt-2 inline-block">
                        Purchase a policy first
                      </Link>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <GlassCard variant="elevated">
                <h2 className="text-xl font-display font-semibold mb-6">Claim Details</h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Incident Type</Label>
                      <Select 
                        value={formData.incidentType} 
                        onValueChange={(value) => setFormData({ ...formData, incidentType: value })}
                      >
                        <SelectTrigger className="h-12 bg-muted/50">
                          <SelectValue placeholder={getSelectedPolicy() ? "Select type" : "Select a policy first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {(incidentTypesByCategory[getSelectedPolicy()?.category] || incidentTypesByCategory.default).map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {getSelectedPolicy() && (
                        <p className="text-xs text-muted-foreground">
                          Based on {getSelectedPolicy()?.category} policy
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Incident Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                          type="date" 
                          className="pl-10 h-12 bg-muted/50" 
                          value={formData.incidentDate}
                          onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Claim Amount</Label>
                      {getSelectedPolicy() && (
                        <span className="text-xs text-muted-foreground">
                          Max: {formatCurrency(getSelectedPolicy()?.coverageAmount || 0)}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                        type="number" 
                        placeholder="Enter amount" 
                        className={`pl-10 h-12 bg-muted/50 ${formData.amount > (getSelectedPolicy()?.coverageAmount || 0) && formData.amount > 0 ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                        value={formData.amount || ''}
                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                      />
                    </div>
                    {formData.amount > (getSelectedPolicy()?.coverageAmount || 0) && formData.amount > 0 && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Amount exceeds policy coverage of {formatCurrency(getSelectedPolicy()?.coverageAmount || 0)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Incident Description</Label>
                    <Textarea
                      placeholder="Provide a detailed description of the incident..."
                      className="min-h-[120px] bg-muted/50"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Location of Incident</Label>
                    <Input 
                      placeholder="Enter address or location" 
                      className="h-12 bg-muted/50" 
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <GlassCard variant="elevated">
                <h2 className="text-xl font-display font-semibold mb-6">Upload Documentation</h2>
                <div
                  className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all mb-6 relative"
                >
                  <input
                    type="file"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                  />
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Drag & Drop Files</h3>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse your files</p>
                  <p className="text-xs text-muted-foreground">Supported formats: PDF, JPG, PNG • Max 10MB per file</p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Uploaded Files ({uploadedFiles.length})</p>
                    {uploadedFiles.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            {file.type === 'pdf' ? <File className="h-5 w-5 text-primary" /> : <Image className="h-5 w-5 text-primary" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-success flex items-center gap-1">
                            <Check className="h-3 w-3" /> Uploaded
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="mt-6 p-4 rounded-xl bg-muted/30">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Required Documents</p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• Police report (if applicable)</li>
                        <li>• Photos of damage/incident</li>
                        <li>• Medical reports or bills</li>
                        <li>• Any other supporting evidence</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <GlassCard variant="elevated">
                <h2 className="text-xl font-display font-semibold mb-6">Review Your Claim</h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">Policy</p>
                      <p className="font-medium">{selectedPolicy?.policy.policyName || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">{formData.policyId}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">Claim Amount</p>
                      <p className="font-medium text-xl">{formatCurrency(formData.amount)}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-2">Incident Details</p>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="text-muted-foreground">Type:</span> {formData.incidentType}</p>
                      <p className="text-sm"><span className="text-muted-foreground">Date:</span> {formData.incidentDate}</p>
                      <p className="text-sm"><span className="text-muted-foreground">Location:</span> {formData.location}</p>
                      <p className="text-sm line-clamp-2"><span className="text-muted-foreground">Description:</span> {formData.description}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-2">Attached Documents ({uploadedFiles.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {uploadedFiles.map((file, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                          {file.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">AI-Powered Verification</p>
                        <p className="text-sm text-muted-foreground">
                          Your claim will be instantly verified using our AI system and recorded on the blockchain for transparent processing.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1 || isLoading}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={() => {
                if (currentStep === 2) {
                  const validation = validateClaimAmount();
                  if (!validation.valid) {
                    toast.error(validation.message);
                    return;
                  }
                }
                setCurrentStep(Math.min(4, currentStep + 1));
              }}
              disabled={currentStep === 1 && !formData.policyId}
              className="bg-primary hover:bg-primary/90"
            >
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              className="bg-primary hover:bg-primary/90" 
              onClick={handleSubmit}
              disabled={isLoading || !formData.policyId}
            >
              {isLoading ? "Submitting..." : "Submit Claim"}
              <Check className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
