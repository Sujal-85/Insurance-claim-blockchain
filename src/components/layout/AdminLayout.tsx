import { ReactNode, useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { motion } from "framer-motion";
import { Bell, Search, Shield, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import api from "@/lib/api";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

function NotificationItems() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const claimsResponse = await api.get('/claims');
        const claims = claimsResponse.data;
        
        const pendingCount = claims.filter((c: any) => c.status === 'PENDING' || c.status === 'AI_VERIFIED').length;
        
        const notes = [];
        if (pendingCount > 0) {
          notes.push({
            id: 'pending',
            icon: Clock,
            title: "Claims Pending Review",
            message: `${pendingCount} claim${pendingCount > 1 ? 's' : ''} awaiting your review`,
            color: "text-warning bg-warning/10",
            read: false
          });
        }

        const recentApproved = claims.filter((c: any) => c.status === 'APPROVED').slice(0, 2);
        recentApproved.forEach((claim: any) => {
          notes.push({
            id: claim.id,
            icon: CheckCircle,
            title: "Claim Approved",
            message: `Claim #${claim.id.slice(-6)} approved`,
            color: "text-success bg-success/10",
            read: true
          });
        });

        setNotifications(notes.length > 0 ? notes : [{
          id: 'welcome',
          icon: Shield,
          title: "Admin Dashboard",
          message: "No new notifications",
          color: "text-secondary bg-secondary/10",
          read: true
        }]);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
  }, []);

  if (notifications.length === 0) {
    return <div className="px-2 py-4 text-sm text-muted-foreground text-center">No notifications</div>;
  }

  return (
    <>
      {notifications.map((note) => {
        const Icon = note.icon;
        return (
          <DropdownMenuItem key={note.id} className="cursor-pointer flex items-start gap-3 p-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${note.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{note.title}</p>
              <p className="text-xs text-muted-foreground truncate">{note.message}</p>
            </div>
            {!note.read && <span className="w-2 h-2 bg-destructive rounded-full flex-shrink-0" />}
          </DropdownMenuItem>
        );
      })}
    </>
  );
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              {title && (
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold font-display"
                >
                  {title}
                </motion.h1>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search claims, policies..."
                  className="w-72 pl-10 bg-muted/50 border-0"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-64 overflow-y-auto">
                    <NotificationItems />
                  </div>
                  <DropdownMenuSeparator />
                  <Link to="/admin/claims" className="block">
                    <DropdownMenuItem className="cursor-pointer justify-center text-primary">
                      Review all claims
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 min-h-[calc(100vh-73px)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
