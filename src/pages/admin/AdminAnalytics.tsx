import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatsCard } from "@/components/ui/StatsCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, FileStack, DollarSign, AlertTriangle } from "lucide-react";

const monthlyData = [
  { month: "Jan", claims: 120, approved: 95, rejected: 25 },
  { month: "Feb", claims: 150, approved: 120, rejected: 30 },
  { month: "Mar", claims: 180, approved: 140, rejected: 40 },
  { month: "Apr", claims: 160, approved: 130, rejected: 30 },
  { month: "May", claims: 200, approved: 165, rejected: 35 },
  { month: "Jun", claims: 220, approved: 180, rejected: 40 },
];

const pieData = [
  { name: "Auto", value: 45, color: "hsl(210, 100%, 45%)" },
  { name: "Health", value: 30, color: "hsl(175, 60%, 45%)" },
  { name: "Property", value: 25, color: "hsl(260, 60%, 55%)" },
];

export default function AdminAnalytics() {
  return (
    <AdminLayout title="Analytics & Reports" subtitle="Comprehensive claims analytics and insights">
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Claims" value="1,234" icon={FileStack} change={{ value: 12, trend: "up" }} />
        <StatsCard title="Approval Rate" value="82%" icon={TrendingUp} iconColor="bg-success/10 text-success" />
        <StatsCard title="Avg. Payout" value="$4,250" icon={DollarSign} />
        <StatsCard title="Fraud Cases" value="12" icon={AlertTriangle} iconColor="bg-destructive/10 text-destructive" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <GlassCard variant="elevated">
          <h3 className="font-semibold mb-6">Claims Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              <Bar dataKey="approved" fill="hsl(152, 69%, 40%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rejected" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard variant="elevated">
          <h3 className="font-semibold mb-6">Claims by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </AdminLayout>
  );
}
