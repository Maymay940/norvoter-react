// src/services/api.ts
import axios from 'axios';
import type { Meter } from '../types/meter';
import type { Request } from '../types/request';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});


const USE_MOCK = false; 

const mockMeters: Meter[] = [
  { id: 1, address: 'ул. Пушкина, д. 10, кв. 5', serial_number: '30069237', meter_type: 'HOT', meter_model: 'СГВ-15', installation_date: '2023-01-15', last_verified_reading: 1250, photo_url: null, setup_video_url: null },
  { id: 2, address: 'ул. Пушкина, д. 10, кв. 5', serial_number: '0014443', meter_type: 'COLD', meter_model: 'СХВ-13', installation_date: '2023-01-15', last_verified_reading: 2030, photo_url: null, setup_video_url: null },
  { id: 3, address: 'ул. Победы, д. 22, кв. 7', serial_number: '5258402', meter_type: 'COLD', meter_model: 'ДУ-32', installation_date: '2022-05-20', last_verified_reading: 3456, photo_url: null, setup_video_url: null },
];

export const getMeters = async (address?: string): Promise<Meter[]> => {
  if (USE_MOCK) {
    let data = mockMeters;
    if (address) {
      data = data.filter(m => m.address.toLowerCase().includes(address.toLowerCase()));
    }
    return data;
  }
  const response = await api.get('/meters/', {
    params: address ? { address } : {},
  });
  return response.data.data;
};

export const getMeterById = async (id: number): Promise<Meter | null> => {
  const meters = await getMeters();
  return meters.find(m => m.id === id) || null;
};

export const getRequests = async (status?: string): Promise<Request[]> => {
  const response = await api.get('/requests/', {
    params: status ? { status } : {},
  });
  return response.data.data?.requests || [];
};

export const getRequestById = async (id: number): Promise<Request> => {
  const response = await api.get(`/requests/${id}/`);
  return response.data.data;
};

export const createRequest = async (meterId: number, reading: number) => {
  const response = await api.post('/positions/add/', {
    meter_id: meterId,
    current_reading: reading,
  });
  return response.data.data;
};

export const submitRequest = async (requestId: number) => {
  await api.put(`/requests/${requestId}/submit-request/`);
};

export const deleteRequest = async (requestId: number) => {
  await api.delete(`/requests/${requestId}/delete/`);
};

// НОВЫЕ МЕТОДЫ ДЛЯ АУТЕНТИФИКАЦИИ
export const login = async (username: string, password: string) => {
  const response = await api.post('/users/login/', { username, password });
  return response.data;
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
  const response = await api.post('/users/register/', userData);
  return response.data;
};

export const logout = async () => {
  await api.post('/users/logout/');
};
