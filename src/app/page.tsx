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
  const { equipment, requests, teams, initializeData, subscribeToData } = useStore(
    useShallow((state) => ({
      equipment: state.equipment,
      requests: state.requests,
      teams: state.teams,
      initializeData: state.initializeData,
      subscribeToData: state.subscribeToData,
    }))
  );

  useEffect(() => {
    setMounted(true);
    initializeData();
    const unsubscribe = subscribeToData();
    return () => unsubscribe();
  }, [initializeData, subscribeToData]);

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

  const COLORS = ['var(--primary)', '#f59e0b', '#3b82f6', '#ef4444'];

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
        <p className="text-muted-foreground">Welcome back, Admin. Here&apos;s what&apos;s happening with GearGuard today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass glass-hover overflow-hidden border-none">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                    <h3 className="mt-1 text-3xl font-bold tracking-tight">{stat.value}</h3>
                  </div>
                  <div className={`rounded-2xl p-3 shadow-inner ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 glass border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              Requests per Team
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            {teamData.some(t => t.requests > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip 
                    cursor={{ fill: 'var(--muted)', opacity: 0.1 }}
                    contentStyle={{ 
                      backgroundColor: 'var(--popover)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Bar dataKey="requests" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground italic border-2 border-dashed border-border rounded-xl bg-muted/20">
                No active requests assigned to teams
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 glass border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <ClipboardList className="h-5 w-5" />
              </div>
              Request Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            {requests.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--popover)', 
                        border: '1px solid var(--border)', 
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                      }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {chartData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-3 rounded-lg bg-muted/30 p-2">
                      <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index] }} />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">{entry.name}</span>
                        <span className="text-sm font-bold">{entry.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground italic border-2 border-dashed border-border rounded-xl bg-muted/20">
                No request data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
