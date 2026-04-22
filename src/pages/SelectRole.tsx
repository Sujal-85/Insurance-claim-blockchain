import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Shield, User, ShieldCheck, ArrowLeft, Wallet, Mail, Lock } from "lucide-react";

export default function SelectRole() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <img src="/logo.png" alt="RealtyCheck Logo" className="w-16 h-16 object-contain mx-auto mb-6" />
          <h1 className="text-4xl font-display font-bold mb-4">
            Welcome to RealtyCheck
          </h1>
          <p className="text-lg text-muted-foreground">
            Select your role to continue to the platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* User Role */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/login/user">
              <GlassCard
                variant="elevated"
                className="h-full cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  
                  <h2 className="text-2xl font-display font-bold mb-3">
                    Policy Holder
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Submit and track insurance claims, view your policies, and manage your account with complete transparency.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Wallet className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span>Connect with Wallet</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span>Sign in with Email</span>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Continue as User
                  </Button>
                </div>
              </GlassCard>
            </Link>
          </motion.div>

          {/* Admin Role */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/login/admin">
              <GlassCard
                variant="elevated"
                className="h-full cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-security/10 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150" />
                
                {/* Restricted Access Banner */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-warning/10 border border-warning/20">
                  <span className="text-xs font-medium text-warning">Restricted Access</span>
                </div>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-security/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-8 w-8 text-security" />
                  </div>
                  
                  <h2 className="text-2xl font-display font-bold mb-3">
                    Administrator
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Manage claims, review submissions, control smart contracts, and access administrative analytics.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-security/10 flex items-center justify-center">
                        <Lock className="h-3.5 w-3.5 text-security" />
                      </div>
                      <span>Secure Admin Login</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-security/10 flex items-center justify-center">
                        <ShieldCheck className="h-3.5 w-3.5 text-security" />
                      </div>
                      <span>Multi-factor Authentication</span>
                    </div>
                  </div>

                  <Button className="w-full bg-security hover:bg-security/90">
                    Continue as Admin
                  </Button>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          By continuing, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </div>
    </div>
  );
}
