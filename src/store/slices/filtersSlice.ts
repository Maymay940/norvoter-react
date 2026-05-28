import { createSlice } from '@reduxjs/toolkit';
import type 
{ PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  address: string;
  meterType: 'all' | 'HOT' | 'COLD';
  sortBy: 'address' | 'last_reading';
}

const initialState: FiltersState = {
  address: '',
  meterType: 'all',
  sortBy: 'address',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    setMeterType: (state, action: PayloadAction<'all' | 'HOT' | 'COLD'>) => {
      state.meterType = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'address' | 'last_reading'>) => {
      state.sortBy = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const { setAddress, setMeterType, setSortBy, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;