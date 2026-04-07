import { UserLayout } from "@/components/layout/UserLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Shield, 
  History,
  ExternalLink,
  Wallet,
  Edit,
  Clock
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { toast } from "sonner";

export default function UserProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/profile');
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading || !profile) {
    return (
      <UserLayout title="Profile & Security" subtitle="Loading your profile...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout title="Profile & Security" subtitle="Manage your account settings and security preferences">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-8">
          <GlassCard variant="elevated">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-xl font-bold">Personal Information</h3>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-primary flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    profile.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || "U"
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center shadow-lg hover:bg-muted transition-colors">
                  <Camera className="h-5 w-5 text-primary" />
                </button>
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-display font-bold mb-1">{profile.name || "User"}</h2>
                <div className="text-muted-foreground mb-4">Policy Holder since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-success/10 text-success border-none">Verified Account</Badge>
                  <Badge variant="outline" className="border-primary/20 text-primary">Trust Score: {profile.trustScore || 92}</Badge>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" /> Email Address
                </Label>
                <Input value={profile.email} readOnly className="bg-muted/30" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" /> Phone Number
                </Label>
                <Input value={profile.phoneNumber || "Not provided"} readOnly className="bg-muted/30" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" /> Address
                </Label>
                <Input value={profile.address || "Not provided"} readOnly className="bg-muted/30" />
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="elevated">
            <h3 className="text-xl font-bold mb-6">Connected Wallet</h3>
            <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-white">
                  <Wallet className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="font-bold">MetaMask Wallet</h4>
                  <div className="text-sm font-mono text-muted-foreground">{profile.walletAddress || "0x00...000"}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-success text-white">Connected</Badge>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button className="w-full mt-6 bg-primary/10 text-primary hover:bg-primary/20 border-none">
              Connect Different Wallet
            </Button>
          </GlassCard>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-8">
          <GlassCard variant="elevated">
            <h3 className="text-lg font-bold mb-6">Account Summary</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Account Status</span>
                <Badge className="bg-success/10 text-success">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Member Since</span>
                <span className="font-bold">{new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Active Policies</span>
                <span className="font-bold">{profile.activePolicies}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Total Claims</span>
                <span className="font-bold">{profile.totalClaims}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <span className="text-muted-foreground text-sm">Approval Rate</span>
                <span className="font-bold text-success">{profile.approvalRate}%</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="elevated">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Recent Logins</h3>
              <Button variant="link" size="sm" className="text-primary p-0">View All</Button>
            </div>
            <div className="space-y-4">
              {[
                { device: "Chrome on Windows", location: "New York, US", time: "Jan 15, 2024 10:30 AM", current: true },
                { device: "Safari on iPhone", location: "New York, US", time: "Jan 14, 2024 8:15 PM", current: false },
                { device: "Chrome on MacBook", location: "Boston, US", time: "Jan 12, 2024 3:45 PM", current: false },
              ].map((login, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <History className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">
                      {login.device}
                      {login.current && <Badge className="ml-2 bg-success/10 text-success text-[8px] h-4">Current</Badge>}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{login.location}</div>
                    <div className="text-[10px] text-muted-foreground">{login.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </UserLayout>
  );
}
