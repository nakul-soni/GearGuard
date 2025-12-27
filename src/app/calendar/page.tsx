'use client';

import { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CalendarPage() {
  const router = useRouter();
  const { requests, equipment } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const preventiveRequests = requests.filter(r => r.type === 'Preventive' && r.scheduledDate);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getDayRequests = (day: Date) => {
    return preventiveRequests.filter(r => isSameDay(new Date(r.scheduledDate!), day));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Calendar</h1>
          <p className="text-muted-foreground">Schedule and view all preventive maintenance tasks.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[150px] text-center font-bold text-lg">
            {format(currentDate, 'MMMM yyyy')}
          </div>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="border-none bg-card/50 shadow-xl backdrop-blur-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b bg-muted/50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const dayRequests = getDayRequests(day);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, monthStart);
              
              return (
                <div 
                  key={idx} 
                  className={cn(
                    "min-h-[120px] p-2 border-r border-b relative group transition-colors hover:bg-accent/5",
                    !isCurrentMonth && "bg-muted/10 opacity-40",
                    isToday && "bg-primary/5"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={cn(
                      "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                      isToday && "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/30"
                    )}>
                      {format(day, 'd')}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => router.push(`/requests/new?date=${format(day, 'yyyy-MM-dd')}&type=Preventive`)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    {dayRequests.map(req => {
                      const eq = equipment.find(e => e.id === req.equipmentId);
                      return (
                        <Link 
                          key={req.id} 
                          href={`/requests/${req.id}`}
                          className="block p-1 rounded bg-blue-500/10 border-l-2 border-blue-500 hover:bg-blue-500/20 transition-colors"
                        >
                          <p className="text-[10px] font-bold truncate text-blue-500 leading-tight">
                            {req.subject}
                          </p>
                          <p className="text-[9px] truncate text-muted-foreground leading-tight">
                            {eq?.name}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
