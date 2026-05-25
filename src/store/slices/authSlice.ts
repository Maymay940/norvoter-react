// store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Расширенный тип пользователя
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

// Асинхронные thunk'и
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }) => {
    const response = await axios.post('/api/users/login/', { username, password });
    return response.data.data;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: any) => {
    const response = await axios.post('/api/users/register/', userData);
    return response.data.data;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await axios.post('/api/users/logout/');
  return null;
});

export const checkSession = createAsyncThunk('auth/checkSession', async () => {
  const response = await axios.get('/api/meters/');
  return response.data.data;
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: { first_name: string; last_name: string; phone: string; email: string }) => {
    const response = await axios.put('/api/users/profile/', profileData);
    return response.data.data;
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ old_password, new_password }: { old_password: string; new_password: string }) => {
    const response = await axios.post('/api/users/change-password/', { old_password, new_password });
    return response.data.data;
  }
);

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
        state.isAuthenticated = true;
        state.user = JSON.parse(savedUser);
        console.log('Session restored:', state.user);
      }
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    setAuthData: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      if (action.payload.user) {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Логин
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          id: action.payload.user_id,
          username: action.payload.username,
          is_admin: action.payload.is_admin,
          first_name: action.payload.first_name,
          last_name: action.payload.last_name,
          phone: action.payload.phone,
          email: action.payload.email,
        };;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка входа';
      })
      // Регистрация
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      // Логаут
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('user');
      })
      // Проверка сессии
      .addCase(checkSession.fulfilled, (state) => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          state.isAuthenticated = true;
          state.user = JSON.parse(savedUser);
        }
      })
      .addCase(checkSession.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('user');
      })
      // Обновление профиля
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка обновления профиля';
      })
      // Смена пароля
      .addCase(changePassword.fulfilled, () => {
        // Пароль изменён, можно добавить уведомление
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка смены пароля';
      });
  },
});

export const { clearError, restoreSession, updateUser, setAuthData } = authSlice.actions;
export default authSlice.reducer;