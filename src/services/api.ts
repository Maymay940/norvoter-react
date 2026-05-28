import axios from 'axios';
import * as mockApi from './mockApi';
import type { Meter } from '../types/meter';

// Явное определение GitHub Pages
const hostname = window.location.hostname;
const isGitHubPages = hostname === 'maymay940.github.io' || hostname.includes('github.io');
const USE_MOCK = isGitHubPages;

console.log('=== API НАСТРОЙКИ ===');
console.log('Hostname:', hostname);
console.log('isGitHubPages:', isGitHubPages);
console.log('USE_MOCK:', USE_MOCK);


const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const login = async (username: string, password: string) => {
  if (USE_MOCK) return mockApi.mockLogin(username, password);
  const response = await api.post('/users/login/', { username, password });
  return response;
};

export const logout = async () => {
  if (USE_MOCK) return mockApi.mockLogout();
  const response = await api.post('/users/logout/');
  return response;
};

export const getMeters = async (address?: string): Promise<Meter[]> => {
  if (USE_MOCK) {
    const response = await mockApi.mockGetMeters();
    return response.data as Meter[];
  }
  
  const params = address ? { address } : {};
  const response = await api.get('/meters/', { params });
  if (response.data?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return [];
};

export const getMeterById = async (id: number) => {
  if (USE_MOCK) return mockApi.mockGetMeterById(id);
  const response = await api.get(`/meters/${id}/`);
  return response;
};

export const getCart = async () => {
  if (USE_MOCK) return mockApi.mockGetCart();
  const response = await api.get('/cart/');
  return response;
};

export const getRequests = async (status?: string, dateFrom?: string, dateTo?: string) => {
  if (USE_MOCK) return mockApi.mockGetRequests(status);
  const params: any = {};
  if (status) params.status = status;
  if (dateFrom) params.date_from = dateFrom;
  if (dateTo) params.date_to = dateTo;
  const response = await api.get('/requests/', { params });
  return response;
};

export const getRequestById = async (id: number) => {
  if (USE_MOCK) return mockApi.mockGetRequestById(id);
  const response = await api.get(`/requests/${id}/`);
  return response;
};

export const addPosition = async (meterId: number, currentReading: number, requestId?: number) => {
  if (USE_MOCK) return mockApi.mockAddPosition(meterId, currentReading, requestId);
  const response = await api.post('/positions/add/', { 
    meter_id: meterId, 
    current_reading: currentReading, 
    request_id: requestId 
  });
  return response;
};

export const deletePosition = async (positionId: number) => {
  if (USE_MOCK) return mockApi.mockDeletePosition(positionId);
  const response = await api.delete(`/positions/${positionId}/delete/`);
  return response;
};

export const submitRequest = async (requestId: number) => {
  if (USE_MOCK) return mockApi.mockSubmitRequest(requestId);
  const response = await api.put(`/requests/${requestId}/submit-request/`);
  return response;
};

export const completeRequest = async (requestId: number) => {
  if (USE_MOCK) return mockApi.mockCompleteRequest(requestId);
  const response = await api.put(`/requests/${requestId}/complete/`);
  return response;
};

export const rejectRequest = async (requestId: number) => {
  if (USE_MOCK) return mockApi.mockRejectRequest(requestId);
  const response = await api.put(`/requests/${requestId}/reject/`);
  return response;
};

export const deleteRequest = async (requestId: number) => {
  if (USE_MOCK) return mockApi.mockDeleteRequest(requestId);
  const response = await api.delete(`/requests/${requestId}/delete/`);
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

export const register = async (userData: {
  username: string;
  email: string;
  password: string;
  account_number: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}) => {
  if (USE_MOCK) {
    const response = await mockApi.mockRegister(userData);
    return response;
  }
  const response = await api.post('/users/register/', userData);
  return response.data;
};