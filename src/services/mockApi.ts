import { mockUsers, mockMeters, mockRequests, mockPositions } from './mockData';

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
let currentDraftRequest: any = null;
let nextRequestId = 5;
let nextPositionId = 6;

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockLogin = async (username: string, password: string) => {
  await delay();
  const user = mockUsers.find(u => u.username === username && u.password === password);
  if (user) {
    currentUser = { ...user };
    return { success: true, data: currentUser };
  }
  return { success: false, error: 'Неверный логин или пароль' };
};

export const mockLogout = async () => {
  await delay();
  currentUser = null;
  currentDraftRequest = null;
  return { success: true };
};

export const mockGetMeters = async () => {
  await delay();
  return { success: true, data: mockMeters };
};

export const mockGetMeterById = async (id: number) => {
  await delay();
  const meter = mockMeters.find(m => m.id === id);
  return { success: true, data: meter };
};

export const mockGetCart = async () => {
  await delay();
  const draft = mockRequests.find(r => r.user_id === currentUser?.id && r.status === 'draft');
  if (draft) {
    const items = mockPositions.filter(p => p.request_id === draft.id);
    return { success: true, data: { request_id: draft.id, items_count: items.length } };
  }
  return { success: true, data: { request_id: null, items_count: 0 } };
};

export const mockGetRequests = async (status?: string) => {
  await delay();
  let requests = mockRequests.filter(r => r.user_id === currentUser?.id);
  if (status) {
    requests = requests.filter(r => r.status === status);
  }
  const result = requests.map(r => ({
    ...r,
    positions_count: mockPositions.filter(p => p.request_id === r.id).length,
  }));
  return { success: true, data: { requests: result } };
};

export const mockGetRequestById = async (id: number) => {
  await delay();
  const request = mockRequests.find(r => r.id === id);
  if (!request) return { success: false, error: 'Заявка не найдена' };
  const positions = mockPositions.filter(p => p.request_id === id);
  return { success: true, data: { ...request, positions } };
};

export const mockAddPosition = async (meterId: number, currentReading: number, _requestId?: number) => {
  await delay();
  const meter = mockMeters.find(m => m.id === meterId);
  if (!meter) return { success: false, error: 'Счётчик не найден' };
  
  // Проверяем, что пользователь авторизован
  if (!currentUser) {
    return { success: false, error: 'Пользователь не авторизован' };
  }
  
  let draft = mockRequests.find(r => r.user_id === currentUser.id && r.status === 'draft') as RequestType | undefined;
  
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
    mockRequests.push(newDraft);
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
  mockPositions.push(newPosition);
  
  return { success: true, data: { position_id: newPosition.id, request_id: draft.id } };
};

export const mockDeletePosition = async (positionId: number) => {
  await delay();
  const index = mockPositions.findIndex(p => p.id === positionId);
  if (index !== -1) mockPositions.splice(index, 1);
  return { success: true };
};

export const mockSubmitRequest = async (requestId: number) => {
  await delay();
  const request = mockRequests.find(r => r.id === requestId) as RequestType | undefined;
  if (request && request.status === 'draft') {
    request.status = 'submitted';
    request.submitted_at = new Date().toISOString();
    const positions = mockPositions.filter(p => p.request_id === requestId);
    const total_consumption = positions.reduce((sum, p) => sum + p.consumption, 0);
    request.total_consumption = total_consumption;
    request.amount_to_pay = total_consumption * 50;
  }
  return { success: true };
};

export const mockCompleteRequest = async (requestId: number) => {
  await delay();
  const request = mockRequests.find(r => r.id === requestId) as RequestType | undefined;
  if (request && request.status === 'submitted') {
    request.status = 'completed';
    request.completed_at = new Date().toISOString();
  }
  return { success: true };
};

export const mockRejectRequest = async (requestId: number) => {
  await delay();
  const request = mockRequests.find(r => r.id === requestId) as RequestType | undefined;
  if (request && request.status === 'submitted') {
    request.status = 'rejected';
    request.completed_at = new Date().toISOString();
  }
  return { success: true };
};

export const mockDeleteRequest = async (requestId: number) => {
  await delay();
  const index = mockRequests.findIndex(r => r.id === requestId);
  if (index !== -1) mockRequests.splice(index, 1);
  const positionsToDelete = mockPositions.filter(p => p.request_id === requestId);
  positionsToDelete.forEach(p => {
    const posIndex = mockPositions.findIndex(pos => pos.id === p.id);
    if (posIndex !== -1) mockPositions.splice(posIndex, 1);
  });
  return { success: true };
};

export const isMockAuthenticated = () => currentUser !== null;
export const getMockCurrentUser = () => currentUser;