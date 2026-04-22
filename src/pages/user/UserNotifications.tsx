import { UserLayout } from "@/components/layout/UserLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Shield,
  FileText,
  IndianRupee,
  Settings,
  Trash2,
} from "lucide-react";

import { useState, useEffect } from "react";
import { getContractReadOnly, getSignerAddress } from "@/lib/ethereum";

export default function UserNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const address = await getSignerAddress();
        if (!address) return;

        const contract = getContractReadOnly();
        const provider = contract.runner?.provider;
        const contractAddress = await contract.getAddress();

        if (provider) {
          const code = await provider.getCode(contractAddress);
          if (code === '0x' || code === '0x0') {
            throw new Error('Smart contract not found at the configured address on this network.');
          }
        }

        const cCount = await contract.claimCount();
        const myNotes = [];

        for (let i = 1; i <= Number(cCount); i++) {
          const claim = await contract.claims(i);

          if (claim.claimant.toLowerCase() === address.toLowerCase()) {
            const dateStr = "On-Chain"; 
            
            if (!claim.processed) {
              myNotes.push({
                id: `${claim.claimId.toString()}-pending`,
                type: "update",
                title: "Claim Under Review",
                message: `Your claim #${claim.claimId.toString()} is currently under review by our team.`,
                date: dateStr,
                read: false,
                icon: Clock,
                color: "text-primary bg-primary/10",
              });
            } else if (claim.processed && claim.approved) {
              myNotes.push({
                id: `${claim.claimId.toString()}-approved`,
                type: "approval",
                title: "Claim Approved",
                message: `Your claim #${claim.claimId.toString()} has been approved. Payment will be processed.`,
                date: dateStr,
                read: false,
                icon: CheckCircle,
                color: "text-success bg-success/10",
              });
            } else if (claim.processed && !claim.approved) {
              myNotes.push({
                id: `${claim.claimId.toString()}-rejected`,
                type: "rejection",
                title: "Claim Rejected",
                message: `Your claim #${claim.claimId.toString()} has been rejected.`,
                date: dateStr,
                read: false,
                icon: XCircle,
                color: "text-destructive bg-destructive/10",
              });
            }
          }
        }
        
        // Add a general notification for connected wallet
        myNotes.push({
          id: "welcome",
          type: "blockchain",
          title: "Blockchain Connected",
          message: "Secure session established with Web3 Wallet.",
          date: "Just now",
          read: true,
          icon: Shield,
          color: "text-secondary bg-secondary/10",
        });

        // Display newest first
        setNotifications(myNotes.reverse());

      } catch (err: any) {
        console.error("Failed to fetch notifications:", err);
        setError(err.message || "Failed to update notifications from blockchain");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <UserLayout title="Notifications" subtitle="Stay updated on your claims and policy status">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {unreadCount} unread
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <GlassCard className="border-destructive/20 bg-destructive/5 py-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
              <div>
                <p className="text-sm font-semibold text-destructive">Blockchain Connection Issue</p>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Tip: Ensure your MetaMask is connected to the Sepolia testnet and that the contract address in .env is correct.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => {
              const Icon = notification.icon;
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard
                    className={`cursor-pointer transition-all ${
                      !notification.read ? "border-primary/30 bg-primary/5" : ""
                    }`}
                    hover
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${notification.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{notification.title}</h3>
                              {!notification.read && (
                                <span className="w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {notification.date}
                            </span>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })
          ) : (
            <GlassCard className="text-center py-20 border-dashed">
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                <div className="relative flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full border border-primary/20">
                  <Bell className="h-10 w-10 text-primary/60" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">No notifications yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                We'll notify you when there's an update on your claims, policy changes, or important account activities.
              </p>
            </GlassCard>
          )}
        </TabsContent>

        <TabsContent value="unread">
          {notifications.filter((n) => !n.read).length > 0 ? (
            <div className="space-y-4">
              {notifications
                .filter((n) => !n.read)
                .map((notification, index) => {
                  const Icon = notification.icon;
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <GlassCard className="border-primary/30 bg-primary/5 cursor-pointer" hover>
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${notification.color}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{notification.title}</h3>
                              <span className="w-2 h-2 rounded-full bg-primary" />
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <span className="text-xs text-muted-foreground mt-2 block">
                              {notification.date}
                            </span>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
            </div>
          ) : (
            <GlassCard className="text-center py-20 border-dashed">
              <div className="mx-auto w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-success/60" />
              </div>
              <h3 className="text-xl font-bold mb-2">All caught up!</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                You have no unread notifications at the moment. Good job staying on top of things!
              </p>
            </GlassCard>
          )}
        </TabsContent>

        <TabsContent value="claims">
          <GlassCard className="text-center py-20 border-dashed">
            <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-10 w-10 text-primary/60" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Claim Updates</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Any updates regarding your submitted insurance claims will appear here.
            </p>
          </GlassCard>
        </TabsContent>

        <TabsContent value="payments">
          <GlassCard className="text-center py-20 border-dashed">
            <div className="mx-auto w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-6">
              <IndianRupee className="h-10 w-10 text-success/60" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Payment Activity</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Your claim payouts and policy premium payment history will be listed here.
            </p>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </UserLayout>
  );
}
