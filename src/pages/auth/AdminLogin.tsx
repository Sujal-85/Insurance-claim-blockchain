import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/GlassCard";
import { Shield, ArrowLeft, Mail, Lock, Eye, EyeOff, AlertTriangle, Key } from "lucide-react";
import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"credentials" | "mfa">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/admin-login', { email, password });
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user_role', 'ADMIN');
      toast.success("Login successful! Please verify MFA.");
      setStep("mfa");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-sidebar via-sidebar/90 to-security/80 p-12 flex-col justify-between">
        <div className="absolute inset-0 mesh-gradient opacity-20" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-security/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-2xl text-white block">RealtyCheck</span>
              <span className="text-xs text-sidebar-primary">Admin Portal</span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-display font-bold text-white leading-tight">
            Administrative Control Center
          </h2>
          <p className="text-white/70 text-lg">
            Secure access to claim management, policy administration, and blockchain controls.
          </p>
          
          <GlassCard className="bg-white/5 border-white/10 mt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">Restricted Access</p>
                <p className="text-sm text-white/60">
                  This portal is for authorized personnel only. All access attempts are logged and monitored.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-white/50 text-sm">
          <Lock className="h-4 w-4" />
          <span>Enterprise-grade security • SOC 2 Compliant</span>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/select-role">
            <Button variant="ghost" size="sm" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {step === "credentials" ? (
              <>
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-security/20 to-primary/20 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-security" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-display font-bold">Admin Login</h1>
                      <p className="text-sm text-muted-foreground">Secure administrative access</p>
                    </div>
                  </div>
                </div>

                {/* Warning Banner */}
                <div className="mb-6 p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Authorized Personnel Only</p>
                    <p className="text-xs text-muted-foreground">
                      Unauthorized access attempts will be reported.
                    </p>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@RealtyCheck.com"
                        className="pl-10 h-12 bg-muted/50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-12 bg-muted/50"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
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

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-security to-primary hover:opacity-90 mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Continue to Verification"}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success/20 to-primary/20 flex items-center justify-center">
                      <Key className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-display font-bold">Two-Factor Auth</h1>
                      <p className="text-sm text-muted-foreground">Enter your verification code</p>
                    </div>
                  </div>
                </div>

                <GlassCard className="mb-6">
                  <p className="text-sm text-muted-foreground">
                    A verification code has been sent to your authenticator app. Enter the 6-digit code below.
                  </p>
                </GlassCard>

                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mfa-code">Verification Code</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Input
                          key={i}
                          maxLength={1}
                          className="h-14 text-center text-2xl font-mono bg-muted/50"
                        />
                      ))}
                    </div>
                  </div>

                  <Link to="/admin/dashboard">
                    <Button className="w-full h-12 bg-gradient-to-r from-security to-primary hover:opacity-90 mt-4">
                      Verify & Sign In
                    </Button>
                  </Link>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setStep("credentials")}
                  >
                    Back to Login
                  </Button>
                </form>
              </>
            )}

            <p className="text-center text-xs text-muted-foreground mt-8">
              Access is monitored and logged for security compliance
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
