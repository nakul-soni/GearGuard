'use client';

import { use, useState } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Plus, 
  History, 
  AlertTriangle,
  PenSquare,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { EquipmentForm } from '@/components/equipment/EquipmentForm';
import { toast } from 'sonner';

export default function EquipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { equipment, requests, deleteEquipment, moveRequest } = useStore();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const item = equipment.find((e) => e.id === id);
  const itemRequests = requests.filter((r) => r.equipmentId === id);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold">Equipment not found</h2>
        <Button variant="link" onClick={() => router.push('/equipment')}>
          Back to Equipment List
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      deleteEquipment(id);
      toast.success('Equipment deleted');
      router.push('/equipment');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <PenSquare className="h-4 w-4" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Equipment</DialogTitle>
              </DialogHeader>
              <EquipmentForm initialData={item} onSuccess={() => setIsEditOpen(false)} />
            </DialogContent>
          </Dialog>
          <Button variant="destructive" size="sm" className="gap-2" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-none bg-card/50 shadow-lg backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl">{item.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{item.serialNumber}</p>
              </div>
            </div>
            <Badge variant={item.status === 'Active' ? 'default' : 'destructive'} className="text-sm px-3 py-1">
              {item.status}
            </Badge>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</p>
              <p className="text-sm font-semibold">{item.department}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</p>
              <p className="text-sm font-semibold">{item.location}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Assigned Employee</p>
              <p className="text-sm font-semibold">{item.assignedEmployee}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</p>
              <p className="text-sm font-semibold">{item.category}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Purchase Date</p>
              <p className="text-sm font-semibold">{item.purchaseDate}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Warranty Info</p>
              <p className="text-sm font-semibold">{item.warrantyInfo}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-card/50 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Maintenance Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-accent/50 p-4">
              <p className="text-xs text-muted-foreground mb-1">Assigned Team</p>
              <p className="font-semibold">{useStore.getState().teams.find(t => t.id === item.maintenanceTeamId)?.name || 'N/A'}</p>
            </div>
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Open Requests</p>
                <p className="text-2xl font-bold">{itemRequests.filter(r => r.status !== 'Repaired' && r.status !== 'Scrap').length}</p>
              </div>
              <History className="h-8 w-8 text-muted-foreground/20" />
            </div>
            <Button className="w-full gap-2" asChild>
              <Link href={`/requests?equipmentId=${id}`}>
                View All Requests
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History className="h-5 w-5" />
            Maintenance History
          </h2>
          <Button size="sm" className="gap-2" asChild>
            <Link href={`/requests/new?equipmentId=${id}`}>
              <Plus className="h-4 w-4" />
              New Request
            </Link>
          </Button>
        </div>

        {itemRequests.length > 0 ? (
          <div className="grid gap-4">
            {itemRequests.map((req) => (
              <Card key={req.id} className="border-none bg-card/30 hover:bg-card/50 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={req.type === 'Corrective' ? 'text-destructive' : 'text-blue-500'}>
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{req.subject}</p>
                      <p className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()} • {req.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={
                      req.status === 'Repaired' ? 'default' : 
                      req.status === 'In Progress' ? 'secondary' : 
                      req.status === 'Scrap' ? 'destructive' : 'outline'
                    }>
                      {req.status}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/requests/${req.id}`}>Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground">No maintenance history for this equipment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
