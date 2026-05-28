import type { Meter } from '../types/meter';

interface User {
  id: number;
  username: string;
  password: string;
  is_admin: boolean;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface Request {
  id: number;
  user_id: number;
  status: string;
  created_at: string;
  submitted_at: string | null;
  completed_at: string | null;
  positions_count: number;
  total_consumption: number | null;
  amount_to_pay: number | null;
  comment: string;
}

export const mockUsers: User[] = [
  { 
    id: 1, 
    username: 'admin', 
    password: 'admin123',
    is_admin: true, 
    first_name: 'Администратор', 
    last_name: 'Системы', 
    email: 'admin@norvoter.com', 
    phone: '+7(999)000-00-00' 
  },
  { 
    id: 2, 
    username: 'ivanov', 
    password: 'user123',
    is_admin: false, 
    first_name: 'Иван', 
    last_name: 'Иванов', 
    email: 'ivanov@email.com', 
    phone: '+7(999)123-45-67' 
  },
];

export const meterOwners: Record<number, number> = {
  1: 2,  // счетчик 1 принадлежит Иванову (id:2)
  2: 2,  // счетчик 2 принадлежит Иванову (id:2)
};

export const mockMeters: Meter[] = [
  { id: 1, address: 'ул. Пушкина, д. 10, кв. 5', serial_number: '30069237', meter_type: 'HOT', meter_model: 'СГВ-15', installation_date: '2023-01-15', last_verified_reading: 1250, photo_url: null, setup_video_url: null },
  { id: 2, address: 'ул. Пушкина, д. 10, кв. 5', serial_number: '0014443', meter_type: 'COLD', meter_model: 'СХВ-13', installation_date: '2023-01-15', last_verified_reading: 2030, photo_url: null, setup_video_url: null },
];

export const mockRequests: Request[] = [
  { id: 1, user_id: 2, status: 'submitted', created_at: '2026-05-20 10:00:00', submitted_at: '2026-05-20 10:00:00', completed_at: null, positions_count: 2, total_consumption: 95, amount_to_pay: 4750, comment: '' },
  { id: 2, user_id: 2, status: 'completed', created_at: '2026-05-19 09:00:00', submitted_at: '2026-05-19 09:00:00', completed_at: '2026-05-19 15:00:00', positions_count: 1, total_consumption: 45, amount_to_pay: 2250, comment: '' },
];

export const mockPositions = [
  { id: 1, request_id: 1, water_meter_id: 1, water_meter__address: 'ул. Пушкина, д. 10, кв. 5', water_meter__meter_type: 'HOT', water_meter__last_verified_reading: 1250, current_reading: 1295, consumption: 45 },
  { id: 2, request_id: 1, water_meter_id: 2, water_meter__address: 'ул. Пушкина, д. 10, кв. 5', water_meter__meter_type: 'COLD', water_meter__last_verified_reading: 2030, current_reading: 2080, consumption: 50 },
  { id: 3, request_id: 2, water_meter_id: 1, water_meter__address: 'ул. Пушкина, д. 10, кв. 5', water_meter__meter_type: 'HOT', water_meter__last_verified_reading: 1250, current_reading: 1295, consumption: 45 },
];