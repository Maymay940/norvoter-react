import type { Meter } from '../types/meter';

export interface User {
  id: number;
  username: string;
  password: string;
  is_admin: boolean;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  account_number?: string;
}

export interface Request {
  id: number;
  user_id: number;
  status: 'draft' | 'submitted' | 'completed' | 'rejected';
  created_at: string;
  submitted_at: string | null;
  completed_at: string | null;
  positions_count: number;
  total_consumption: number | null;
  amount_to_pay: number | null;
  comment: string;
}

export interface Position {
  id: number;
  request_id: number;
  water_meter_id: number;
  water_meter__address: string;
  water_meter__meter_type: string;
  water_meter__last_verified_reading: number;
  current_reading: number;
  consumption: number;
}

// Пользователи
export const mockUsers: User[] = [
  { 
    id: 1, 
    username: 'admin', 
    password: 'admin123',
    is_admin: true, 
    first_name: 'Администратор', 
    last_name: 'Системы', 
    email: 'admin@norvoter.com', 
    phone: '+7(999)000-00-00',
    account_number: 'ADMIN001'
  },
  { 
    id: 2, 
    username: 'ivanov', 
    password: 'user123',
    is_admin: false, 
    first_name: 'Иван', 
    last_name: 'Иванов', 
    email: 'ivanov@email.com', 
    phone: '+7(999)123-45-67',
    account_number: 'IVAN2024001'
  },
];

// Счетчики
export const mockMeters: Meter[] = [
  { 
    id: 1, 
    user_id: 2,
    address: 'ул. Пушкина, д. 10, кв. 5', 
    serial_number: '30069237', 
    meter_type: 'HOT', 
    meter_model: 'СГВ-15', 
    installation_date: '2023-01-15', 
    last_verified_reading: 1250, 
    photo_url: '/norvoter-react/images/meter-hot.png',  
    setup_video_url: null
  },
  { 
    id: 2, 
    user_id: 2,
    address: 'ул. Пушкина, д. 10, кв. 5', 
    serial_number: '0014443', 
    meter_type: 'COLD', 
    meter_model: 'СХВ-13', 
    installation_date: '2023-01-15', 
    last_verified_reading: 2030, 
    photo_url: '/norvoter-react/images/meter-cold.png',
    setup_video_url: null 
  },
];

// Заявки
export const mockRequests: Request[] = [
  {
    id: 1,
    user_id: 2,
    status: 'submitted',
    created_at: new Date('2024-01-15T10:00:00Z').toISOString(),
    submitted_at: new Date('2024-01-15T10:30:00Z').toISOString(),
    completed_at: null,
    positions_count: 2,
    total_consumption: 150,
    amount_to_pay: 7500,
    comment: 'Обычная подача показаний'
  },
  {
    id: 2,
    user_id: 2,
    status: 'completed',
    created_at: new Date('2024-01-01T09:00:00Z').toISOString(),
    submitted_at: new Date('2024-01-01T09:15:00Z').toISOString(),
    completed_at: new Date('2024-01-02T14:00:00Z').toISOString(),
    positions_count: 2,
    total_consumption: 120,
    amount_to_pay: 6000,
    comment: 'Показания за декабрь'
  },
  {
    id: 3,
    user_id: 2,
    status: 'draft',
    created_at: new Date('2024-01-20T11:00:00Z').toISOString(),
    submitted_at: null,
    completed_at: null,
    positions_count: 1,
    total_consumption: null,
    amount_to_pay: null,
    comment: ''
  },
];

// Позиции заявок
export const mockPositions: Position[] = [
  {
    id: 1,
    request_id: 1,
    water_meter_id: 1,
    water_meter__address: 'ул. Пушкина, д. 10, кв. 5',
    water_meter__meter_type: 'HOT',
    water_meter__last_verified_reading: 1250,
    current_reading: 1320,
    consumption: 70
  },
  {
    id: 2,
    request_id: 1,
    water_meter_id: 2,
    water_meter__address: 'ул. Пушкина, д. 10, кв. 5',
    water_meter__meter_type: 'COLD',
    water_meter__last_verified_reading: 2030,
    current_reading: 2110,
    consumption: 80
  },
  {
    id: 3,
    request_id: 2,
    water_meter_id: 1,
    water_meter__address: 'ул. Пушкина, д. 10, кв. 5',
    water_meter__meter_type: 'HOT',
    water_meter__last_verified_reading: 1180,
    current_reading: 1250,
    consumption: 70
  },
  {
    id: 4,
    request_id: 2,
    water_meter_id: 2,
    water_meter__address: 'ул. Пушкина, д. 10, кв. 5',
    water_meter__meter_type: 'COLD',
    water_meter__last_verified_reading: 1950,
    current_reading: 2030,
    consumption: 80
  },
  {
    id: 5,
    request_id: 3,
    water_meter_id: 1,
    water_meter__address: 'ул. Пушкина, д. 10, кв. 5',
    water_meter__meter_type: 'HOT',
    water_meter__last_verified_reading: 1250,
    current_reading: 1295,
    consumption: 45
  },
];

// Переменные состояния (НЕ экспортируем напрямую)
let currentUser: User | null = null;
let nextRequestId = 4;
let nextPositionId = 6;

// ТОЛЬКО ЭКСПОРТИРУЕМЫЕ ФУНКЦИИ (без дублирования)
export const setMockCurrentUser = (user: User | null) => {
  currentUser = user;
};

export const getMockCurrentUser = () => currentUser;

export const getNextRequestId = () => nextRequestId++;
export const getNextPositionId = () => nextPositionId++;