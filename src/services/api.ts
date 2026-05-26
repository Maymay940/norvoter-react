// services/api.ts
import axios from 'axios';
import * as mockApi from './mockApi';
import type { Meter } from '../types/meter';

// Переключение режимов
const USE_MOCK = true;  // ← true для GitHub Pages, false для локальной разработки

export const login = async (username: string, password: string) => {
  if (USE_MOCK) return mockApi.mockLogin(username, password);
  const response = await axios.post('/api/users/login/', { username, password });
  return response;
};

export const logout = async () => {
  if (USE_MOCK) return mockApi.mockLogout();
  const response = await axios.post('/api/users/logout/');
  return response;
};

// ВАЖНО: Исправленная функция getMeters
export const getMeters = async (address?: string): Promise<Meter[]> => {
  if (USE_MOCK) {
    const response = await mockApi.mockGetMeters();
    // response = { success: true, data: mockMeters }
    // Извлекаем data, так как mockApi возвращает объект с полем data
    return response.data as Meter[];
  }
  
  const params = address ? { address } : {};
  const response = await axios.get('/api/meters/', { params });
  // Предполагаем, что реальный API возвращает данные в response.data
  return response.data as Meter[];
};

export const getMeterById = async (id: number) => {
  if (USE_MOCK) return mockApi.mockGetMeterById(id);
  const response = await axios.get(`/api/meters/${id}/`);
  return response;
};

export const getCart = async () => {
  if (USE_MOCK) return mockApi.mockGetCart();
  const response = await axios.get('/api/cart/');
  return response;
};

export const getRequests = async (status?: string, dateFrom?: string, dateTo?: string) => {
  if (USE_MOCK) return mockApi.mockGetRequests(status);
  const params: any = {};
  if (status) params.status = status;
  if (dateFrom) params.date_from = dateFrom;
  if (dateTo) params.date_to = dateTo;
  const response = await axios.get('/api/requests/', { params });
  return response;
};

export const getRequestById = async (id: number) => {
  if (USE_MOCK) return mockApi.mockGetRequestById(id);
  const response = await axios.get(`/api/requests/${id}/`);
  return response;
};

export const addPosition = async (meterId: number, currentReading: number, requestId?: number) => {
  if (USE_MOCK) return mockApi.mockAddPosition(meterId, currentReading, requestId);
  const response = await axios.post('/api/positions/add/', { meter_id: meterId, current_reading: currentReading, request_id: requestId });
  return response;
};

export const deletePosition = async (positionId: number) => {
  if (USE_MOCK) return mockApi.mockDeletePosition(positionId);
  const response = await axios.delete(`/api/positions/${positionId}/delete/`);
  return response;
};

export const submitRequest = async (requestId: number) => {
  if (USE_MOCK) return mockApi.mockSubmitRequest(requestId);
  const response = await axios.put(`/api/requests/${requestId}/submit-request/`);
  return response;
};

export const completeRequest = async (requestId: number) => {
  if (USE_MOCK) return mockApi.mockCompleteRequest(requestId);
  const response = await axios.put(`/api/requests/${requestId}/complete/`);
  return response;
};

export const rejectRequest = async (requestId: number) => {
  if (USE_MOCK) return mockApi.mockRejectRequest(requestId);
  const response = await axios.put(`/api/requests/${requestId}/reject/`);
  return response;
};

export const deleteRequest = async (requestId: number) => {
  if (USE_MOCK) return mockApi.mockDeleteRequest(requestId);
  const response = await axios.delete(`/api/requests/${requestId}/delete/`);
  return response;
};

export const isAuthenticated = () => {
  if (USE_MOCK) return mockApi.isMockAuthenticated();
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const getCurrentUser = () => {
  if (USE_MOCK) return mockApi.getMockCurrentUser();
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};