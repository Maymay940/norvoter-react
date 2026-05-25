import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
  loading: false,
  error: null,
};

// Получить текущий черновик (корзину)
export const fetchCart = createAsyncThunk('request/fetchCart', async () => {
  const response = await axios.get('/api/cart/');
  return response.data.data;
});

// Получить заявку по ID
export const fetchRequestById = createAsyncThunk(
  'request/fetchById',
  async (id: number) => {
    const response = await axios.get(`/api/requests/${id}/`);
    return response.data.data;
  }
);

// Добавить услугу в заявку (создать черновик)
export const addToRequest = createAsyncThunk(
  'request/addPosition',
  async ({ meter_id, current_reading }: { meter_id: number; current_reading: number }) => {
    const response = await axios.post('/api/positions/add/', { meter_id, current_reading });
    return response.data.data;
  }
);

// Удалить позицию из заявки
export const deletePosition = createAsyncThunk(
  'request/deletePosition',
  async (position_id: number) => {
    await axios.delete(`/api/positions/${position_id}/delete/`);
    return position_id;
  }
);

// Обновить показания в позиции
export const updatePosition = createAsyncThunk(
  'request/updatePosition',
  async ({ position_id, current_reading }: { position_id: number; current_reading: number }) => {
    await axios.put(`/api/positions/${position_id}/update/`, { current_reading });
    return { position_id, current_reading };
  }
);

// Сформировать заявку (отправить)
export const submitRequest = createAsyncThunk(
  'request/submit',
  async (request_id: number) => {
    await axios.put(`/api/requests/${request_id}/submit-request/`);
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
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.draft.id = action.payload.request_id;
      })
      // fetchRequestById
      .addCase(fetchRequestById.fulfilled, (state, action) => {
        state.currentRequest = action.payload;
      })
      // addToRequest
      .addCase(addToRequest.fulfilled, (state, action) => {
        state.draft.id = action.payload.request_id;
      })
      // deletePosition
      .addCase(deletePosition.fulfilled, (state, action) => {
        if (state.draft.positions) {
          state.draft.positions = state.draft.positions.filter(p => p.id !== action.payload);
        }
      });
  },
});

export const { clearDraft } = requestSlice.actions;
export default requestSlice.reducer;