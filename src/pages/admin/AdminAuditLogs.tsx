import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, Filter, Terminal, ShieldCheck, History } from "lucide-react";
import { useState } from "react";

export default function AdminAuditLogs() {
  const [logs] = useState([
    { id: 1, action: "CLAIM_APPROVED", user: "admin@example.com", target: "Claim #1", timestamp: "2026-03-28 22:14:05", status: "success" },
    { id: 2, action: "POLICY_CREATED", user: "admin@example.com", target: "Travel Insurance", timestamp: "2026-03-28 20:05:12", status: "success" },
    { id: 3, action: "ADMIN_LOGIN", user: "admin@example.com", target: "System", timestamp: "2026-03-28 19:30:45", status: "success" },
    { id: 4, action: "CLAIM_REJECTED", user: "admin@example.com", target: "Claim #42", timestamp: "2026-03-27 15:20:10", status: "success" },
  ]);

  return (
    <AdminLayout title="Audit Logs" subtitle="Track system activities and administrative actions">
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search logs..." className="pl-10 h-12 bg-card" />
        </div>
        <Button variant="outline" className="h-12"><Filter className="mr-2 h-4 w-4" />Filters</Button>
      </div>

      <GlassCard variant="elevated">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Timestamp</th>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Action</th>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Admin</th>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Target</th>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border/50 hover:bg-muted/30"
                >
                  <td className="py-4 px-4 text-sm text-muted-foreground font-mono">{log.timestamp}</td>
                  <td className="py-4 px-4 font-medium">
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-4">{log.user}</td>
                  <td className="py-4 px-4">{log.target}</td>
                  <td className="py-4 px-4">
                    <span className="flex items-center gap-1 text-success text-xs">
                      <ShieldCheck className="h-3 w-3" /> {log.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </AdminLayout>
  );
}
