'use client';

import { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useShallow } from 'zustand/shallow';
import { 
  AlertTriangle, 
  Calendar, 
  User, 
  Clock,
  Settings,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStore } from '@/store/useStore';
import { RequestStatus, MaintenanceRequest } from '@/types';
import { toast } from 'sonner';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const COLUMNS: { id: RequestStatus; label: string; color: string }[] = [
  { id: 'New', label: 'New', color: 'bg-blue-500' },
  { id: 'In Progress', label: 'In Progress', color: 'bg-amber-500' },
  { id: 'Repaired', label: 'Repaired', color: 'bg-emerald-500' },
  { id: 'Scrap', label: 'Scrap', color: 'bg-destructive' },
];

export default function KanbanPage() {
  const { requests, equipment, users, moveRequest } = useStore(
    useShallow((state) => ({
      requests: state.requests,
      equipment: state.equipment,
      users: state.users,
      moveRequest: state.moveRequest,
    }))
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const groupedRequests = useMemo(() => {
    const groups: Record<RequestStatus, MaintenanceRequest[]> = {
      'New': [],
      'In Progress': [],
      'Repaired': [],
      'Scrap': [],
    };
    requests.forEach(req => {
      if (groups[req.status]) {
        groups[req.status].push(req);
      }
    });
    return groups;
  }, [requests]);

  if (!isMounted) return null;

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as RequestStatus;
    moveRequest(draggableId, newStatus);
    toast.success(`Request moved to ${newStatus}`);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Maintenance Kanban</h1>
        <p className="text-muted-foreground">Drag and drop requests between stages to manage workflow.</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4 min-h-[calc(100vh-250px)]">
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex-1 min-w-[300px] flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", column.color)} />
                  <h3 className="font-semibold">{column.label}</h3>
                  <Badge variant="secondary" className="ml-2 bg-muted/50">
                    {groupedRequests[column.id].length}
                  </Badge>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "flex-1 rounded-xl bg-muted/30 p-2 transition-colors border border-dashed border-transparent",
                      snapshot.isDraggingOver && "bg-muted/50 border-primary/20"
                    )}
                  >
                    <div className="flex flex-col gap-3">
                      {groupedRequests[column.id].map((req, index) => {
                        const eq = equipment.find(e => e.id === req.equipmentId);
                        const tech = users.find(u => u.id === req.assignedTechnicianId);
                        const isOverdue = req.type === 'Preventive' && req.scheduledDate && new Date(req.scheduledDate) < new Date() && req.status !== 'Repaired';

                        return (
                          <Draggable key={req.id} draggableId={req.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={cn(
                                  "group relative",
                                  snapshot.isDragging && "z-50"
                                )}
                              >
                                <Link href={`/requests/${req.id}`}>
                                  <Card className={cn(
                                    "border-none bg-card shadow-sm hover:shadow-md transition-all active:scale-[0.98]",
                                    isOverdue && "ring-1 ring-destructive/50"
                                  )}>
                                    <CardContent className="p-4 space-y-3">
                                      <div className="flex justify-between items-start">
                                        <Badge variant={req.type === 'Corrective' ? 'destructive' : 'secondary'} className="text-[10px] px-1.5 py-0 h-5">
                                          {req.type}
                                        </Badge>
                                        {isOverdue && (
                                          <span className="text-[10px] font-bold text-destructive animate-pulse uppercase tracking-tighter">Overdue</span>
                                        )}
                                      </div>

                                      <div className="space-y-1">
                                        <h4 className="font-semibold text-sm line-clamp-2 leading-snug">{req.subject}</h4>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                          <Settings className="h-3 w-3" />
                                          <span className="truncate">{eq?.name}</span>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between pt-2 border-t mt-2">
                                        <div className="flex items-center gap-2">
                                          <Avatar className="h-6 w-6">
                                            <AvatarImage src={tech?.avatar} />
                                            <AvatarFallback className="text-[10px]">{tech?.name?.charAt(0) || '?'}</AvatarFallback>
                                          </Avatar>
                                          <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">
                                            {tech?.name || 'Unassigned'}
                                          </span>
                                        </div>
                                        
                                        {req.type === 'Preventive' && req.scheduledDate && (
                                          <div className={cn(
                                            "flex items-center gap-1 text-[10px]",
                                            isOverdue ? "text-destructive font-bold" : "text-muted-foreground"
                                          )}>
                                            <Calendar className="h-3 w-3" />
                                            {new Date(req.scheduledDate).toLocaleDateString()}
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                    {isOverdue && <div className="absolute top-0 left-0 w-1 h-full bg-destructive rounded-l-lg" />}
                                  </Card>
                                </Link>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
