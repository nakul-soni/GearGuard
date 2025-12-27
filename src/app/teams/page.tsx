'use client';

import { useState, useMemo } from 'react';
import { Plus, Users, User, Shield, Info, UserPlus, Trash2, Settings, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStore } from '@/store/useStore';
import { usersService } from '@/lib/firestore';
import { toast } from 'sonner';
import type { User as UserType, MaintenanceTeam } from '@/types';

export default function TeamsPage() {
  const { teams, users, equipment, addTeam, updateTeam, deleteTeam } = useStore();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<MaintenanceTeam | null>(null);
  
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  
  const [addMemberStep, setAddMemberStep] = useState<'team' | 'user' | 'equipment'>('team');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<string[]>([]);

  const availableUsers = useMemo(() => {
    return users.filter(u => !u.teamId);
  }, [users]);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }
    
    try {
      await addTeam({
        name: newTeamName.trim(),
        description: newTeamDescription.trim(),
        memberIds: [],
      });
      toast.success('Team created successfully!');
      setCreateDialogOpen(false);
      setNewTeamName('');
      setNewTeamDescription('');
    } catch (error) {
      toast.error('Failed to create team');
    }
  };

  const handleManageTeam = (team: MaintenanceTeam) => {
    setSelectedTeam(team);
    setManageDialogOpen(true);
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedTeam) return;
    
    try {
      await usersService.update(userId, { teamId: undefined });
      await updateTeam(selectedTeam.id, {
        memberIds: selectedTeam.memberIds.filter(id => id !== userId),
      });
      toast.success('Member removed from team');
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  const handleDeleteTeam = async () => {
    if (!selectedTeam) return;
    
    const teamMembers = users.filter(u => u.teamId === selectedTeam.id);
    
    try {
      for (const member of teamMembers) {
        await usersService.update(member.id, { teamId: undefined });
      }
      await deleteTeam(selectedTeam.id);
      toast.success('Team deleted successfully');
      setManageDialogOpen(false);
      setSelectedTeam(null);
    } catch (error) {
      toast.error('Failed to delete team');
    }
  };

  const openAddMemberDialog = () => {
    setAddMemberStep('team');
    setSelectedTeamId('');
    setSelectedUserId('');
    setSelectedEquipmentIds([]);
    setAddMemberDialogOpen(true);
  };

  const handleSelectTeamForMember = (teamId: string) => {
    setSelectedTeamId(teamId);
    setAddMemberStep('user');
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    setAddMemberStep('equipment');
  };

  const handleToggleEquipment = (equipmentId: string) => {
    setSelectedEquipmentIds(prev => 
      prev.includes(equipmentId) 
        ? prev.filter(id => id !== equipmentId)
        : [...prev, equipmentId]
    );
  };

  const handleAddMemberComplete = async () => {
    if (!selectedTeamId || !selectedUserId) {
      toast.error('Please select a team and user');
      return;
    }

    try {
      await usersService.update(selectedUserId, { 
        teamId: selectedTeamId,
        role: 'Technician',
      });
      
      const team = teams.find(t => t.id === selectedTeamId);
      if (team) {
        await updateTeam(selectedTeamId, {
          memberIds: [...team.memberIds, selectedUserId],
        });
      }

      const { updateEquipment } = useStore.getState();
      for (const eqId of selectedEquipmentIds) {
        await updateEquipment(eqId, { 
          defaultTechnicianId: selectedUserId,
          maintenanceTeamId: selectedTeamId,
        });
      }

      toast.success('Member added to team successfully!');
      setAddMemberDialogOpen(false);
      setAddMemberStep('team');
      setSelectedTeamId('');
      setSelectedUserId('');
      setSelectedEquipmentIds([]);
    } catch (error) {
      toast.error('Failed to add member to team');
    }
  };

  const selectedTeamForMember = teams.find(t => t.id === selectedTeamId);
  const selectedUserForMember = users.find(u => u.id === selectedUserId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Teams</h1>
          <p className="text-muted-foreground">Manage specialized teams and their assigned technicians.</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={openAddMemberDialog}>
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
          <Button className="gap-2 shadow-lg shadow-primary/20" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Team
          </Button>
        </div>
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
                    
                    <div className="flex -space-x-2 overflow-hidden py-2 min-h-[48px]">
                      {teamMembers.length > 0 ? (
                        teamMembers.map((member) => (
                          <Avatar key={member.id} className="inline-block border-2 border-background ring-2 ring-primary/5 transition-transform hover:z-10 hover:scale-110 cursor-pointer">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No members yet</p>
                      )}
                    </div>

                    <div className="pt-4 border-t flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs"
                        onClick={() => handleManageTeam(team)}
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Manage Members
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Add a new maintenance team to organize your technicians.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                placeholder="e.g., HVAC Team"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-description">Description</Label>
              <Textarea
                id="team-description"
                placeholder="Describe the team's responsibilities..."
                value={newTeamDescription}
                onChange={(e) => setNewTeamDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTeam}>Create Team</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage {selectedTeam?.name}</DialogTitle>
            <DialogDescription>
              View and manage team members.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="text-sm font-medium">Team Members</Label>
            <ScrollArea className="h-[300px] mt-2 rounded-md border p-2">
              {selectedTeam && users.filter(u => u.teamId === selectedTeam.id).length > 0 ? (
                users.filter(u => u.teamId === selectedTeam.id).map((member) => {
                  const memberEquipment = equipment.filter(e => e.defaultTechnicianId === member.id);
                  return (
                    <div key={member.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {memberEquipment.length} equipment assigned
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No members in this team yet.
                </p>
              )}
            </ScrollArea>
          </div>
          <DialogFooter className="flex justify-between">
            <Button 
              variant="destructive" 
              onClick={handleDeleteTeam}
            >
              Delete Team
            </Button>
            <Button variant="outline" onClick={() => setManageDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {addMemberStep === 'team' && 'Select a Team'}
              {addMemberStep === 'user' && 'Select a User'}
              {addMemberStep === 'equipment' && 'Assign Equipment (Optional)'}
            </DialogTitle>
            <DialogDescription>
              {addMemberStep === 'team' && 'Choose which team to add a member to.'}
              {addMemberStep === 'user' && `Adding member to ${selectedTeamForMember?.name}. Select a user from the registered users.`}
              {addMemberStep === 'equipment' && `Optionally assign equipment to ${selectedUserForMember?.name}.`}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {addMemberStep === 'team' && (
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSelectTeamForMember(team.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                          <Shield className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{team.name}</p>
                          <p className="text-xs text-muted-foreground">{team.description}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {users.filter(u => u.teamId === team.id).length} members
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {addMemberStep === 'user' && (
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {availableUsers.length > 0 ? (
                    availableUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSelectUser(user.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.role}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No available users. All users are already assigned to teams.
                    </p>
                  )}
                </div>
              </ScrollArea>
            )}

            {addMemberStep === 'equipment' && (
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {equipment.filter(e => e.status === 'Active').map((eq) => (
                    <div
                      key={eq.id}
                      className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleToggleEquipment(eq.id)}
                    >
                      <Checkbox 
                        checked={selectedEquipmentIds.includes(eq.id)}
                        onCheckedChange={() => handleToggleEquipment(eq.id)}
                      />
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Wrench className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{eq.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {eq.location} • {eq.department}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          <DialogFooter>
            {addMemberStep !== 'team' && (
              <Button 
                variant="outline" 
                onClick={() => {
                  if (addMemberStep === 'user') setAddMemberStep('team');
                  if (addMemberStep === 'equipment') setAddMemberStep('user');
                }}
              >
                Back
              </Button>
            )}
            {addMemberStep === 'equipment' && (
              <Button onClick={handleAddMemberComplete}>
                {selectedEquipmentIds.length > 0 
                  ? `Add Member with ${selectedEquipmentIds.length} Equipment`
                  : 'Add Member without Equipment'
                }
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
