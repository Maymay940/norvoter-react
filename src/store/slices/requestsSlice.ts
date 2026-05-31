import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import * as mockApi from '../../services/mockApi';
import { USE_MOCK } from '../../config/env';

export interface RequestItem {
  id: number;
  status: string;
  created_at: string;
  submitted_at: string | null;
  completed_at: string | null;
  positions_count: number;
  total_consumption: number | null;
  amount_to_pay: number | null;
  comment: string;
}

interface Filters {
  status: string;
  date_from: string;
  date_to: string;
}

interface RequestsState {
  items: RequestItem[];
  loading: boolean;
  error: string | null;
  filters: Filters;
}

const initialState: RequestsState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    status: '',
    date_from: '',
    date_to: '',
  },
};

// для получения списка заявок
export const fetchRequests = createAsyncThunk(
  'requests/fetchRequests',
  async (filters?: Partial<Filters>) => {
    console.log('fetchRequests - USE_MOCK =', USE_MOCK);
    
    if (USE_MOCK) {
      console.log('Используем мок-заявки');
      const response = await mockApi.mockGetRequests(filters?.status);
      return response.data.requests || [];
    }
    
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);
    
    const response = await axios.get('/api/requests/', { params });
    return response.data.data.requests;
  }
);

// для завершения заявки 
export const completeRequest = createAsyncThunk(
  'requests/completeRequest',
  async (requestId: number) => {
    console.log('completeRequest - USE_MOCK =', USE_MOCK);
    
    if (USE_MOCK) {
      await mockApi.mockCompleteRequest(requestId);
      return requestId;
    }
    
    await axios.put(`/api/requests/${requestId}/complete/`);
    return requestId;
  }
);

// для отклонения заявки 
export const rejectRequest = createAsyncThunk(
  'requests/rejectRequest',
  async (requestId: number) => {
    console.log('rejectRequest - USE_MOCK =', USE_MOCK);
    
    if (USE_MOCK) {
      await mockApi.mockRejectRequest(requestId);
      return requestId;
    }
    
    await axios.put(`/api/requests/${requestId}/reject/`);
    return requestId;
  }
);

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { status: '', date_from: '', date_to: '' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        console.log('Заявки загружены:', state.items.length);
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заявок';
        console.error('Ошибка загрузки заявок:', action.error);
      })
      .addCase(completeRequest.fulfilled, (state, action) => {
        const request = state.items.find(r => r.id === action.payload);
        if (request) request.status = 'completed';
        console.log('Заявка завершена:', action.payload);
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        const request = state.items.find(r => r.id === action.payload);
        if (request) request.status = 'rejected';
        console.log('Заявка отклонена:', action.payload);
      });
  },
});

export const { setFilters, clearFilters } = requestsSlice.actions;
export default requestsSlice.reducer;