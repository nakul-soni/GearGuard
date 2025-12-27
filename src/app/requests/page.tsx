'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Search, Filter, AlertTriangle, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

function RequestsListContent() {
  const searchParams = useSearchParams();
  const equipmentIdFilter = searchParams.get('equipmentId');
  
  const { requests, equipment, teams, users } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = req.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesType = typeFilter === 'all' || req.type === typeFilter;
    const matchesEquipment = !equipmentIdFilter || req.equipmentId === equipmentIdFilter;
    return matchesSearch && matchesStatus && matchesType && matchesEquipment;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'New': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'In Progress': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'Repaired': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'Scrap': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Requests</h1>
          <p className="text-muted-foreground">Monitor and manage all maintenance activities across the fleet.</p>
        </div>
        
        <Button className="gap-2 shadow-lg shadow-primary/20" asChild>
          <Link href="/requests/new">
            <Plus className="h-4 w-4" />
            New Request
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            className="pl-10 bg-card/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-card/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Repaired">Repaired</SelectItem>
              <SelectItem value="Scrap">Scrap</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] bg-card/50">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Corrective">Corrective</SelectItem>
              <SelectItem value="Preventive">Preventive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border bg-card/50 shadow-lg backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Request</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filteredRequests.map((req) => {
                const eq = equipment.find(e => e.id === req.equipmentId);
                const tech = users.find(u => u.id === req.assignedTechnicianId);
                return (
                  <TableRow key={req.id} component={motion.tr} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="group"
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{req.subject}</span>
                        <span className="text-[10px] text-muted-foreground">#{req.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{eq?.name}</span>
                        <span className="text-[10px] text-muted-foreground">{eq?.serialNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={req.type === 'Corrective' ? 'destructive' : 'secondary'} className="text-[10px]">
                        {req.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(req.status)}
                        <span className="text-sm">{req.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {tech ? (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-accent" />
                          <span className="text-sm">{tech.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foregrounditalic">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/requests/${req.id}`}>Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
        {filteredRequests.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No requests found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}

export default function RequestsPage() {
  return (
    <Suspense fallback={<div>Loading requests...</div>}>
      <RequestsListContent />
    </Suspense>
  );
}
