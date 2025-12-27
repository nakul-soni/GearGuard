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
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  Equipment, 
  MaintenanceTeam, 
  User, 
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
  }
}
