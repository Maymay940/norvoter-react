import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  modalOpen: boolean;
  modalType: 'login' | 'register' | null;
}

const initialState: UiState = {
  isLoading: false,
  error: null,
  successMessage: null,
  modalOpen: false,
  modalType: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccessMessage: (state, action: PayloadAction<string | null>) => {
      state.successMessage = action.payload;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    openModal: (state, action: PayloadAction<'login' | 'register'>) => {
      state.modalOpen = true;
      state.modalType = action.payload;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.modalType = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setSuccessMessage,
  clearMessages,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;