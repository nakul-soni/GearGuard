'use client';

import { useState } from 'react';
import { Plus, Users, User, Shield, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

export default function TeamsPage() {
  const { teams, users } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Teams</h1>
          <p className="text-muted-foreground">Manage specialized teams and their assigned technicians.</p>
        </div>
        
        <Button className="gap-2 shadow-lg shadow-primary/20" onClick={() => toast.info('Team creation functionality coming soon!')}>
          <Plus className="h-4 w-4" />
          Create Team
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {teams.map((team, index) => {
            const teamMembers = users.filter((u) => u.teamId === team.id);
            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <Card className="h-full border-none bg-card/50 shadow-lg backdrop-blur-sm transition-all hover:bg-card/80">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Shield className="h-5 w-5" />
                      </div>
                      <CardTitle>{team.name}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {team.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Members
                      </span>
                      <span className="font-semibold">{teamMembers.length} Technicians</span>
                    </div>
                    
                    <div className="flex -space-x-2 overflow-hidden py-2">
                      {teamMembers.map((member) => (
                        <Avatar key={member.id} className="inline-block border-2 border-background ring-2 ring-primary/5 transition-transform hover:z-10 hover:scale-110 cursor-pointer">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>

                    <div className="pt-4 border-t flex gap-2">
                      <Button variant="outline" size="sm" className="w-full text-xs">Manage Members</Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
