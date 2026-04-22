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
  Clock,
  IndianRupee,
  ArrowUpRight,
  Loader2
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { toast } from "sonner";
import { getSignerAddress } from "@/lib/ethereum";

export default function UserProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string>("");

  const truncateAddress = (address: string) => {
    if (!address) return "0x00...000";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileRes, walletAddr] = await Promise.all([
          api.get('/auth/profile'),
          getSignerAddress()
        ]);
        setProfile(profileRes.data);
        setConnectedAddress(walletAddr);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > (profile?.balance || 0)) {
      toast.error("Insufficient balance");
      return;
    }

    setWithdrawLoading(true);
    try {
      const { signMessage } = await import("@/lib/ethereum");
      const message = `I authorize the withdrawal of ${formatCurrency(amount)} from my Secure Chain account at ${new Date().toISOString()}`;
      const signature = await signMessage(message);

      const response = await api.post('/auth/withdraw', { 
        amount,
        signature,
        message
      });
      toast.success(`Successfully withdrew ${formatCurrency(amount)}`);
      setProfile({ ...profile, balance: response.data.newBalance });
      setWithdrawAmount("");
      setShowWithdrawForm(false);
    } catch (error: any) {
      console.error("Withdrawal error:", error);
      toast.error(error.response?.data?.message || "Withdrawal failed");
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleLinkWallet = async () => {
    const address = await getSignerAddress();
    if (!address) {
      toast.error("Please connect your MetaMask wallet first");
      return;
    }

    try {
      const { signMessage } = await import("@/lib/ethereum");
      const message = `I authorize linking this wallet address ${address} to my Secure Chain profile at ${new Date().toISOString()}`;
      const signature = await signMessage(message);

      await api.patch('/auth/profile', { 
        walletAddress: address,
        signature,
        message
      });
      setProfile({ ...profile, walletAddress: address });
      setConnectedAddress(address);
      toast.success("Wallet linked to profile successfully!");
    } catch (error) {
      console.error("Error linking wallet:", error);
      toast.error("Failed to link wallet to profile");
    }
  };

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
                  <div className="text-sm font-mono text-muted-foreground">
                    {truncateAddress(connectedAddress || profile.walletAddress)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-success text-white">Connected</Badge>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button 
              className="w-full mt-6 bg-primary/10 text-primary hover:bg-primary/20 border-none"
              onClick={handleLinkWallet}
            >
              {profile.walletAddress ? "Update Linked Wallet" : "Link Current Wallet to Profile"}
            </Button>
          </GlassCard>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-8">
          {/* Balance Card */}
          <GlassCard variant="elevated">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Your Balance</h3>
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <IndianRupee className="h-5 w-5 text-success" />
              </div>
            </div>
            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-success">{formatCurrency(profile.balance || 0)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {(profile.balance || 0) > 0 ? "Available for withdrawal" : 
                 (profile.totalClaims || 0) === 0 ? "Submit a claim to start earning" : "No funds available for withdrawal"}
              </p>
            </div>
            
            {showWithdrawForm ? (
              <div className="space-y-3">
                <Input
                  type="number"
                  placeholder="Enter amount to withdraw"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-muted/30"
                />
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-success hover:bg-success/90" 
                    onClick={handleWithdraw}
                    disabled={withdrawLoading}
                  >
                    {withdrawLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowWithdrawForm(false)}
                    disabled={withdrawLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                className={`w-full ${(profile.balance || 0) > 0 ? 'bg-success hover:bg-success/90' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
                onClick={() => (profile.balance || 0) > 0 && setShowWithdrawForm(true)}
                disabled={(profile.balance || 0) <= 0}
              >
                <ArrowUpRight className="mr-2 h-4 w-4" />
                {(profile.balance || 0) > 0 ? "Withdraw Funds" : "Insufficient Funds"}
              </Button>
            )}
          </GlassCard>

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
