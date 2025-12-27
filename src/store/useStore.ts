import { create } from 'zustand';
import { 
  Equipment, 
  MaintenanceTeam, 
  User, 
  MaintenanceRequest, 
  RequestStatus,
  EquipmentStatus
} from '../types';
import {
  equipmentService,
  teamsService,
  usersService,
  requestsService,
  seedInitialData,
} from '../lib/firestore';

interface GearGuardState {
  equipment: Equipment[];
  teams: MaintenanceTeam[];
  users: User[];
  requests: MaintenanceRequest[];
  loading: boolean;
  initialized: boolean;
  
  initializeData: () => Promise<void>;
  subscribeToData: () => () => void;
  
  addEquipment: (equipment: Omit<Equipment, 'id'>) => Promise<void>;
  updateEquipment: (id: string, updates: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  
  addTeam: (team: Omit<MaintenanceTeam, 'id'>) => Promise<void>;
  updateTeam: (id: string, updates: Partial<MaintenanceTeam>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  
  addRequest: (request: Omit<MaintenanceRequest, 'id'>) => Promise<void>;
  updateRequest: (id: string, updates: Partial<MaintenanceRequest>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  moveRequest: (requestId: string, newStatus: RequestStatus) => Promise<void>;
  
  setEquipment: (equipment: Equipment[]) => void;
  setTeams: (teams: MaintenanceTeam[]) => void;
  setUsers: (users: User[]) => void;
  setRequests: (requests: MaintenanceRequest[]) => void;
}

export const useStore = create<GearGuardState>()((set, get) => ({
  equipment: [],
  teams: [],
  users: [],
  requests: [],
  loading: true,
  initialized: false,

  initializeData: async () => {
    if (get().initialized) return;
    
    set({ loading: true });
    try {
      await seedInitialData();
      
      const [equipment, teams, users, requests] = await Promise.all([
        equipmentService.getAll(),
        teamsService.getAll(),
        usersService.getAll(),
        requestsService.getAll(),
      ]);
      
      set({
        equipment,
        teams,
        users,
        requests,
        loading: false,
        initialized: true,
      });
    } catch (error) {
      console.error('Failed to initialize data:', error);
      set({ loading: false });
    }
  },

  subscribeToData: () => {
    const unsubEquipment = equipmentService.subscribe((equipment) => {
      set({ equipment });
    });
    
    const unsubTeams = teamsService.subscribe((teams) => {
      set({ teams });
    });
    
    const unsubUsers = usersService.subscribe((users) => {
      set({ users });
    });
    
    const unsubRequests = requestsService.subscribe((requests) => {
      set({ requests });
    });

    return () => {
      unsubEquipment();
      unsubTeams();
      unsubUsers();
      unsubRequests();
    };
  },

  addEquipment: async (eq) => {
    await equipmentService.create(eq);
  },

  updateEquipment: async (id, updates) => {
    await equipmentService.update(id, updates);
  },

  deleteEquipment: async (id) => {
    await equipmentService.delete(id);
  },

  addTeam: async (team) => {
    await teamsService.create(team);
  },

  updateTeam: async (id, updates) => {
    await teamsService.update(id, updates);
  },

  deleteTeam: async (id) => {
    await teamsService.delete(id);
  },

  addRequest: async (req) => {
    await requestsService.create(req);
  },

  updateRequest: async (id, updates) => {
    await requestsService.update(id, updates);
  },

  deleteRequest: async (id) => {
    await requestsService.delete(id);
  },

  moveRequest: async (requestId, newStatus) => {
    const request = get().requests.find(r => r.id === requestId);
    await requestsService.moveToStatus(requestId, newStatus);
    
    if (newStatus === 'Scrap' && request) {
      await equipmentService.update(request.equipmentId, { status: 'Scrapped' as EquipmentStatus });
    }
  },

  setEquipment: (equipment) => set({ equipment }),
  setTeams: (teams) => set({ teams }),
  setUsers: (users) => set({ users }),
  setRequests: (requests) => set({ requests }),
}));
