export type EquipmentStatus = 'Active' | 'Scrapped';

export type EquipmentCategory = 'Manufacturing' | 'Transportation' | 'Computing' | 'Office' | 'Other';

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyInfo: string;
  location: string;
  department: string;
  assignedEmployee: string;
  maintenanceTeamId: string;
  defaultTechnicianId: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
}

export interface MaintenanceTeam {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  teamId?: string;
  role: 'Technician' | 'Manager' | 'Employee';
  createdAt?: string;
}

export type RequestType = 'Corrective' | 'Preventive';
export type RequestStatus = 'New' | 'In Progress' | 'Repaired' | 'Scrap';

export interface MaintenanceRequest {
  id: string;
  subject: string;
  equipmentId: string;
  type: RequestType;
  scheduledDate?: string;
  duration?: number; // in hours
  assignedTechnicianId?: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}
