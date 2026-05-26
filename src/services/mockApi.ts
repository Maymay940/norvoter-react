import { mockUsers} from './mockData';

// Определим тип для заявки
interface RequestType {
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

let currentUser: any = null;
let nextRequestId = 5;
let nextPositionId = 6;

// Расширенные мок-данные для счетчиков с привязкой к пользователям
const mockMetersData = [
  { 
    id: 1, 
    user_id: 1,
    address: 'ул. Пушкина, д. 10, кв. 5', 
    serial_number: '30069237', 
    meter_type: 'HOT', 
    meter_model: 'СГВ-15', 
    installation_date: '2023-01-15', 
    last_verified_reading: 1250, 
    photo_url: null, 
    setup_video_url: null 
  },
  { 
    id: 2, 
    user_id: 1,
    address: 'ул. Пушкина, д. 10, кв. 5', 
    serial_number: '0014443', 
    meter_type: 'COLD', 
    meter_model: 'СХВ-13', 
    installation_date: '2023-01-15', 
    last_verified_reading: 2030, 
    photo_url: null, 
    setup_video_url: null 
  },
  { 
    id: 3, 
    user_id: 1,
    address: 'ул. Пушкина, д. 10, кв. 5', 
    serial_number: '9876543', 
    meter_type: 'HOT', 
    meter_model: 'СГВ-20', 
    installation_date: '2024-01-10', 
    last_verified_reading: 450, 
    photo_url: null, 
    setup_video_url: null 
  },
  { 
    id: 4, 
    user_id: 2,
    address: 'ул. Лермонтова, д. 5, кв. 12', 
    serial_number: '5551234', 
    meter_type: 'COLD', 
    meter_model: 'СХВ-15', 
    installation_date: '2022-06-20', 
    last_verified_reading: 3420, 
    photo_url: null, 
    setup_video_url: null 
  },
  { 
    id: 5, 
    user_id: 2,
    address: 'ул. Лермонтова, д. 5, кв. 12', 
    serial_number: '5554321', 
    meter_type: 'HOT', 
    meter_model: 'СГВ-15', 
    installation_date: '2022-06-20', 
    last_verified_reading: 2870, 
    photo_url: null, 
    setup_video_url: null 
  },
];

// Расширенные заявки
const mockRequestsData: RequestType[] = [
  {
    id: 1,
    user_id: 1,
    status: 'submitted',
    created_at: '2024-01-15T10:00:00Z',
    submitted_at: '2024-01-15T10:30:00Z',
    completed_at: null,
    positions_count: 2,
    total_consumption: 150,
    amount_to_pay: 7500,
    comment: 'Обычная подача показаний'
  },
  {
    id: 2,
    user_id: 1,
    status: 'completed',
    created_at: '2024-01-01T09:00:00Z',
    submitted_at: '2024-01-01T09:15:00Z',
    completed_at: '2024-01-02T14:00:00Z',
    positions_count: 2,
    total_consumption: 120,
    amount_to_pay: 6000,
    comment: 'Показания за декабрь'
  },
  {
    id: 3,
    user_id: 1,
    status: 'draft',
    created_at: '2024-01-20T11:00:00Z',
    submitted_at: null,
    completed_at: null,
    positions_count: 1,
    total_consumption: null,
    amount_to_pay: null,
    comment: ''
  },
  {
    id: 4,
    user_id: 2,
    status: 'submitted',
    created_at: '2024-01-14T08:00:00Z',
    submitted_at: '2024-01-14T08:20:00Z',
    completed_at: null,
    positions_count: 2,
    total_consumption: 200,
    amount_to_pay: 10000,
    comment: 'Показания счетчиков'
  },
];

// Позиции заявок
const mockPositionsData = [
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
    water_meter_id: 3,
    water_meter__address: 'ул. Пушкина, д. 10, кв. 5',
    water_meter__meter_type: 'HOT',
    water_meter__last_verified_reading: 400,
    current_reading: 450,
    consumption: 50
  },
  {
    id: 6,
    request_id: 4,
    water_meter_id: 4,
    water_meter__address: 'ул. Лермонтова, д. 5, кв. 12',
    water_meter__meter_type: 'COLD',
    water_meter__last_verified_reading: 3300,
    current_reading: 3420,
    consumption: 120
  },
  {
    id: 7,
    request_id: 4,
    water_meter_id: 5,
    water_meter__address: 'ул. Лермонтова, д. 5, кв. 12',
    water_meter__meter_type: 'HOT',
    water_meter__last_verified_reading: 2750,
    current_reading: 2870,
    consumption: 120
  },
];

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Логин
export const mockLogin = async (username: string, password: string) => {
  await delay();
  const user = mockUsers.find(u => u.username === username && u.password === password);
  if (user) {
    currentUser = { ...user };
    delete currentUser.password;
    return { success: true, data: currentUser };
  }
  return { success: false, error: 'Неверный логин или пароль' };
};

export const mockLogout = async () => {
  await delay();
  currentUser = null;
  return { success: true };
};

// Счетчики - возвращаем только для текущего пользователя или все для админа
export const mockGetMeters = async () => {
  await delay();
  if (!currentUser) return { success: true, data: [] };
  
  let meters = mockMetersData;
  if (!currentUser.is_admin) {
    meters = mockMetersData.filter(m => m.user_id === currentUser.id);
  }
  return { success: true, data: meters };
};

export const mockGetMeterById = async (id: number) => {
  await delay();
  const meter = mockMetersData.find(m => m.id === id);
  return { success: true, data: meter };
};

// Корзина (черновик заявки)
export const mockGetCart = async () => {
  await delay();
  if (!currentUser) return { success: true, data: { request_id: null, items_count: 0 } };
  
  const draft = mockRequestsData.find(r => r.user_id === currentUser.id && r.status === 'draft');
  if (draft) {
    const items = mockPositionsData.filter(p => p.request_id === draft.id);
    return { success: true, data: { request_id: draft.id, items_count: items.length } };
  }
  return { success: true, data: { request_id: null, items_count: 0 } };
};

// Заявки
export const mockGetRequests = async (status?: string) => {
  await delay();
  if (!currentUser) return { success: true, data: { requests: [] } };
  
  let requests = mockRequestsData.filter(r => r.user_id === currentUser.id);
  if (status && status !== 'all') {
    requests = requests.filter(r => r.status === status);
  }
  const result = requests.map(r => ({
    ...r,
    positions_count: mockPositionsData.filter(p => p.request_id === r.id).length,
  }));
  return { success: true, data: { requests: result } };
};

export const mockGetRequestById = async (id: number) => {
  await delay();
  const request = mockRequestsData.find(r => r.id === id);
  if (!request) return { success: false, error: 'Заявка не найдена' };
  
  // Проверяем, что заявка принадлежит текущему пользователю или пользователь админ
  if (!currentUser?.is_admin && request.user_id !== currentUser?.id) {
    return { success: false, error: 'Нет доступа' };
  }
  
  const positions = mockPositionsData.filter(p => p.request_id === id);
  return { success: true, data: { ...request, positions } };
};

// Добавление позиции
export const mockAddPosition = async (meterId: number, currentReading: number, _requestId?: number) => {
  await delay();
  if (!currentUser) return { success: false, error: 'Пользователь не авторизован' };
  
  const meter = mockMetersData.find(m => m.id === meterId);
  if (!meter) return { success: false, error: 'Счётчик не найден' };
  
  let draft = mockRequestsData.find(r => r.user_id === currentUser.id && r.status === 'draft');
  
  if (!draft) {
    const newDraft: RequestType = {
      id: nextRequestId++,
      user_id: currentUser.id,
      status: 'draft',
      created_at: new Date().toISOString(),
      submitted_at: null,
      completed_at: null,
      positions_count: 0,
      total_consumption: null,
      amount_to_pay: null,
      comment: '',
    };
    mockRequestsData.push(newDraft);
    draft = newDraft;
  }
  
  const consumption = currentReading - meter.last_verified_reading;
  const newPosition = {
    id: nextPositionId++,
    request_id: draft.id,
    water_meter_id: meter.id,
    water_meter__address: meter.address,
    water_meter__meter_type: meter.meter_type,
    water_meter__last_verified_reading: meter.last_verified_reading,
    current_reading: currentReading,
    consumption,
  };
  mockPositionsData.push(newPosition);
  
  return { success: true, data: { position_id: newPosition.id, request_id: draft.id } };
};

// Удаление позиции
export const mockDeletePosition = async (positionId: number) => {
  await delay();
  const index = mockPositionsData.findIndex(p => p.id === positionId);
  if (index !== -1) mockPositionsData.splice(index, 1);
  return { success: true };
};

// Отправка заявки
export const mockSubmitRequest = async (requestId: number) => {
  await delay();
  const request = mockRequestsData.find(r => r.id === requestId);
  if (request && request.status === 'draft') {
    request.status = 'submitted';
    request.submitted_at = new Date().toISOString();
    const positions = mockPositionsData.filter(p => p.request_id === requestId);
    const total_consumption = positions.reduce((sum, p) => sum + p.consumption, 0);
    request.total_consumption = total_consumption;
    request.amount_to_pay = total_consumption * 50;
  }
  return { success: true };
};

// Завершение заявки (для админа)
export const mockCompleteRequest = async (requestId: number) => {
  await delay();
  if (!currentUser?.is_admin) return { success: false, error: 'Только для администратора' };
  
  const request = mockRequestsData.find(r => r.id === requestId);
  if (request && request.status === 'submitted') {
    request.status = 'completed';
    request.completed_at = new Date().toISOString();
  }
  return { success: true };
};

// Отклонение заявки (для админа)
export const mockRejectRequest = async (requestId: number) => {
  await delay();
  if (!currentUser?.is_admin) return { success: false, error: 'Только для администратора' };
  
  const request = mockRequestsData.find(r => r.id === requestId);
  if (request && request.status === 'submitted') {
    request.status = 'rejected';
    request.completed_at = new Date().toISOString();
  }
  return { success: true };
};

// Удаление заявки
export const mockDeleteRequest = async (requestId: number) => {
  await delay();
  const requestIndex = mockRequestsData.findIndex(r => r.id === requestId);
  if (requestIndex !== -1) mockRequestsData.splice(requestIndex, 1);
  
  const positionsToDelete = mockPositionsData.filter(p => p.request_id === requestId);
  positionsToDelete.forEach(p => {
    const posIndex = mockPositionsData.findIndex(pos => pos.id === p.id);
    if (posIndex !== -1) mockPositionsData.splice(posIndex, 1);
  });
  return { success: true };
};

// Регистрация
export const mockRegister = async (userData: any) => {
  await delay();
  const existingUser = mockUsers.find(u => u.username === userData.username);
  if (existingUser) {
    return { success: false, error: 'Пользователь уже существует' };
  }
  
  const newUser = {
    id: mockUsers.length + 1,
    username: userData.username,
    password: userData.password,
    is_admin: false,
    first_name: userData.first_name || '',
    last_name: userData.last_name || '',
    phone: userData.phone || '',
    email: userData.email || '',
    account_number: userData.account_number,
  };
  mockUsers.push(newUser);
  
  return { success: true, data: newUser };
};

// Для админки - все заявки
export const mockGetAllRequests = async () => {
  await delay();
  if (!currentUser?.is_admin) return { success: false, error: 'Доступ только для администратора' };
  
  const allRequests = mockRequestsData.map(r => ({
    ...r,
    positions_count: mockPositionsData.filter(p => p.request_id === r.id).length,
  }));
  return { success: true, data: { requests: allRequests } };
};

// Для админки - все пользователи
export const mockGetAllUsers = async () => {
  await delay();
  if (!currentUser?.is_admin) return { success: false, error: 'Доступ только для администратора' };
  
  const usersWithoutPassword = mockUsers.map(({ password: _, ...user }) => user);
  return { success: true, data: usersWithoutPassword };
};

export const isMockAuthenticated = () => currentUser !== null;
export const getMockCurrentUser = () => currentUser;