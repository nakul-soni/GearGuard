import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
<<<<<<< HEAD
  deleteField,
=======
>>>>>>> c66372c (Final Commit)
  query,
  where,
  orderBy,
  onSnapshot,
  Unsubscribe,
<<<<<<< HEAD
} from 'firebase/firestore';
=======
  setDoc,
  Timestamp,
} from '@firebase/firestore';
>>>>>>> c66372c (Final Commit)
import { db } from './firebase';
import { 
  Equipment, 
  MaintenanceTeam, 
  User, 
<<<<<<< HEAD
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
=======
  MaintenanceRequest, 
  RequestStatus 
} from '../types';

// Generic service factory
function createService<T extends { id: string }>(collectionName: string) {
  return {
    getAll: async () => {
      const colRef = collection(db, collectionName);
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    },
    getById: async (id: string) => {
      const docRef = doc(db, collectionName, id);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T) : null;
    },
    create: async (data: Omit<T, 'id'>) => {
      const colRef = collection(db, collectionName);
      const docRef = await addDoc(colRef, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return docRef.id;
    },
    update: async (id: string, data: Partial<T>) => {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    },
    delete: async (id: string) => {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    },
    subscribe: (callback: (data: T[]) => void) => {
      const colRef = collection(db, collectionName);
      return onSnapshot(colRef, (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T)));
      });
    }
  };
}

export const equipmentService = createService<Equipment>('equipment');
export const teamsService = createService<MaintenanceTeam>('teams');
export const usersService = createService<User>('users');
export const requestsService = {
  ...createService<MaintenanceRequest>('requests'),
  moveToStatus: async (id: string, status: RequestStatus) => {
    const docRef = doc(db, 'requests', id);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
  }
};

export async function seedInitialData() {
  const equipmentCheck = await getDocs(collection(db, 'equipment'));
  if (!equipmentCheck.empty) return;

  // Initial Teams
  const teamAId = 'team-a';
  await setDoc(doc(db, 'teams', teamAId), {
    name: 'Mechanical Team',
    description: 'Specializes in mechanical repairs and maintenance',
    memberIds: ['tech-1', 'tech-2'],
  });

  const teamBId = 'team-b';
  await setDoc(doc(db, 'teams', teamBId), {
    name: 'Electrical Team',
    description: 'Specializes in electrical and control systems',
    memberIds: ['tech-3'],
  });

  // Initial Users
  const users = [
    { id: 'tech-1', name: 'John Doe', role: 'Technician', teamId: teamAId },
    { id: 'tech-2', name: 'Jane Smith', role: 'Technician', teamId: teamAId },
    { id: 'tech-3', name: 'Mike Ross', role: 'Technician', teamId: teamBId },
    { id: 'mgr-1', name: 'Harvey Specter', role: 'Manager' },
  ];

  for (const user of users) {
    await setDoc(doc(db, 'users', user.id), user);
  }

  // Initial Equipment
  const equipment = [
    {
      id: 'eq-1',
      name: 'CNC Milling Machine',
      serialNumber: 'CNC-2023-001',
      purchaseDate: '2023-01-15',
      warrantyInfo: 'Expires 2025-01-15',
      location: 'Factory Floor A',
      department: 'Production',
      assignedEmployee: 'Robert Chen',
      maintenanceTeamId: teamAId,
      defaultTechnicianId: 'tech-1',
      category: 'Manufacturing',
      status: 'Active',
    },
    {
      id: 'eq-2',
      name: 'Central Server Rack',
      serialNumber: 'SRV-882-X',
      purchaseDate: '2022-06-20',
      warrantyInfo: 'Lifetime Support',
      location: 'IT Server Room',
      department: 'IT',
      assignedEmployee: 'Sarah Connor',
      maintenanceTeamId: teamBId,
      defaultTechnicianId: 'tech-3',
      category: 'Computing',
      status: 'Active',
    }
  ];

  for (const eq of equipment) {
    await setDoc(doc(db, 'equipment', eq.id), eq);
  }

  // Initial Requests
  const requests = [
    {
      id: 'req-1',
      subject: 'Hydraulic leak check',
      equipmentId: 'eq-1',
      type: 'Preventive',
      status: 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'req-2',
      subject: 'Server overheating',
      equipmentId: 'eq-2',
      type: 'Corrective',
      status: 'In Progress',
      assignedTechnicianId: 'tech-3',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  for (const req of requests) {
    await setDoc(doc(db, 'requests', req.id), req);
>>>>>>> c66372c (Final Commit)
  }
}
