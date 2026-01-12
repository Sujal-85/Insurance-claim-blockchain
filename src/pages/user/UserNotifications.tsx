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
  DollarSign,
  Settings,
  Trash2,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "approval",
    title: "Claim Approved",
    message: "Your claim CLM-2024-002 has been approved. Payment of $850 will be processed within 24 hours.",
    date: "2 hours ago",
    read: false,
    icon: CheckCircle,
    color: "text-success bg-success/10",
  },
  {
    id: 2,
    type: "update",
    title: "Claim Under Review",
    message: "Your claim CLM-2024-001 is currently under review by our team. Expected completion: 2-3 business days.",
    date: "5 hours ago",
    read: false,
    icon: Clock,
    color: "text-primary bg-primary/10",
  },
  {
    id: 3,
    type: "blockchain",
    title: "Blockchain Verification Complete",
    message: "Your claim CLM-2024-001 has been successfully recorded on the blockchain with transaction hash 0x8f2b...4a9c",
    date: "1 day ago",
    read: true,
    icon: Shield,
    color: "text-secondary bg-secondary/10",
  },
  {
    id: 4,
    type: "document",
    title: "Document Verification",
    message: "All documents for claim CLM-2024-001 have been verified successfully.",
    date: "1 day ago",
    read: true,
    icon: FileText,
    color: "text-primary bg-primary/10",
  },
  {
    id: 5,
    type: "payment",
    title: "Payment Processed",
    message: "Payment of $450 for claim CLM-2023-045 has been transferred to your account.",
    date: "3 days ago",
    read: true,
    icon: DollarSign,
    color: "text-success bg-success/10",
  },
  {
    id: 6,
    type: "rejection",
    title: "Claim Rejected",
    message: "Your claim CLM-2023-032 has been rejected. Reason: Procedure not covered under current policy terms.",
    date: "1 week ago",
    read: true,
    icon: XCircle,
    color: "text-destructive bg-destructive/10",
  },
  {
    id: 7,
    type: "warning",
    title: "Policy Renewal Reminder",
    message: "Your Auto Insurance policy (POL-AUTO-2024) expires in 30 days. Renew now to maintain coverage.",
    date: "2 weeks ago",
    read: true,
    icon: AlertCircle,
    color: "text-warning bg-warning/10",
  },
];

export default function UserNotifications() {
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

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {notifications.map((notification, index) => {
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
          })}
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
            <GlassCard className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">All caught up!</h3>
              <p className="text-muted-foreground">You have no unread notifications</p>
            </GlassCard>
          )}
        </TabsContent>

        <TabsContent value="claims">
          <GlassCard className="text-center py-12">
            <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Claims Notifications</h3>
            <p className="text-muted-foreground">Showing claim-related updates</p>
          </GlassCard>
        </TabsContent>

        <TabsContent value="payments">
          <GlassCard className="text-center py-12">
            <DollarSign className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Payment Notifications</h3>
            <p className="text-muted-foreground">Showing payment-related updates</p>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </UserLayout>
  );
}
