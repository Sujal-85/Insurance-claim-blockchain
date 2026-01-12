import { UserLayout } from "@/components/layout/UserLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  FileText,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  DollarSign,
  AlertCircle,
  Image,
  File,
  Shield,
  Sparkles,
} from "lucide-react";

const steps = [
  { number: 1, title: "Policy Selection", description: "Choose your policy" },
  { number: 2, title: "Claim Details", description: "Describe the incident" },
  { number: 3, title: "Documentation", description: "Upload evidence" },
  { number: 4, title: "Review & Submit", description: "Confirm your claim" },
];

export default function SubmitClaim() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const addFile = () => {
    setUploadedFiles([...uploadedFiles, `document-${uploadedFiles.length + 1}.pdf`]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <UserLayout title="Submit New Claim" subtitle="File a new insurance claim with blockchain verification">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-medium transition-all ${
                    currentStep >= step.number
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
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
          {/* Step 1: Policy Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <GlassCard variant="elevated">
                <h2 className="text-xl font-display font-semibold mb-6">Select Policy</h2>
                
                <div className="space-y-4">
                  {[
                    { id: "POL-AUTO-2024", name: "Comprehensive Auto Insurance", coverage: "$50,000" },
                    { id: "POL-HEALTH-2024", name: "Premium Health Coverage", coverage: "$100,000" },
                    { id: "POL-PROP-2024", name: "Home & Property Insurance", coverage: "$250,000" },
                  ].map((policy) => (
                    <label
                      key={policy.id}
                      className="flex items-center gap-4 p-4 rounded-xl border-2 border-transparent bg-muted/30 hover:border-primary/30 cursor-pointer transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    >
                      <input type="radio" name="policy" className="sr-only" />
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{policy.name}</p>
                        <p className="text-sm text-muted-foreground">{policy.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{policy.coverage}</p>
                        <p className="text-xs text-muted-foreground">Max Coverage</p>
                      </div>
                    </label>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Step 2: Claim Details */}
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
                      <Select>
                        <SelectTrigger className="h-12 bg-muted/50">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accident">Vehicle Accident</SelectItem>
                          <SelectItem value="theft">Theft</SelectItem>
                          <SelectItem value="damage">Property Damage</SelectItem>
                          <SelectItem value="medical">Medical Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Incident Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input type="date" className="pl-10 h-12 bg-muted/50" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Claim Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input type="number" placeholder="Enter amount" className="pl-10 h-12 bg-muted/50" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Incident Description</Label>
                    <Textarea
                      placeholder="Provide a detailed description of the incident..."
                      className="min-h-[120px] bg-muted/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Location of Incident</Label>
                    <Input placeholder="Enter address or location" className="h-12 bg-muted/50" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Step 3: Documentation */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <GlassCard variant="elevated">
                <h2 className="text-xl font-display font-semibold mb-6">Upload Documentation</h2>
                
                {/* Upload Zone */}
                <div
                  onClick={addFile}
                  className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all mb-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Drag & Drop Files</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse your files
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: PDF, JPG, PNG • Max 10MB per file
                  </p>
                </div>

                {/* Uploaded Files */}
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
                            {file.endsWith('.pdf') ? (
                              <File className="h-5 w-5 text-primary" />
                            ) : (
                              <Image className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{file}</p>
                            <p className="text-xs text-muted-foreground">2.4 MB</p>
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

          {/* Step 4: Review & Submit */}
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
                  {/* Summary Cards */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">Policy</p>
                      <p className="font-medium">Comprehensive Auto Insurance</p>
                      <p className="text-xs text-muted-foreground">POL-AUTO-2024</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">Claim Amount</p>
                      <p className="font-medium text-xl">$2,500.00</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">Incident Type</p>
                      <p className="font-medium">Vehicle Accident</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">Incident Date</p>
                      <p className="font-medium">January 15, 2024</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="font-medium">
                      Minor collision at intersection. Another vehicle ran a red light and 
                      hit the front bumper of my car. Police report filed at scene.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-2">Attached Documents ({uploadedFiles.length || 3})</p>
                    <div className="flex flex-wrap gap-2">
                      {(uploadedFiles.length ? uploadedFiles : ["police-report.pdf", "damage-photo-1.jpg", "damage-photo-2.jpg"]).map((file, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                          {file}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AI Verification Notice */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">AI-Powered Verification</p>
                        <p className="text-sm text-muted-foreground">
                          Your claim will be instantly verified using our AI system and recorded 
                          on the blockchain for transparent processing.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Link to="/user/claims">
              <Button className="bg-gradient-to-r from-primary to-secondary">
                Submit Claim
                <Check className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
