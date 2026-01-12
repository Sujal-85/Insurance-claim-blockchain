import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { BlockchainBadge } from "@/components/ui/BlockchainBadge";
import {
  Shield,
  Blocks,
  FileCheck,
  Zap,
  Lock,
  Eye,
  ChevronRight,
  ArrowRight,
  Check,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Immutable Records",
    description: "Every claim is permanently recorded on the blockchain, ensuring tamper-proof documentation.",
  },
  {
    icon: Zap,
    title: "Instant Processing",
    description: "Smart contracts automate claim verification and payout, reducing processing time by 80%.",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    description: "Track your claim status in real-time with complete visibility into every processing step.",
  },
  {
    icon: Lock,
    title: "Bank-Grade Security",
    description: "Enterprise-level encryption and decentralized storage protect your sensitive data.",
  },
];

const stats = [
  { value: "99.9%", label: "Uptime" },
  { value: "<2min", label: "Avg. Processing" },
  { value: "50K+", label: "Claims Processed" },
  { value: "$2B+", label: "Total Payouts" },
];

const trustedBy = [
  "InsureTech Global",
  "SecureLife Corp",
  "TrustShield Inc",
  "BlockGuard Ltd",
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">ChainSure</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#security" className="text-muted-foreground hover:text-foreground transition-colors">
                Security
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/select-role">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/select-role">
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Blockchain Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <BlockchainBadge type="verified" className="mx-auto" />
              
              <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
                Insurance Claims on the{" "}
                <span className="gradient-text">Blockchain</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience the future of insurance with transparent, automated, and 
                secure claim processing powered by blockchain technology and AI verification.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link to="/select-role">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 h-14 rounded-xl">
                    Start Your Claim
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-xl border-2">
                  Watch Demo
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
            >
              {stats.map((stat, index) => (
                <GlassCard key={index} className="text-center py-6">
                  <p className="text-3xl font-display font-bold gradient-text">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </GlassCard>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <p className="text-sm text-muted-foreground font-medium">TRUSTED BY LEADING INSURERS</p>
            <div className="flex items-center gap-12 flex-wrap justify-center">
              {trustedBy.map((company, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-lg font-display font-semibold text-foreground/40 hover:text-foreground/60 transition-colors"
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-display font-bold mb-4">
              Why Choose ChainSure?
            </h2>
            <p className="text-lg text-muted-foreground">
              Built on cutting-edge blockchain technology to deliver unmatched 
              security, speed, and transparency.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard variant="elevated" className="h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-display font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple, transparent, and lightning-fast claim processing
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Submit Claim",
                description: "Upload your documents and submit your claim through our intuitive interface.",
                icon: FileCheck,
              },
              {
                step: "02",
                title: "AI Verification",
                description: "Our AI instantly verifies and validates your claim against policy terms.",
                icon: Blocks,
              },
              {
                step: "03",
                title: "Instant Payout",
                description: "Smart contracts automatically process approved claims for immediate payout.",
                icon: Zap,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <GlassCard variant="glow" className="text-center relative z-10">
                  <span className="text-6xl font-display font-bold text-primary/10 absolute top-4 left-4">
                    {item.step}
                  </span>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </GlassCard>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-0">
                    <ArrowRight className="h-8 w-8 text-primary/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-display font-bold mb-6">
                Enterprise-Grade Security & Compliance
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Your data is protected by the most advanced security measures in the industry, 
                with full regulatory compliance and transparency.
              </p>
              
              <div className="space-y-4">
                {[
                  "SOC 2 Type II Certified",
                  "GDPR & HIPAA Compliant",
                  "256-bit AES Encryption",
                  "Decentralized Data Storage",
                  "Real-time Fraud Detection",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                      <Check className="h-4 w-4 text-success" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <GlassCard variant="glow" className="p-8">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-security flex items-center justify-center">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Global Compliance</h3>
                      <p className="text-sm text-muted-foreground">195+ Countries Supported</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {["ISO 27001", "PCI DSS", "CCPA", "NIST"].map((cert, index) => (
                      <div
                        key={index}
                        className="bg-muted/50 rounded-xl p-4 text-center"
                      >
                        <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                        <span className="text-sm font-medium">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90" />
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto text-white"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to Transform Your Claims Experience?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of policyholders already benefiting from transparent, 
              blockchain-powered claim processing.
            </p>
            <Link to="/select-role">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 h-14 rounded-xl"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold">ChainSure</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2024 ChainSure. All rights reserved. Powered by blockchain technology.
            </p>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
