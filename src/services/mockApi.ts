import { 
  mockUsers, 
  mockMeters, 
  mockRequests,
  mockPositions,
  setMockCurrentUser,
  getMockCurrentUser,
  getNextRequestId,
  getNextPositionId,
  type User,
  type Request,
  type Position
} from './mockData';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Логин
export const mockLogin = async (username: string, password: string) => {
  await delay();
  const user = mockUsers.find(u => u.username === username && u.password === password);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    setMockCurrentUser(userWithoutPassword as User);
    return { success: true, data: userWithoutPassword };
  }
  return { success: false, error: 'Неверный логин или пароль' };
};

export const mockLogout = async () => {
  await delay();
  setMockCurrentUser(null);
  return { success: true };
};

export const isMockAuthenticated = () => getMockCurrentUser() !== null;

// НЕ переопределяем getMockCurrentUser, а используем импортированный
// export const getMockCurrentUser = () => getMockCurrentUser(); ← УДАЛИТЬ ЭТУ СТРОКУ!

// Получение счетчиков
export const mockGetMeters = async () => {
  await delay();
  const currentUser = getMockCurrentUser();
  console.log('currentUser:', currentUser);
  
  if (!currentUser) return { success: true, data: [] };
  
  if (currentUser.is_admin) {
    return { success: true, data: mockMeters };
  }

  const userMeters = mockMeters.filter(meter => meter.user_id === currentUser.id);
  console.log(`Пользователь ${currentUser.username} видит ${userMeters.length} счетчиков`);
  return { success: true, data: userMeters };
};

export const mockGetMeterById = async (id: number) => {
  await delay();
  const meter = mockMeters.find(m => m.id === id);
  return { success: true, data: meter };
};

// Корзина
export const mockGetCart = async () => {
  await delay();
  const currentUser = getMockCurrentUser();
  if (!currentUser) return { success: true, data: { request_id: null, items_count: 0 } };
  
  const draft = mockRequests.find(r => r.user_id === currentUser.id && r.status === 'draft');
  if (draft) {
    const items = mockPositions.filter(p => p.request_id === draft.id);
    return { success: true, data: { request_id: draft.id, items_count: items.length } };
  }
  return { success: true, data: { request_id: null, items_count: 0 } };
};

// Заявки
export const mockGetRequests = async (status?: string) => {
  await delay();
  const currentUser = getMockCurrentUser();
  console.log('mockGetRequests - currentUser:', currentUser);
  
  if (!currentUser) return { success: true, data: { requests: [] } };
  
  let requests = [];
  
  if (currentUser.is_admin) {
    console.log('Админ - показываем все заявки');
    requests = [...mockRequests]; // Все заявки
  } else {
    console.log(`Пользователь ${currentUser.username} - показываем его заявки`);
    requests = mockRequests.filter(r => r.user_id === currentUser.id);
  }
  
  if (status && status !== 'all') {
    requests = requests.filter(r => r.status === status);
  }
  
  const result = requests.map(r => ({
    ...r,
    positions_count: mockPositions.filter(p => p.request_id === r.id).length,
  }));
  
  console.log(`Найдено ${result.length} заявок:`, result);
  return { success: true, data: { requests: result } };
};

export const mockGetRequestById = async (id: number) => {
  await delay();
  const currentUser = getMockCurrentUser();
  const request = mockRequests.find(r => r.id === id);
  if (!request) return { success: false, error: 'Заявка не найдена' };
  
  if (!currentUser?.is_admin && request.user_id !== currentUser?.id) {
    return { success: false, error: 'Нет доступа' };
  }
  
  const positions = mockPositions.filter(p => p.request_id === id);
  return { success: true, data: { ...request, positions } };
};

// Добавление позиции
export const mockAddPosition = async (meterId: number, currentReading: number, _requestId?: number) => {
  await delay();
  const currentUser = getMockCurrentUser();
  if (!currentUser) return { success: false, error: 'Пользователь не авторизован' };
  
  const meter = mockMeters.find(m => m.id === meterId);
  if (!meter) return { success: false, error: 'Счётчик не найден' };
  
  let draft = mockRequests.find(r => r.user_id === currentUser.id && r.status === 'draft');
  
  if (!draft) {
    const newDraft: Request = {
      id: getNextRequestId(),
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
  const newPosition: Position = {
    id: getNextPositionId(),
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

// Удаление позиции
export const mockDeletePosition = async (positionId: number) => {
  await delay();
  const index = mockPositions.findIndex(p => p.id === positionId);
  if (index !== -1) mockPositions.splice(index, 1);
  return { success: true };
};

// Отправка заявки
export const mockSubmitRequest = async (requestId: number) => {
  await delay();
  const request = mockRequests.find(r => r.id === requestId);
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

// Завершение заявки (для админа)
export const mockCompleteRequest = async (requestId: number) => {
  await delay();
  const currentUser = getMockCurrentUser();
  if (!currentUser?.is_admin) return { success: false, error: 'Только для администратора' };
  
  const request = mockRequests.find(r => r.id === requestId);
  if (request && request.status === 'submitted') {
    request.status = 'completed';
    request.completed_at = new Date().toISOString();
  }
  return { success: true };
};

// Отклонение заявки (для админа)
export const mockRejectRequest = async (requestId: number) => {
  await delay();
  const currentUser = getMockCurrentUser();
  if (!currentUser?.is_admin) return { success: false, error: 'Только для администратора' };
  
  const request = mockRequests.find(r => r.id === requestId);
  if (request && request.status === 'submitted') {
    request.status = 'rejected';
    request.completed_at = new Date().toISOString();
  }
  return { success: true };
};

// Удаление заявки
export const mockDeleteRequest = async (requestId: number) => {
  await delay();
  const requestIndex = mockRequests.findIndex(r => r.id === requestId);
  if (requestIndex !== -1) mockRequests.splice(requestIndex, 1);
  
  const positionsToDelete = mockPositions.filter(p => p.request_id === requestId);
  positionsToDelete.forEach(p => {
    const posIndex = mockPositions.findIndex(pos => pos.id === p.id);
    if (posIndex !== -1) mockPositions.splice(posIndex, 1);
  });
  return { success: true };
};

// Для админки - все пользователи
export const mockGetAllUsers = async () => {
  await delay();
  const currentUser = getMockCurrentUser();
  if (!currentUser?.is_admin) return { success: false, error: 'Доступ только для администратора' };
  
  const usersWithoutPassword = mockUsers.map(({ password, ...user }) => user);
  return { success: true, data: usersWithoutPassword };
};

export const mockGetAllRequests = async () => {
  await delay();
  const currentUser = getMockCurrentUser();
  console.log('mockGetAllRequests - currentUser:', currentUser);
  
  if (!currentUser?.is_admin) {
    return { success: false, error: 'Доступ только для администратора' };
  }
  
  const allRequests = mockRequests.map(r => ({
    ...r,
    positions_count: mockPositions.filter(p => p.request_id === r.id).length,
  }));
  
  console.log(`Админ - всего заявок: ${allRequests.length}`);
  return { success: true, data: { requests: allRequests } };
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
  
  const { password: _, ...userWithoutPassword } = newUser;
  return { success: true, data: userWithoutPassword };
};

// Обновление позиции
export const mockUpdatePosition = async (positionId: number, currentReading: number) => {
  await delay();
  const position = mockPositions.find(p => p.id === positionId);
  if (position) {
    position.current_reading = currentReading;
    position.consumption = currentReading - position.water_meter__last_verified_reading;
    
    const request = mockRequests.find(r => r.id === position.request_id);
    if (request && request.status === 'draft') {
      const positions = mockPositions.filter(p => p.request_id === request.id);
      const total_consumption = positions.reduce((sum, p) => sum + p.consumption, 0);
      request.total_consumption = total_consumption;
      request.amount_to_pay = total_consumption * 50;
    }
  }
  return { success: true };
};

export { getMockCurrentUser } from './mockData';