'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useShallow } from 'zustand/shallow';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  ClipboardCheck,
  Zap,
  Hammer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useStore } from '@/store/useStore';

const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });

export default function ReportsPage() {
  const { equipment, requests, teams } = useStore(
    useShallow((state) => ({
      equipment: state.equipment,
      requests: state.requests,
      teams: state.teams,
    }))
  );

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Requests per Team
  const teamData = useMemo(() => teams.map(team => ({
    name: team.name,
    count: requests.filter(r => {
      const eq = equipment.find(e => e.id === r.equipmentId);
      return eq?.maintenanceTeamId === team.id;
    }).length
  })), [teams, requests, equipment]);

  // Requests per Category
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    requests.forEach(r => {
      const eq = equipment.find(e => e.id === r.equipmentId);
      if (eq) {
        categories[eq.category] = (categories[eq.category] || 0) + 1;
      }
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [requests, equipment]);

  // Status distribution
  const statusData = useMemo(() => {
    const statuses: Record<string, number> = {};
    requests.forEach(r => {
      statuses[r.status] = (statuses[r.status] || 0) + 1;
    });
    return Object.entries(statuses).map(([name, value]) => ({ name, value }));
  }, [requests]);

  const quickStats = useMemo(() => ({
    resolutionRate: Math.round((requests.filter(r => r.status === 'Repaired').length / requests.length) * 100) || 0,
    preventiveRatio: Math.round((requests.filter(r => r.type === 'Preventive').length / requests.length) * 100) || 0,
    scrapRate: Math.round((requests.filter(r => r.status === 'Scrap').length / requests.length) * 100) || 0,
  }), [requests]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Advanced Analytics</h1>
        <p className="text-muted-foreground">Deep dive into maintenance performance and asset health.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-none bg-card/50 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-amber-500" />
              Quick Stats
            </CardTitle>
          </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                <span className="text-sm font-medium">Resolution Rate</span>
                <span className="text-lg font-bold text-primary">
                  {quickStats.resolutionRate}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <span className="text-sm font-medium">Preventive Ratio</span>
                <span className="text-lg font-bold text-emerald-500">
                  {quickStats.preventiveRatio}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                <span className="text-sm font-medium">Scrap Rate</span>
                <span className="text-lg font-bold text-destructive">
                  {quickStats.scrapRate}%
                </span>
              </div>
            </CardContent>

        </Card>

        <Card className="lg:col-span-2 border-none bg-card/50 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Workload by Team
            </CardTitle>
            <CardDescription>Number of maintenance requests assigned per team</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#ffffff10" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none bg-card/50 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChartIcon className="h-5 w-5 text-purple-500" />
              Asset Categories
            </CardTitle>
            <CardDescription>Maintenance demand by equipment type</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none bg-card/50 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Hammer className="h-5 w-5 text-emerald-500" />
              Request Lifecycle
            </CardTitle>
            <CardDescription>Current status of all tickets</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
