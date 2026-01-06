'use client';

import Link from 'next/link';
import { 
  Settings, 
  MapPin, 
  User, 
  Calendar, 
  ShieldCheck, 
  ClipboardList 
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Equipment } from '@/types';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface EquipmentCardProps {
  equipment: Equipment;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const { requests } = useStore();
  
  const openRequests = requests.filter(
    r => r.equipmentId === equipment.id && r.status !== 'Repaired' && r.status !== 'Scrap'
  ).length;

  return (
    <Card className={cn(
      "group overflow-hidden border-none bg-card/50 shadow-md backdrop-blur-sm transition-all hover:shadow-xl hover:bg-card/80",
      equipment.status === 'Scrapped' && "opacity-60 grayscale"
    )}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold leading-none">{equipment.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{equipment.serialNumber}</p>
            </div>
          </div>
          <Badge variant={equipment.status === 'Active' ? 'default' : 'destructive'}>
            {equipment.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 pb-2">
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{equipment.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-3 w-3" />
            <span className="truncate">{equipment.assignedEmployee}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span className="truncate">{equipment.department}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-3 w-3" />
            <span className="truncate">{equipment.category}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-4 border-t bg-accent/5 flex justify-between items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 gap-2 relative" asChild>
          <Link href={`/equipment/${equipment.id}`}>
            <ClipboardList className="h-3.5 w-3.5" />
            Maintenance
            {openRequests > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white ring-2 ring-background">
                {openRequests}
              </span>
            )}
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="h-8 ml-auto" asChild>
          <Link href={`/equipment/${equipment.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
