import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as mockApi from '../../services/mockApi'; 
import { USE_MOCK } from '../../config/env'; 

interface User {
  id: number;
  username: string;
  is_admin: boolean;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// логин
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }) => {
    if (USE_MOCK) {
      const response = await mockApi.mockLogin(username, password);
      if (!response.success) {
        throw new Error(response.error || 'Ошибка входа');
      }
      return response.data;
    }
    const response = await axios.post('/api/users/login/', { username, password });
    return response.data.data;
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ old_password, new_password }: { old_password: string; new_password: string }) => {
    if (USE_MOCK) {
      console.log('Password changed (mock):', { old_password, new_password }); // мок смена пароля
      return { success: true };
    }
    const response = await axios.post('/api/users/change-password/', { old_password, new_password });
    return response.data.data;
  }
);

// регистрация
export const register = createAsyncThunk(
  'auth/register',
  async (userData: {
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
      if (!response.success) {
        throw new Error(response.error || 'Ошибка регистрации');
      }
      return response.data;
    }
    const response = await axios.post('/api/users/register/', userData);
    return response.data.data;
  }
);

// выход
export const logout = createAsyncThunk('auth/logout', async () => {
  if (!USE_MOCK) {
    await axios.post('/api/users/logout/');
  }
  return null;
});

// получить всех пользователей для админа
export const fetchAllUsers = createAsyncThunk('auth/fetchAllUsers', async () => {
  if (USE_MOCK) {
    const response = await mockApi.mockGetAllUsers();
    return response.data;
  }
  const response = await axios.get('/api/admin/users/');
  return response.data.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    restoreSession: (state) => {
      const savedUser = localStorage.getItem('user');
      console.log('restoreSession called, savedUser:', savedUser);
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          state.isAuthenticated = true;
          state.user = parsed;
          console.log('Session restored:', state.user);
        } catch (e) {
          console.error('Failed to parse saved user:', e);
        }
      }
    },
    logoutLocal: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isAdmin');
    },
  },
  extraReducers: (builder) => {
    builder
      // логин
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
        localStorage.setItem('isAuthenticated', 'true');
        if (action.payload.is_admin) {
          localStorage.setItem('isAdmin', 'true');
        }
        console.log('Login successful, user saved:', state.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка входа';
        console.error('Login failed:', action.error);
      })
      // регистрация
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        console.log('Registration successful');
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка регистрации';
        console.error('Registration failed:', action.error);
      })
      // выход
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('isAdmin');
        console.log('Logout successful');
      });
  },
});

export const { clearError, restoreSession, logoutLocal } = authSlice.actions;
export default authSlice.reducer;