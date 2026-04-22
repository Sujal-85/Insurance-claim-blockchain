import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatsCard } from "@/components/ui/StatsCard";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { TrendingUp, FileStack, IndianRupee, Activity, ShieldCheck, Clock, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/claims/stats');
        setStats(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <AdminLayout title="Analytics & Reports" subtitle="Loading metrics...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  const pieData = [
    { name: "Auto", value: 45, color: "hsl(210, 100%, 45%)" },
    { name: "Health", value: 30, color: "hsl(175, 60%, 45%)" },
    { name: "Property", value: 25, color: "hsl(260, 60%, 55%)" },
  ];

  const riskData = [
    { name: "Low Risk", value: 70, color: "hsl(152, 69%, 40%)" },
    { name: "Medium Risk", value: 20, color: "hsl(35, 92%, 50%)" },
    { name: "High Risk", value: 10, color: "hsl(0, 72%, 51%)" },
  ];

  return (
    <AdminLayout title="Analytics & Reports" subtitle="Comprehensive claims analytics and insights">
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Claims" value={stats.totalClaims.toLocaleString()} icon={FileStack} change={{ value: 12, trend: "up" }} />
        <StatsCard title="Approval Rate" value={`${Math.round(stats.approvalRate)}%`} icon={ShieldCheck} iconColor="bg-success/10 text-success" />
        <StatsCard title="Total Payouts" value={formatCurrency(stats.totalPayouts)} icon={IndianRupee} change={{ value: 8, trend: "up" }} />
        <StatsCard title="Avg. AI Confidence" value={`${Math.round(stats.avgAIConfidence)}%`} icon={Activity} iconColor="bg-primary/10 text-primary" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <GlassCard variant="elevated" className="min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Claims Volume Trend
            </h3>
            <Badge variant="outline" className="font-mono">Last 6 Months</Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.monthlyData}>
              <defs>
                <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(152, 69%, 40%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(152, 69%, 40%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                }} 
              />
              <Legend />
              <Area type="monotone" dataKey="approved" stroke="hsl(152, 69%, 40%)" fillOpacity={1} fill="url(#colorApproved)" />
              <Area type="monotone" dataKey="rejected" stroke="hsl(0, 72%, 51%)" fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard variant="elevated" className="min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-success" />
              Payout Distribution
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), "Total Payout"]}
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "12px"
                }} 
              />
              <Line type="stepAfter" dataKey="payout" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 6, fill: "hsl(var(--primary))" }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <GlassCard variant="elevated">
          <h3 className="font-bold mb-6">Category Split</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60}
                  outerRadius={80} 
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard variant="elevated">
          <h3 className="font-bold mb-6">AI Risk Profile</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={riskData} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80} 
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard variant="elevated">
          <h3 className="font-bold mb-4">Operational Efficiency</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Avg. Approval Time</p>
                <p className="text-xl font-bold">14.2 Hours</p>
                <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-primary w-[75%]" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10 text-success">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Auto-processed Ratio</p>
                <p className="text-xl font-bold">64.8%</p>
                <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-success w-[64%]" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/10 text-warning">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Manual Reviews Pending</p>
                <p className="text-xl font-bold">28</p>
                <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-warning w-[42%]" />
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </AdminLayout>
  );
}
