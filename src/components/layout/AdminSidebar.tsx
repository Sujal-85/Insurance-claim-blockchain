import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileStack,
  FileSearch,
  Settings2,
  BarChart3,
  Blocks,
  ScrollText,
  Shield,
  LogOut,
  ChevronLeft,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: FileStack, label: "Claims Management", path: "/admin/claims" },
  { icon: FileSearch, label: "Review Claims", path: "/admin/review" },
  { icon: Users, label: "Policy Management", path: "/admin/policies" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: Blocks, label: "Smart Contracts", path: "/admin/contracts" },
  { icon: ScrollText, label: "Audit Logs", path: "/admin/audit" },
];

export function AdminSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
              <img src="/logo.png" alt="RealtyCheck Logo" className="w-full h-full object-cover" />
            </div>
            {!collapsed && (
              <div>
                <span className="font-display font-bold text-lg text-sidebar-foreground block">
                  RealtyCheck
                </span>
                <span className="text-xs text-sidebar-primary font-medium">Admin Portal</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-primary text-white"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && <span className="ml-3">Collapse</span>}
          </Button>
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Sign Out</span>}
            </Button>
          </Link>
        </div>
      </div>
    </motion.aside>
  );
}
