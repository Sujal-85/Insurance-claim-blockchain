import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search, 
  Filter, 
  Shield, 
  TrendingUp, 
  Users, 
  Activity,
  MoreVertical,
  Briefcase
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import api from "@/lib/api";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

export default function AdminPolicies() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    policyName: "",
    category: "Auto",
    coverageAmount: "",
    premium: "",
    description: "",
  });

  const fetchPolicies = async () => {
    try {
      const response = await api.get('/policies');
      setPolicies(response.data);
    } catch (error) {
      console.error("Error fetching policies:", error);
      toast.error("Failed to fetch policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleCreatePolicy = async () => {
    try {
      await api.post('/policies', {
        ...newPolicy,
        coverageAmount: parseFloat(newPolicy.coverageAmount),
        premium: parseFloat(newPolicy.premium),
        rules: {}, // Default empty rules
      });
      toast.success("Policy created successfully");
      setIsCreateDialogOpen(false);
      fetchPolicies();
      setNewPolicy({
        policyName: "",
        category: "Auto",
        coverageAmount: "",
        premium: "",
        description: "",
      });
    } catch (error) {
      console.error("Error creating policy:", error);
      toast.error("Failed to create policy");
    }
  };

  return (
    <AdminLayout title="Policy Management" subtitle="Create and manage insurance policies">
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search policies..." className="pl-10 h-12 bg-card" />
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Create Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Policy</DialogTitle>
              <DialogDescription>
                Add a new insurance product to the platform.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Policy Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Comprehensive Auto" 
                  value={newPolicy.policyName}
                  onChange={(e) => setNewPolicy({...newPolicy, policyName: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <select 
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newPolicy.category}
                  onChange={(e) => setNewPolicy({...newPolicy, category: e.target.value})}
                >
                  <option value="Auto">Auto</option>
                  <option value="Health">Health</option>
                  <option value="Property">Property</option>
                  <option value="Life">Life</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="coverage">Coverage Amount (₹)</Label>
                <Input 
                  id="coverage" 
                  type="number" 
                  placeholder="50000"
                  value={newPolicy.coverageAmount}
                  onChange={(e) => setNewPolicy({...newPolicy, coverageAmount: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="premium">Monthly Premium (₹)</Label>
                <Input 
                  id="premium" 
                  type="number" 
                  placeholder="120"
                  value={newPolicy.premium}
                  onChange={(e) => setNewPolicy({...newPolicy, premium: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  placeholder="Brief description of coverage"
                  value={newPolicy.description}
                  onChange={(e) => setNewPolicy({...newPolicy, description: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleCreatePolicy}>
                Create Policy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="bg-primary/5 border-primary/20">
          <Activity className="h-6 w-6 text-primary mb-2" />
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Policies</h4>
          <p className="text-2xl font-bold">{policies.length}</p>
          <div className="flex items-center gap-1 text-success text-[10px] font-bold mt-1">
            <TrendingUp className="h-3 w-3" /> +12% this month
          </div>
        </GlassCard>
        <GlassCard className="bg-success/5 border-success/20">
          <Users className="h-6 w-6 text-success mb-2" />
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Users</h4>
          <p className="text-2xl font-bold">2,840</p>
          <div className="flex items-center gap-1 text-success text-[10px] font-bold mt-1">
            <TrendingUp className="h-3 w-3" /> +5% this month
          </div>
        </GlassCard>
        <GlassCard className="bg-warning/5 border-warning/20">
          <Shield className="h-6 w-6 text-warning mb-2" />
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending Claims</h4>
          <p className="text-2xl font-bold">12</p>
          <div className="flex items-center gap-1 text-warning text-[10px] font-bold mt-1">
            <Activity className="h-3 w-3" /> Requires attention
          </div>
        </GlassCard>
        <GlassCard className="bg-info/5 border-info/20">
          <TrendingUp className="h-6 w-6 text-info mb-2" />
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Monthly Revenue</h4>
          <p className="text-2xl font-bold">{formatCurrency(142000)}</p>
          <div className="flex items-center gap-1 text-success text-[10px] font-bold mt-1">
            <TrendingUp className="h-3 w-3" /> +8.4%
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <GlassCard>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filters
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-xs mb-2 block uppercase tracking-wider opacity-60">Category</Label>
                <div className="space-y-2">
                  {["All", "Auto", "Health", "Property", "Life"].map(cat => (
                    <div key={cat} className="flex items-center gap-2">
                      <input type="checkbox" id={cat} className="rounded border-muted" />
                      <label htmlFor={cat} className="text-sm">{cat}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence>
            {policies.map((policy, index) => (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="group hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-lg">{policy.policyName}</h4>
                          <Badge variant="outline" className="text-[10px]">{policy.category}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">ID: {policy.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Premium</p>
                        <p className="font-bold">{formatCurrency(policy.premium)}/mo</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Coverage</p>
                        <p className="font-bold">{formatCurrency(policy.coverageAmount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Status</p>
                        <Badge className={policy.active ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                          {policy.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {policies.length === 0 && !loading && (
            <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
              <Shield className="h-12 w-12 text-muted mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground">No policies found. Create your first one above.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
