import { UserLayout } from "@/components/layout/UserLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Wallet,
  Shield,
  Bell,
  Lock,
  Eye,
  Clock,
  CheckCircle,
  Copy,
  ExternalLink,
  Edit,
  Camera,
} from "lucide-react";

const loginHistory = [
  { device: "Chrome on Windows", location: "New York, US", date: "Jan 15, 2024 10:30 AM", current: true },
  { device: "Safari on iPhone", location: "New York, US", date: "Jan 14, 2024 8:15 PM", current: false },
  { device: "Chrome on MacBook", location: "Boston, US", date: "Jan 12, 2024 3:45 PM", current: false },
];

export default function UserProfile() {
  return (
    <UserLayout title="Profile & Security" subtitle="Manage your account settings and security preferences">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <GlassCard variant="elevated">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold">Personal Information</h2>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold">
                  JD
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center hover:bg-muted transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold">John Doe</h3>
                <p className="text-muted-foreground">Policy Holder since Jan 2023</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                    Verified Account
                  </span>
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    Trust Score: 92
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input value="john.doe@email.com" disabled className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input value="+1 (555) 123-4567" disabled className="bg-muted/50" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Input value="123 Main Street, New York, NY 10001" disabled className="bg-muted/50" />
              </div>
            </div>
          </GlassCard>

          {/* Wallet Connection */}
          <GlassCard variant="elevated">
            <h2 className="text-xl font-display font-semibold mb-6">Connected Wallet</h2>
            
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">MetaMask Wallet</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-muted-foreground font-mono">
                        0x742d...89ab
                      </code>
                      <button className="text-primary hover:text-primary/80">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs">
                    <CheckCircle className="h-3 w-3" /> Connected
                  </span>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Connect Different Wallet
            </Button>
          </GlassCard>

          {/* Security Settings */}
          <GlassCard variant="elevated">
            <h2 className="text-xl font-display font-semibold mb-6">Security Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Login Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified of new sign-ins</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Activity Visibility</p>
                    <p className="text-sm text-muted-foreground">Show blockchain activity publicly</p>
                  </div>
                </div>
                <Switch />
              </div>

              <Separator />

              <Button variant="outline" className="w-full">
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Summary */}
          <GlassCard variant="elevated">
            <h3 className="font-semibold mb-4">Account Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Account Status</span>
                <span className="px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">Jan 2023</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Active Policies</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Claims</span>
                <span className="font-medium">7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Approval Rate</span>
                <span className="font-medium text-success">85%</span>
              </div>
            </div>
          </GlassCard>

          {/* Login History */}
          <GlassCard variant="elevated">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Logins</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            
            <div className="space-y-4">
              {loginHistory.map((login, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    login.current ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                  }`}>
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{login.device}</p>
                      {login.current && (
                        <span className="text-xs text-success">Current</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{login.location}</p>
                    <p className="text-xs text-muted-foreground">{login.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Danger Zone */}
          <GlassCard className="border-destructive/30">
            <h3 className="font-semibold text-destructive mb-4">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10">
              Delete Account
            </Button>
          </GlassCard>
        </div>
      </div>
    </UserLayout>
  );
}
