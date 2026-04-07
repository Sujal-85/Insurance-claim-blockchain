import { UserLayout } from "@/components/layout/UserLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Briefcase
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { toast } from "sonner";

export default function UserPolicies() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [myPolicies, setMyPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"available" | "my">("available");

  const fetchData = async () => {
    try {
      const [allRes, myRes] = await Promise.all([
        api.get('/policies'),
        api.get('/policies/user/my-policies')
      ]);
      setPolicies(allRes.data);
      setMyPolicies(myRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePurchase = async (policyId: string) => {
    try {
      await api.post(`/policies/${policyId}/purchase`);
      toast.success("Policy purchased successfully!");
      fetchData();
      setActiveTab("my");
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Failed to purchase policy");
    }
  };

  return (
    <UserLayout title="Insurance Policies" subtitle="Explore and manage your blockchain-backed coverage">
      <div className="flex gap-4 mb-8 bg-muted/30 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("available")}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === "available" 
              ? "bg-white text-primary shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Available Policies
        </button>
        <button
          onClick={() => setActiveTab("my")}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === "my" 
              ? "bg-white text-primary shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          My Policies ({myPolicies.length})
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filters
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs mb-2 block uppercase tracking-wider opacity-60">Category</label>
                <div className="space-y-2">
                  {["All", "Auto", "Health", "Property", "Life"].map(cat => (
                    <div key={cat} className="flex items-center gap-2">
                      <input type="checkbox" id={`user-${cat}`} className="rounded border-muted" />
                      <label htmlFor={`user-${cat}`} className="text-sm">{cat}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Policies List */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTab === "available" ? (
              policies.map((policy, index) => {
                const isOwned = myPolicies.some(myPol => myPol.policyId === policy.id);
                return (
                  <motion.div
                    key={policy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard className="h-full flex flex-col hover:border-primary/50 transition-colors group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Briefcase className="h-6 w-6" />
                        </div>
                        <Badge variant="outline">{policy.category}</Badge>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2">{policy.policyName}</h3>
                      <p className="text-sm text-muted-foreground mb-6 flex-1">
                        {policy.description || "Comprehensive coverage powered by smart contracts for maximum transparency and speed."}
                      </p>

                      <div className="space-y-3 mb-6 pt-4 border-t border-border">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Coverage</span>
                          <span className="font-bold">${policy.coverageAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Premium</span>
                          <span className="font-bold text-primary">${policy.premium}/mo</span>
                        </div>
                      </div>

                      <Button 
                        onClick={() => handlePurchase(policy.id)}
                        disabled={isOwned}
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        {isOwned ? (
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" /> Already Owned
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Purchase Policy <ArrowRight className="h-4 w-4" />
                          </span>
                        )}
                      </Button>
                    </GlassCard>
                  </motion.div>
                );
              })
            ) : (
              myPolicies.map((userPolicy, index) => (
                <motion.div
                  key={userPolicy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="h-full border-l-4 border-l-success">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Badge className="bg-success/10 text-success mb-2">Active Policy</Badge>
                        <h3 className="text-xl font-bold">{userPolicy.policy.policyName}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground uppercase">Expires</p>
                        <p className="text-xs font-mono">{new Date(userPolicy.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 my-6 p-3 bg-muted/20 rounded-lg">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase">Coverage</p>
                        <p className="font-bold text-sm">${userPolicy.policy.coverageAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase">ID</p>
                        <p className="font-mono text-[10px] truncate">{userPolicy.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Purchased on {new Date(userPolicy.createdAt).toLocaleDateString()}
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </div>

          {((activeTab === "available" && policies.length === 0) || (activeTab === "my" && myPolicies.length === 0)) && !loading && (
            <div className="text-center py-20">
              <Shield className="h-12 w-12 text-muted mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground">No policies found.</p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
