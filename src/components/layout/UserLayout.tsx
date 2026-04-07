import { ReactNode } from "react";
import { UserSidebar } from "./UserSidebar";
import { motion } from "framer-motion";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function UserLayout({ children, title, subtitle }: UserLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <UserSidebar />
      
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
                  placeholder="Search..."
                  className="w-64 pl-10 bg-muted/50 border-0"
                />
              </div>
              
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-8 pb-8 pt-4 min-h-[calc(100vh-73px)]">
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
