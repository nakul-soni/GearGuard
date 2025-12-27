import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  query,
  where,
  orderBy,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  Equipment, 
  MaintenanceTeam, 
  User, 
  MaintenanceRequest,
  RequestStatus,
  EquipmentStatus 
} from '@/types';

const COLLECTIONS = {
  equipment: 'equipment',
  teams: 'teams',
  users: 'users',
  requests: 'requests',
} as const;

export const equipmentService = {
  async getAll(): Promise<Equipment[]> {
    const snapshot = await getDocs(collection(db, COLLECTIONS.equipment));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Equipment));
  },

  async getById(id: string): Promise<Equipment | null> {
    const docRef = await getDoc(doc(db, COLLECTIONS.equipment, id));
    if (!docRef.exists()) return null;
    return { id: docRef.id, ...docRef.data() } as Equipment;
  },

  async create(equipment: Omit<Equipment, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.equipment), equipment);
    return docRef.id;
  },

  async update(id: string, updates: Partial<Equipment>): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.equipment, id), updates);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.equipment, id));
  },

  subscribe(callback: (equipment: Equipment[]) => void): Unsubscribe {
    return onSnapshot(collection(db, COLLECTIONS.equipment), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Equipment));
      callback(data);
    });
  },
};

export const teamsService = {
  async getAll(): Promise<MaintenanceTeam[]> {
    const snapshot = await getDocs(collection(db, COLLECTIONS.teams));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MaintenanceTeam));
  },

  async create(team: Omit<MaintenanceTeam, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.teams), team);
    return docRef.id;
  },

  async update(id: string, updates: Partial<MaintenanceTeam>): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.teams, id), updates);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.teams, id));
  },

  subscribe(callback: (teams: MaintenanceTeam[]) => void): Unsubscribe {
    return onSnapshot(collection(db, COLLECTIONS.teams), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MaintenanceTeam));
      callback(data);
    });
  },
};

export const usersService = {
  async getAll(): Promise<User[]> {
    const snapshot = await getDocs(collection(db, COLLECTIONS.users));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  },

  async getById(id: string): Promise<User | null> {
    const docRef = await getDoc(doc(db, COLLECTIONS.users, id));
    if (!docRef.exists()) return null;
    return { id: docRef.id, ...docRef.data() } as User;
  },

  async getByTeam(teamId: string): Promise<User[]> {
    const q = query(collection(db, COLLECTIONS.users), where('teamId', '==', teamId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  },

  async update(id: string, updates: Partial<User>): Promise<void> {
    const updateData: Record<string, unknown> = { ...updates };
    if (updates.teamId === undefined) {
      updateData.teamId = deleteField();
    }
    await updateDoc(doc(db, COLLECTIONS.users, id), updateData);
  },

  subscribe(callback: (users: User[]) => void): Unsubscribe {
    return onSnapshot(collection(db, COLLECTIONS.users), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      callback(data);
    });
  },
};

export const requestsService = {
  async getAll(): Promise<MaintenanceRequest[]> {
    const snapshot = await getDocs(collection(db, COLLECTIONS.requests));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MaintenanceRequest));
  },

  async getById(id: string): Promise<MaintenanceRequest | null> {
    const docRef = await getDoc(doc(db, COLLECTIONS.requests, id));
    if (!docRef.exists()) return null;
    return { id: docRef.id, ...docRef.data() } as MaintenanceRequest;
  },

  async getByEquipment(equipmentId: string): Promise<MaintenanceRequest[]> {
    const q = query(collection(db, COLLECTIONS.requests), where('equipmentId', '==', equipmentId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MaintenanceRequest));
  },

  async getByStatus(status: RequestStatus): Promise<MaintenanceRequest[]> {
    const q = query(collection(db, COLLECTIONS.requests), where('status', '==', status));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MaintenanceRequest));
  },

  async create(request: Omit<MaintenanceRequest, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.requests), request);
    return docRef.id;
  },

  async update(id: string, updates: Partial<MaintenanceRequest>): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.requests, id), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.requests, id));
  },

  async moveToStatus(id: string, newStatus: RequestStatus): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.requests, id), {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  },

  subscribe(callback: (requests: MaintenanceRequest[]) => void): Unsubscribe {
    return onSnapshot(collection(db, COLLECTIONS.requests), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MaintenanceRequest));
      callback(data);
    });
  },
};

export async function seedInitialData() {
  const teamsSnapshot = await getDocs(collection(db, COLLECTIONS.teams));
  if (teamsSnapshot.empty) {
    const mockTeams = [
      { name: 'Mechanics', description: 'Mechanical repairs', memberIds: [] },
      { name: 'Electricians', description: 'Electrical systems', memberIds: [] },
      { name: 'IT Support', description: 'IT systems', memberIds: [] },
    ];
    for (const team of mockTeams) {
      await addDoc(collection(db, COLLECTIONS.teams), team);
    }
  }

  const equipmentSnapshot = await getDocs(collection(db, COLLECTIONS.equipment));
  if (equipmentSnapshot.empty) {
    const teams = await teamsService.getAll();
    const mechanicsTeam = teams.find(t => t.name === 'Mechanics');
    const itTeam = teams.find(t => t.name === 'IT Support');
    
    const mockEquipment = [
      {
        name: 'CNC Machine',
        serialNumber: 'CNC-001',
        purchaseDate: '2023-01-15',
        warrantyInfo: '2 Years',
        location: 'Floor A',
        department: 'Production',
        assignedEmployee: 'Robert J.',
        maintenanceTeamId: mechanicsTeam?.id || '',
        defaultTechnicianId: '',
        category: 'Manufacturing',
        status: 'Active'
      },
      {
        name: 'Workstation IT01',
        serialNumber: 'WS-7722',
        purchaseDate: '2023-11-01',
        warrantyInfo: '3 Years',
        location: 'Office 402',
        department: 'Engineering',
        assignedEmployee: 'Alice C.',
        maintenanceTeamId: itTeam?.id || '',
        defaultTechnicianId: '',
        category: 'Computing',
        status: 'Active'
      }
    ];
    for (const eq of mockEquipment) {
      await addDoc(collection(db, COLLECTIONS.equipment), eq);
    }
  }

  const requestsSnapshot = await getDocs(collection(db, COLLECTIONS.requests));
  if (requestsSnapshot.empty) {
    console.log('Seeding requests...');
    const equipment = await equipmentService.getAll();
    if (equipment.length > 0) {
      const cnc = equipment.find(e => e.name === 'CNC Machine') || equipment[0];
      const ws = equipment.find(e => e.name === 'Workstation IT01') || (equipment[1] || equipment[0]);
      
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

      const mockRequests = [
        {
          subject: 'Annual Calibration',
          equipmentId: cnc.id,
          type: 'Preventive',
          scheduledDate: today,
          status: 'New',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          subject: 'Oil Filter Replacement',
          equipmentId: cnc.id,
          type: 'Preventive',
          scheduledDate: tomorrow,
          status: 'In Progress',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          subject: 'Software Update',
          equipmentId: ws.id,
          type: 'Preventive',
          scheduledDate: nextWeek,
          status: 'New',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          subject: 'Broken cooling fan',
          equipmentId: cnc.id,
          type: 'Corrective',
          status: 'Repaired',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          subject: 'Hydraulic leak',
          equipmentId: cnc.id,
          type: 'Corrective',
          status: 'In Progress',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      for (const req of mockRequests) {
        await addDoc(collection(db, COLLECTIONS.requests), req);
      }
      console.log('Requests seeded.');
    } else {
      console.log('No equipment found to link requests to.');
    }
  }
}
