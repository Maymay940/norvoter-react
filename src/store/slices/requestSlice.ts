import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as mockApi from '../../services/mockApi';  
import { USE_MOCK } from '../../config/env'; 

interface Position {
  id: number;
  water_meter__address: string;
  water_meter__meter_type: string;
  water_meter__last_verified_reading: number;
  current_reading: number;
  consumption: number;
}

interface RequestState {
  draft: {
    id: number | null;
    positions: Position[];
    loading: boolean;
  };
  currentRequest: any | null;
  requests: any[];
  loading: boolean;
  error: string | null;
}

const initialState: RequestState = {
  draft: {
    id: null,
    positions: [],
    loading: false,
  },
  currentRequest: null,
  requests: [],
  loading: false,
  error: null,
};

// список заявок
export const fetchRequests = createAsyncThunk(
  'request/fetchRequests',
  async (status?: string) => {
    if (USE_MOCK) {
      const response = await mockApi.mockGetRequests(status);
      return response.data.requests || [];
    }
    const response = await axios.get('/api/requests/', { params: status ? { status } : {} });
    return response.data.data?.requests || response.data || [];
  }
);

// текущий черновик 
export const fetchCart = createAsyncThunk('request/fetchCart', async () => {
  if (USE_MOCK) {
    const response = await mockApi.mockGetCart();
    return response.data;
  }
  const response = await axios.get('/api/cart/');
  return response.data.data;
});

// получить заявку по ID
export const fetchRequestById = createAsyncThunk(
  'request/fetchById',
  async (id: number) => {
    if (USE_MOCK) {
      const response = await mockApi.mockGetRequestById(id);
      return response.data;
    }
    const response = await axios.get(`/api/requests/${id}/`);
    return response.data.data;
  }
);

// добавить услугу в заявку 
export const addToRequest = createAsyncThunk(
  'request/addPosition',
  async ({ meter_id, current_reading }: { meter_id: number; current_reading: number }) => {
    if (USE_MOCK) {
      const response = await mockApi.mockAddPosition(meter_id, current_reading);
      return response.data;
    }
    const response = await axios.post('/api/positions/add/', { meter_id, current_reading });
    return response.data.data;
  }
);

// удалить позицию из заявки
export const deletePosition = createAsyncThunk(
  'request/deletePosition',
  async (position_id: number) => {
    if (USE_MOCK) {
      await mockApi.mockDeletePosition(position_id);
      return position_id;
    }
    await axios.delete(`/api/positions/${position_id}/delete/`);
    return position_id;
  }
);

// обновить показания в позиции
export const updatePosition = createAsyncThunk(
  'request/updatePosition',
  async ({ position_id, current_reading }: { position_id: number; current_reading: number }) => {
    if (USE_MOCK) {
      await mockApi.mockUpdatePosition(position_id, current_reading);
      return { position_id, current_reading };
    }
    await axios.put(`/api/positions/${position_id}/update/`, { current_reading });
    return { position_id, current_reading };
  }
);

// сформировать заявку 
export const submitRequest = createAsyncThunk(
  'request/submit',
  async (request_id: number) => {
    if (USE_MOCK) {
      await mockApi.mockSubmitRequest(request_id);
      return request_id;
    }
    await axios.put(`/api/requests/${request_id}/submit-request/`);
    return request_id;
  }
);

// завершить заявку 
export const completeRequest = createAsyncThunk(
  'request/complete',
  async (request_id: number) => {
    if (USE_MOCK) {
      await mockApi.mockCompleteRequest(request_id);
      return request_id;
    }
    await axios.put(`/api/requests/${request_id}/complete/`);
    return request_id;
  }
);

// отклонить заявку
export const rejectRequest = createAsyncThunk(
  'request/reject',
  async (request_id: number) => {
    if (USE_MOCK) {
      await mockApi.mockRejectRequest(request_id);
      return request_id;
    }
    await axios.put(`/api/requests/${request_id}/reject/`);
    return request_id;
  }
);

const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    clearDraft: (state) => {
      state.draft = { id: null, positions: [], loading: false };
    },
    clearRequests: (state) => {
      state.requests = [];
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
        state.requests = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заявок';
        console.error('Ошибка загрузки заявок:', action.error);
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.draft.id = action.payload?.request_id || null;
      })
      .addCase(fetchRequestById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequest = action.payload;
      })
      .addCase(fetchRequestById.rejected, (state) => {
        state.loading = false;
        state.error = 'Ошибка загрузки заявки';
      })
      .addCase(addToRequest.fulfilled, (state, action) => {
        state.draft.id = action.payload?.request_id || null;
      })
      .addCase(deletePosition.fulfilled, (state, action) => {
        if (state.currentRequest?.positions) {
          state.currentRequest.positions = state.currentRequest.positions.filter(
            (p: any) => p.id !== action.payload
          );
        }
      })
      .addCase(updatePosition.fulfilled, (state, action) => {
        if (state.currentRequest?.positions) {
          const pos = state.currentRequest.positions.find(
            (p: any) => p.id === action.payload.position_id
          );
          if (pos) {
            pos.current_reading = action.payload.current_reading;
            pos.consumption = action.payload.current_reading - pos.water_meter__last_verified_reading;
          }
        }
      });
  },
});

export const { clearDraft, clearRequests } = requestSlice.actions;
export default requestSlice.reducer;