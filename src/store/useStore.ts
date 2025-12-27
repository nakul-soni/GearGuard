import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Equipment, 
  MaintenanceTeam, 
  User, 
  MaintenanceRequest, 
  RequestStatus,
  EquipmentStatus
} from '../types';

interface GearGuardState {
  equipment: Equipment[];
  teams: MaintenanceTeam[];
  users: User[];
  requests: MaintenanceRequest[];
  addEquipment: (equipment: Equipment) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  addTeam: (team: MaintenanceTeam) => void;
  updateTeam: (id: string, updates: Partial<MaintenanceTeam>) => void;
  deleteTeam: (id: string) => void;
  addRequest: (request: MaintenanceRequest) => void;
  updateRequest: (id: string, updates: Partial<MaintenanceRequest>) => void;
  deleteRequest: (id: string) => void;
  moveRequest: (requestId: string, newStatus: RequestStatus) => void;
}

const mockTeams: MaintenanceTeam[] = [
  { id: 'team-1', name: 'Mechanics', description: 'Mechanical repairs', memberIds: ['u-1', 'u-2'] },
  { id: 'team-2', name: 'Electricians', description: 'Electrical systems', memberIds: ['u-3'] },
  { id: 'team-3', name: 'IT Support', description: 'IT systems', memberIds: ['u-4'] },
];

const mockUsers: User[] = [
  { id: 'u-1', name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', teamId: 'team-1', role: 'Technician' },
  { id: 'u-2', name: 'Mike Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', teamId: 'team-1', role: 'Technician' },
  { id: 'u-3', name: 'Sarah Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', teamId: 'team-2', role: 'Technician' },
  { id: 'u-4', name: 'Alex Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', teamId: 'team-3', role: 'Technician' },
];

const mockEquipment: Equipment[] = [
  {
    id: 'eq-1',
    name: 'CNC Machine',
    serialNumber: 'CNC-001',
    purchaseDate: '2023-01-15',
    warrantyInfo: '2 Years',
    location: 'Floor A',
    department: 'Production',
    assignedEmployee: 'Robert J.',
    maintenanceTeamId: 'team-1',
    defaultTechnicianId: 'u-1',
    category: 'Manufacturing',
    status: 'Active'
  },
  {
    id: 'eq-2',
    name: 'Workstation IT01',
    serialNumber: 'WS-7722',
    purchaseDate: '2023-11-01',
    warrantyInfo: '3 Years',
    location: 'Office 402',
    department: 'Engineering',
    assignedEmployee: 'Alice C.',
    maintenanceTeamId: 'team-3',
    defaultTechnicianId: 'u-4',
    category: 'Computing',
    status: 'Active'
  }
];

const mockRequests: MaintenanceRequest[] = [
  {
    id: 'req-1',
    subject: 'Leaking fluid',
    equipmentId: 'eq-1',
    type: 'Corrective',
    status: 'In Progress',
    assignedTechnicianId: 'u-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useStore = create<GearGuardState>()(
  persist(
    (set) => ({
      equipment: mockEquipment,
      teams: mockTeams,
      users: mockUsers,
      requests: mockRequests,
      addEquipment: (eq) => set((state) => ({ equipment: [...state.equipment, eq] })),
      updateEquipment: (id, updates) => set((state) => ({
        equipment: state.equipment.map((eq) => eq.id === id ? { ...eq, ...updates } : eq)
      })),
      deleteEquipment: (id) => set((state) => ({
        equipment: state.equipment.filter((eq) => eq.id !== id)
      })),
      addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
      updateTeam: (id, updates) => set((state) => ({
        teams: state.teams.map((t) => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTeam: (id) => set((state) => ({
        teams: state.teams.filter((t) => t.id !== id)
      })),
      addRequest: (req) => set((state) => ({ requests: [...state.requests, req] })),
      updateRequest: (id, updates) => set((state) => ({
        requests: state.requests.map((r) => r.id === id ? { ...r, ...updates } : r)
      })),
      deleteRequest: (id) => set((state) => ({
        requests: state.requests.filter((r) => r.id !== id)
      })),
      moveRequest: (requestId, newStatus) => set((state) => {
        const updatedRequests = state.requests.map((r) => 
          r.id === requestId ? { ...r, status: newStatus, updatedAt: new Date().toISOString() } : r
        );
        const request = state.requests.find(r => r.id === requestId);
        if (newStatus === 'Scrap' && request) {
          const updatedEquipment = state.equipment.map(eq => 
            eq.id === request.equipmentId ? { ...eq, status: 'Scrapped' as EquipmentStatus } : eq
          );
          return { requests: updatedRequests, equipment: updatedEquipment };
        }
        return { requests: updatedRequests };
      }),
    }),
    { name: 'gear-guard-storage' }
  )
);
