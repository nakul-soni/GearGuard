'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from '@/components/RechartsWrapper';
import { 
  Settings, 
  ClipboardList, 
  AlertTriangle, 
  CheckCircle2,
  TrendingUp,
  Activity,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/store/useStore';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { equipment, requests, teams } = useStore(
    useShallow((state) => ({
      equipment: state.equipment,
      requests: state.requests,
      teams: state.teams,
    }))
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    const openRequests = requests.filter(r => r.status !== 'Repaired' && r.status !== 'Scrap').length;
    const completedJobs = requests.filter(r => r.status === 'Repaired').length;

    return [
      { label: 'Total Equipment', value: equipment.length, icon: Settings, color: 'text-blue-500', bg: 'bg-blue-500/10' },
      { label: 'Open Requests', value: openRequests, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
      { label: 'Total Teams', value: teams.length, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
      { label: 'Completed Jobs', value: completedJobs, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ];
  }, [equipment.length, requests, teams.length]);

  const chartData = useMemo(() => [
    { name: 'Corrective', value: requests.filter(r => r.type === 'Corrective').length },
    { name: 'Preventive', value: requests.filter(r => r.type === 'Preventive').length },
  ], [requests]);

  const teamData = useMemo(() => teams.map(team => ({
    name: team.name,
    requests: requests.filter(r => {
      const eq = equipment.find(e => e.id === r.equipmentId);
      return eq?.maintenanceTeamId === team.id;
    }).length
  })), [teams, requests, equipment]);

  const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  if (!mounted) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening with GearGuard today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-none bg-card/50 shadow-lg backdrop-blur-sm transition-all hover:bg-card/80">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                  </div>
                  <div className={`rounded-xl p-3 ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none bg-card/50 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Requests per Team
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {teamData.some(t => t.requests > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="requests" fill="currentColor" className="fill-primary" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground italic border-2 border-dashed border-white/5 rounded-lg">
                No active requests assigned to teams
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none bg-card/50 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Request Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {requests.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-center gap-6">
                  {chartData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-xs text-muted-foreground">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground italic border-2 border-dashed border-white/5 rounded-lg">
                No request data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
