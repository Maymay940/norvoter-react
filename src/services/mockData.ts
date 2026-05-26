// services/mockData.ts
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

interface Position {
  id: number;
  request_id: number;
  water_meter_id: number;
  water_meter__address: string;
  water_meter__meter_type: string;
  water_meter__last_verified_reading: number;
  current_reading: number;
  consumption: number;
}

export const mockUsers: User[] = [
  { id: 1, username: 'admin', password: '123', is_admin: true, first_name: 'Администратор', last_name: 'Системы', email: 'admin@norvoter.com', phone: '+7(999)000-00-00' },
  { id: 2, username: 'ivanov', password: '123', is_admin: false, first_name: 'Иван', last_name: 'Иванов', email: 'ivanov@email.com', phone: '+7(999)123-45-67' },
  { id: 3, username: 'petrov', password: '123', is_admin: false, first_name: 'Петр', last_name: 'Петров', email: 'petrov@email.com', phone: '+7(999)234-56-78' },
  { id: 4, username: 'sidorova', password: '123', is_admin: false, first_name: 'Анна', last_name: 'Сидорова', email: 'sidorova@email.com', phone: '+7(999)345-67-89' },
];

export const mockMeters: Meter[] = [
  { id: 1, address: 'ул. Пушкина, д. 10, кв. 5', serial_number: '30069237', meter_type: 'HOT', meter_model: 'СГВ-15', installation_date: '2023-01-15', last_verified_reading: 1250, photo_url: 'https://picsum.photos/id/20/300/200', setup_video_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 2, address: 'ул. Пушкина, д. 10, кв. 5', serial_number: '0014443', meter_type: 'COLD', meter_model: 'СХВ-13', installation_date: '2023-01-15', last_verified_reading: 2030, photo_url: 'https://picsum.photos/id/21/300/200', setup_video_url: null },
  { id: 3, address: 'ул. Победы, д. 22, кв. 7', serial_number: '5258402', meter_type: 'COLD', meter_model: 'ДУ-32', installation_date: '2022-05-20', last_verified_reading: 3456, photo_url: 'https://picsum.photos/id/22/300/200', setup_video_url: null },
  { id: 4, address: 'ул. Победы, д. 22, кв. 7', serial_number: '5312913', meter_type: 'HOT', meter_model: 'ДУ-32', installation_date: '2022-05-20', last_verified_reading: 2150, photo_url: 'https://picsum.photos/id/23/300/200', setup_video_url: null },
  { id: 5, address: 'ул. Советская, д. 3, кв. 89', serial_number: '0008397', meter_type: 'HOT', meter_model: 'Г1', installation_date: '2024-02-01', last_verified_reading: 450, photo_url: 'https://picsum.photos/id/24/300/200', setup_video_url: null },
  { id: 6, address: 'ул. Советская, д. 3, кв. 89', serial_number: '0008391', meter_type: 'COLD', meter_model: 'Х1', installation_date: '2024-02-01', last_verified_reading: 380, photo_url: 'https://picsum.photos/id/25/300/200', setup_video_url: null },
  { id: 7, address: 'ул. Лесная, д. 12, кв. 23', serial_number: '14-272442', meter_type: 'COLD', meter_model: 'WFK2', installation_date: '2023-11-10', last_verified_reading: 890, photo_url: 'https://picsum.photos/id/26/300/200', setup_video_url: null },
  { id: 8, address: 'ул. Садовая, д. 4, кв. 45', serial_number: '14-283074', meter_type: 'HOT', meter_model: 'WFW2', installation_date: '2023-11-10', last_verified_reading: 920, photo_url: 'https://picsum.photos/id/27/300/200', setup_video_url: null },
];

export const mockRequests: Request[] = [
  { id: 1, user_id: 2, status: 'submitted', created_at: '2026-05-20 10:00:00', submitted_at: '2026-05-20 10:00:00', completed_at: null, positions_count: 2, total_consumption: 95, amount_to_pay: 4750, comment: '' },
  { id: 2, user_id: 2, status: 'completed', created_at: '2026-05-19 09:00:00', submitted_at: '2026-05-19 09:00:00', completed_at: '2026-05-19 15:00:00', positions_count: 1, total_consumption: 45, amount_to_pay: 2250, comment: '' },
  { id: 3, user_id: 3, status: 'submitted', created_at: '2026-05-18 14:00:00', submitted_at: '2026-05-18 14:00:00', completed_at: null, positions_count: 3, total_consumption: 120, amount_to_pay: 6000, comment: '' },
  { id: 4, user_id: 3, status: 'rejected', created_at: '2026-05-17 11:00:00', submitted_at: '2026-05-17 11:00:00', completed_at: '2026-05-17 16:00:00', positions_count: 1, total_consumption: 30, amount_to_pay: 1500, comment: 'Превышение нормы' },
];

export const mockPositions: Position[] = [
  { id: 1, request_id: 1, water_meter_id: 1, water_meter__address: 'ул. Пушкина, д. 10, кв. 5', water_meter__meter_type: 'HOT', water_meter__last_verified_reading: 1250, current_reading: 1295, consumption: 45 },
  { id: 2, request_id: 1, water_meter_id: 2, water_meter__address: 'ул. Пушкина, д. 10, кв. 5', water_meter__meter_type: 'COLD', water_meter__last_verified_reading: 2030, current_reading: 2080, consumption: 50 },
  { id: 3, request_id: 2, water_meter_id: 1, water_meter__address: 'ул. Пушкина, д. 10, кв. 5', water_meter__meter_type: 'HOT', water_meter__last_verified_reading: 1250, current_reading: 1295, consumption: 45 },
  { id: 4, request_id: 3, water_meter_id: 3, water_meter__address: 'ул. Победы, д. 22, кв. 7', water_meter__meter_type: 'COLD', water_meter__last_verified_reading: 3456, current_reading: 3500, consumption: 44 },
  { id: 5, request_id: 3, water_meter_id: 4, water_meter__address: 'ул. Победы, д. 22, кв. 7', water_meter__meter_type: 'HOT', water_meter__last_verified_reading: 2150, current_reading: 2226, consumption: 76 },
];