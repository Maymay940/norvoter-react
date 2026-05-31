import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import * as mockApi from '../../services/mockApi';  
import { USE_MOCK } from '../../config/env'; 

export interface Meter {
  id: number;
  address: string;
  serial_number: string;
  meter_type: 'HOT' | 'COLD';
  meter_model: string;
  installation_date: string;
  last_verified_reading: number;
  photo_url: string | null;
  setup_video_url: string | null;
}

interface MetersState {
  items: Meter[];
  filteredItems: Meter[];
  loading: boolean;
  error: string | null;
  searchAddress: string;
}

const initialState: MetersState = {
  items: [],
  filteredItems: [],
  loading: false,
  error: null,
  searchAddress: '',
};

// асинхронный thunk для получения списка счётчиков
export const fetchMeters = createAsyncThunk(
  'meters/fetchMeters',
  async (address?: string) => {
    if (USE_MOCK) {
      const response = await mockApi.mockGetMeters();
      return response.data as Meter[];
    }
    const params = address ? { address } : {};
    const response = await axios.get('/api/meters/', { params });
    return response.data.data;
  }
);

const metersSlice = createSlice({
  name: 'meters',
  initialState,
  reducers: {
    setSearchAddress: (state, action: PayloadAction<string>) => {
      state.searchAddress = action.payload;
      if (action.payload) {
        state.filteredItems = state.items.filter(meter =>
          meter.address.toLowerCase().includes(action.payload.toLowerCase())
        );
      } else {
        state.filteredItems = state.items;
      }
    },
    clearFilters: (state) => {
      state.searchAddress = '';
      state.filteredItems = state.items;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeters.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        if (state.searchAddress) {
          state.filteredItems = state.items.filter((meter: Meter) =>
            meter.address.toLowerCase().includes(state.searchAddress.toLowerCase())
          );
        } else {
          state.filteredItems = action.payload;
        }
      })
      .addCase(fetchMeters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки счётчиков';
      });
  },
});

export const { setSearchAddress, clearFilters } = metersSlice.actions;
export default metersSlice.reducer;