import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Blocks, 
  Link as LinkIcon, 
  Cpu, 
  Shield, 
  ExternalLink, 
  Activity, 
  Zap, 
  History,
  Terminal,
  Server
} from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminContracts() {
  const [events, setEvents] = useState<any[]>([]);
  
  const contracts = [
    { name: "InsuranceCore", address: "0x6876C6E2511b61C053CE8C45bB2E6ad384A622cF", version: "1.2.0", status: "active", methods: 12 },
    { name: "PolicyToken", address: "0x47e17173e571c592209778c380b01691122a27500", version: "1.0.1", status: "active", methods: 8 },
    { name: "RiskOracle", address: "0x23654450a8913123b01691122a2750058b292723", version: "2.1.0", status: "maintenance", methods: 5 },
    { name: "ClaimToken", address: "0x0000000000000000000000000000000000000000", version: "N/A", status: "not deployed", methods: 0 },
    { name: "PremiumToken", address: "0x0000000000000000000000000000000000000000", version: "N/A", status: "not deployed", methods: 0 },
  ];

  // Simulate incoming blockchain events
  useEffect(() => {
    const eventTypes = ["ClaimSubmitted", "ClaimApproved", "PolicyCreated", "PaymentReleased"];
    const interval = setInterval(() => {
      const newEvent = {
        id: Math.random().toString(36).substr(2, 9),
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        txHash: "0x" + Math.random().toString(16).substr(2, 40),
        timestamp: new Date().toLocaleTimeString(),
      };
      setEvents(prev => [newEvent, ...prev].slice(0, 5));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout title="Smart Contracts" subtitle="Monitor and manage blockchain infrastructure">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="bg-primary/5 border-primary/20">
          <Activity className="h-6 w-6 text-primary mb-2" />
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Network</h4>
          <p className="text-xl font-bold text-success flex items-center gap-2">
            <Zap className="h-4 w-4 fill-success" /> Online
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">Ganache Local (7545)</p>
        </GlassCard>
        <GlassCard className="bg-security/5 border-security/20">
          <Blocks className="h-6 w-6 text-security mb-2" />
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contracts</h4>
          <p className="text-xl font-bold">3 Active</p>
          <p className="text-[10px] text-muted-foreground mt-1">v1.2.0 deployed</p>
        </GlassCard>
        <GlassCard className="bg-warning/5 border-warning/20">
          <Shield className="h-6 w-6 text-warning mb-2" />
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Gas Price</h4>
          <p className="text-xl font-bold">12 Gwei</p>
          <p className="text-[10px] text-muted-foreground mt-1">Estimated: 0.002 ETH/tx</p>
        </GlassCard>
        <GlassCard className="bg-info/5 border-info/20">
          <Server className="h-6 w-6 text-info mb-2" />
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Block Height</h4>
          <p className="text-xl font-bold">#4,281</p>
          <p className="text-[10px] text-muted-foreground mt-1">Last block: 12s ago</p>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Terminal className="h-5 w-5" /> Contract Registry
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {contracts.map((contract, index) => (
              <motion.div
                key={contract.address}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors">
                      <Cpu className="h-5 w-5 text-foreground group-hover:text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold">{contract.name}</h4>
                        <Badge variant="secondary" className="text-[9px] h-4">v{contract.version}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono mt-1">
                        <LinkIcon className="h-3 w-3" /> {contract.address.slice(0, 18)}...
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[9px] text-muted-foreground uppercase">Methods</p>
                      <p className="text-xs font-bold">{contract.methods}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-muted-foreground uppercase">Status</p>
                      <span className={`text-[9px] font-bold uppercase ${
                        contract.status === 'active' ? 'text-success' : 
                        contract.status === 'not deployed' ? 'text-destructive' : 'text-warning'
                      }`}>
                        ● {contract.status}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <History className="h-5 w-5" /> Live Events
          </h3>
          <GlassCard className="p-0 overflow-hidden">
            <div className="bg-muted/50 p-3 text-[10px] font-mono text-muted-foreground border-b border-border flex justify-between">
              <span>LISTENING ON PORT 7545...</span>
              <span className="animate-pulse text-success">● LIVE</span>
            </div>
            <div className="p-4 space-y-4 min-h-[300px]">
              <AnimatePresence initial={false}>
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="border-l-2 border-primary pl-3 py-1"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-primary">{event.type}</span>
                      <span className="text-[9px] text-muted-foreground">{event.timestamp}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono truncate">
                      tx: {event.txHash}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {events.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                  <Activity className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-xs">Waiting for events...</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </AdminLayout>
  );
}
