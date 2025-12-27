'use client';

import { use, useState } from 'react';
import { 
  ArrowLeft, 
  ClipboardList, 
  Clock, 
  User, 
  Settings, 
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Play,
  Check,
  Ban
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStore } from '@/store/useStore';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const STAGES = ['New', 'In Progress', 'Repaired', 'Scrap'];

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { requests, equipment, users, updateRequest, moveRequest, deleteRequest } = useStore();
  const [duration, setDuration] = useState<string>('');

  const request = requests.find((r) => r.id === id);
  const eq = equipment.find((e) => e.id === request?.equipmentId);
  const tech = users.find((u) => u.id === request?.assignedTechnicianId);

  if (!request || !eq) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold">Request not found</h2>
        <Button variant="link" onClick={() => router.push('/requests')}>
          Back to Requests List
        </Button>
      </div>
    );
  }

  const currentStageIndex = STAGES.indexOf(request.status);
  const progress = ((currentStageIndex + 1) / STAGES.length) * 100;

  const handleStageChange = (newStatus: any) => {
    if (newStatus === 'Repaired' && !duration && !request.duration) {
      toast.error('Please record duration (hours spent) before completing.');
      return;
    }
    
    if (newStatus === 'Repaired' && duration) {
      updateRequest(id, { duration: parseFloat(duration) });
    }
    
    moveRequest(id, newStatus);
    toast.success(`Request moved to ${newStatus}`);
  };

  const handleTechnicianChange = (techId: string) => {
    updateRequest(id, { assignedTechnicianId: techId });
    toast.success('Technician assigned');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this request?')) {
      deleteRequest(id);
      toast.success('Request deleted');
      router.push('/requests');
    }
  };

  const teamTechnicians = users.filter(u => u.teamId === eq.maintenanceTeamId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Request
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Badge variant={request.type === 'Corrective' ? 'destructive' : 'secondary'} className="px-3 py-1">
            {request.type}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">{request.subject}</h1>
        </div>
        <p className="text-muted-foreground flex items-center gap-2">
          <span className="font-mono text-xs">#{request.id}</span>
          <span>•</span>
          <span>Created on {new Date(request.createdAt).toLocaleDateString()}</span>
        </p>
      </div>

      <Card className="border-none bg-card/50 shadow-lg backdrop-blur-sm overflow-hidden">
        <div className="bg-muted/30 p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Stage</span>
            <Badge className="text-sm px-4 py-1">{request.status}</Badge>
          </div>
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between px-1">
              {STAGES.map((stage, idx) => (
                <div key={stage} className="flex flex-col items-center gap-1">
                  <div className={`h-3 w-3 rounded-full ${idx <= currentStageIndex ? 'bg-primary' : 'bg-muted'}`} />
                  <span className={`text-[10px] font-medium ${idx <= currentStageIndex ? 'text-foreground' : 'text-muted-foreground'}`}>{stage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <CardContent className="grid gap-8 p-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                <Settings className="h-5 w-5 text-primary" />
                Equipment Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <Link href={`/equipment/${eq.id}`} className="font-medium hover:underline flex items-center gap-1">
                    {eq.name}
                  </Link>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Serial Number</p>
                  <p className="font-medium">{eq.serialNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="font-medium">{eq.department}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium">{eq.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                <User className="h-5 w-5 text-primary" />
                Assignment
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Assigned Technician</p>
                  <Select onValueChange={handleTechnicianChange} value={request.assignedTechnicianId || 'none'}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Unassigned</SelectItem>
                      {teamTechnicians.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {request.status === 'InProgress' || request.status === 'Repaired' && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Hours Spent</p>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        placeholder="0.0" 
                        className="w-24 bg-background/50" 
                        value={duration || request.duration || ''}
                        onChange={(e) => setDuration(e.target.value)}
                        readOnly={request.status === 'Repaired' || request.status === 'Scrap'}
                      />
                      <span className="text-sm text-muted-foreground">hours</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Actions</h3>
            <div className="grid gap-3">
              <Button 
                variant={request.status === 'New' ? 'default' : 'outline'}
                className="w-full justify-start gap-3 h-12"
                disabled={request.status !== 'New'}
                onClick={() => handleStageChange('In Progress')}
              >
                <div className="rounded bg-primary/20 p-1"><Play className="h-4 w-4" /></div>
                Start Work (Move to In Progress)
              </Button>
              <Button 
                variant={request.status === 'In Progress' ? 'default' : 'outline'}
                className="w-full justify-start gap-3 h-12"
                disabled={request.status !== 'In Progress'}
                onClick={() => handleStageChange('Repaired')}
              >
                <div className="rounded bg-emerald-500/20 p-1 text-emerald-500"><Check className="h-4 w-4" /></div>
                Complete Repair (Move to Repaired)
              </Button>
              <Button 
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-destructive hover:bg-destructive/10"
                disabled={request.status === 'Repaired' || request.status === 'Scrap'}
                onClick={() => handleStageChange('Scrap')}
              >
                <div className="rounded bg-destructive/20 p-1 text-destructive"><Ban className="h-4 w-4" /></div>
                Scrap Equipment (Irreparable)
              </Button>
            </div>

            {request.type === 'Preventive' && request.scheduledDate && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-center gap-4">
                <Calendar className="h-10 w-10 text-blue-500 opacity-20" />
                <div>
                  <p className="text-xs font-medium text-blue-500 uppercase">Scheduled For</p>
                  <p className="text-lg font-bold">{new Date(request.scheduledDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
