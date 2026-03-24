import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowLeft, Wallet, Mail, Lock, Eye, EyeOff, Check, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/lib/api";
import { toast } from "sonner";

export default function UserSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const steps = [
    { number: 1, title: "Account" },
    { number: 2, title: "Verify" },
    { number: 3, title: "Complete" },
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/signup", {
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        role: "USER"
      });
      
      localStorage.setItem("auth_token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setStep(3); // Skip email verification step for now to provide immediate access
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary via-primary/90 to-secondary p-12 flex-col justify-between">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center p-2">
               <img src="/logo.png" alt="RealtyCheck Logo" className="h-8 w-8 object-contain brightness-0 invert" />
            </div>
            <span className="font-display font-bold text-2xl text-white">RealtyCheck</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl font-display font-bold text-white leading-tight">
            Join the future of insurance
          </h2>
          
          <div className="space-y-4">
            {[
              "Transparent claim processing",
              "Blockchain-verified records",
              "Instant automated payouts",
              "24/7 real-time tracking",
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/90">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-white/60 text-sm">
          <Lock className="h-4 w-4" />
          <span>Your data is encrypted and secure</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/select-role">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                      step >= s.number
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s.number ? <Check className="h-5 w-5" /> : s.number}
                  </div>
                  <span className="text-xs mt-2 text-muted-foreground">{s.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${step > s.number ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {step === 1 && (
              <>
                <div className="mb-6">
                  <h1 className="text-3xl font-display font-bold mb-2">Create your account</h1>
                  <p className="text-muted-foreground">Start your blockchain insurance journey</p>
                </div>

                {/* Wallet Signup */}
                <GlassCard className="mb-6 cursor-pointer group" hover>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Wallet className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Connect Wallet</p>
                        <p className="text-sm text-muted-foreground">Fastest way to get started</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlassCard>

                <div className="flex items-center gap-4 my-6">
                  <Separator className="flex-1" />
                  <span className="text-sm text-muted-foreground">or use email</span>
                  <Separator className="flex-1" />
                </div>

                <form className="space-y-4" onSubmit={handleSignup}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        placeholder="John" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                        className="h-12 bg-muted/50" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Doe" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                        className="h-12 bg-muted/50" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className="pl-10 h-12 bg-muted/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                        className="pl-10 pr-10 h-12 bg-muted/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:underline">Terms of Service</a>
                      {" "}and{" "}
                      <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    {isLoading ? "Creating Account..." : "Continue"}
                  </Button>
                </form>
              </>
            )}

            {/* Step 2 (Verification) is handled by auto-transition to Step 3 in handleSignup for now */}

            {step === 3 && (
              <>
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="h-10 w-10 text-emerald-500" />
                  </motion.div>
                  <h1 className="text-3xl font-display font-bold mb-2">You're all set!</h1>
                  <p className="text-muted-foreground">Your account has been created successfully</p>
                </div>

                <GlassCard className="mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                      {formData.firstName[0]}{formData.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{formData.firstName} {formData.lastName}</p>
                      <p className="text-sm text-muted-foreground">{formData.email}</p>
                    </div>
                  </div>
                </GlassCard>

                <Link to="/user/dashboard">
                  <Button className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                    Go to Dashboard
                  </Button>
                </Link>
              </>
            )}

            {(step === 1) && (
              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link to="/login/user" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
