import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Определяем режим GitHub Pages
const isGitHubPages = import.meta.env.VITE_IS_GITHUB_PAGES === true;

// Мок-пользователи для GitHub Pages
const mockUsers = [
  { 
    id: 1, 
    username: 'testuser', 
    password: '123456',
    is_admin: false,
    first_name: 'Тест',
    last_name: 'Пользователь',
    phone: '+7 (999) 123-45-67',
    email: 'test@example.com'
  },
  {
    id: 2,
    username: 'admin',
    password: 'admin123',
    is_admin: true,
    first_name: 'Админ',
    last_name: 'Системы',
    phone: '+7 (888) 123-45-67',
    email: 'admin@example.com'
  }
];

// Тип для ответа логина/регистрации
interface AuthResponse {
  user_id: number;
  username: string;
  is_admin: boolean;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
}

// Тип для данных регистрации
interface RegisterData {
  username: string;
  email: string;
  password: string;
  account_number: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

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

// Асинхронные thunk'и с поддержкой мок-режима
export const login = createAsyncThunk<
  AuthResponse,  // Тип возвращаемого значения при успехе
  { username: string; password: string }  // Тип аргумента
>(
  'auth/login',
  async ({ username, password }) => {
    if (isGitHubPages) {
      // Мок-логин для GitHub Pages
      await new Promise(resolve => setTimeout(resolve, 500)); // Имитация задержки
      
      const user = mockUsers.find(u => u.username === username && u.password === password);
      if (!user) {
        throw new Error('Неверное имя пользователя или пароль');
      }
      
      // Убираем пароль из объекта
      const { password: _p, ...userWithoutPassword } = user;
      
      return {
        user_id: userWithoutPassword.id,
        username: userWithoutPassword.username,
        is_admin: userWithoutPassword.is_admin,
        first_name: userWithoutPassword.first_name,
        last_name: userWithoutPassword.last_name,
        phone: userWithoutPassword.phone,
        email: userWithoutPassword.email
      };
    }
    // Реальный API для локальной разработки
    const response = await axios.post<{ data: AuthResponse }>('/api/users/login/', { username, password });
    return response.data.data;
  }
);

export const register = createAsyncThunk<
  AuthResponse,  // Тип возвращаемого значения при успехе
  RegisterData    // Тип аргумента
>(
  'auth/register',
  async (userData) => {
    if (isGitHubPages) {
      // Мок-регистрация для GitHub Pages
      await new Promise(resolve => setTimeout(resolve, 500)); // Имитация задержки
      
      const existingUser = mockUsers.find(u => u.username === userData.username);
      if (existingUser) {
        throw new Error('Пользователь уже существует');
      }
      
      const newUser = {
        id: mockUsers.length + 1,
        username: userData.username,
        password: userData.password,
        is_admin: false,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone: userData.phone || '',
        email: userData.email || ''
      };
      
      mockUsers.push(newUser);
      
      return {
        user_id: newUser.id,
        username: newUser.username,
        is_admin: newUser.is_admin,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        phone: newUser.phone,
        email: newUser.email
      };
    }
    const response = await axios.post<{ data: AuthResponse }>('/api/users/register/', userData);
    return response.data.data;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  if (!isGitHubPages) {
    await axios.post('/api/users/logout/');
  }
  return null;
});

export const checkSession = createAsyncThunk('auth/checkSession', async () => {
  if (isGitHubPages) {
    // Для GitHub Pages просто проверяем localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    throw new Error('No session');
  }
  const response = await axios.get('/api/meters/');
  return response.data.data;
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: { first_name: string; last_name: string; phone: string; email: string }) => {
    if (isGitHubPages) {
      // Мок-обновление профиля
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        const updatedUser = { ...user, ...profileData };
        return updatedUser;
      }
      throw new Error('User not found');
    }
    const response = await axios.put('/api/users/profile/', profileData);
    return response.data.data;
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ old_password, new_password }: { old_password: string; new_password: string }) => {
    if (isGitHubPages) {
      // Мок-смена пароля
      console.log('Password changed (mock):', { old_password, new_password });
      return { success: true };
    }
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
        const userData = action.payload;
        state.user = {
          id: userData.user_id,
          username: userData.username,
          is_admin: userData.is_admin,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          phone: userData.phone || '',
          email: userData.email || '',
        };
        localStorage.setItem('user', JSON.stringify(state.user));
        console.log('Login successful, user saved:', state.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка входа';
        console.error('Login failed:', action.error);
      })
      // Регистрация
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Registration successful:', action.payload);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка регистрации';
        console.error('Registration failed:', action.error);
      })
      // Логаут
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('user');
        console.log('Logout successful');
      })
      // Проверка сессии
      .addCase(checkSession.fulfilled, (state, action) => {
        const savedUser = action.payload;
        if (savedUser) {
          state.isAuthenticated = true;
          state.user = savedUser;
          console.log('Session check successful:', savedUser);
        }
      })
      .addCase(checkSession.rejected, (state) => {
        if (!isGitHubPages) {
          state.isAuthenticated = false;
          state.user = null;
          localStorage.removeItem('user');
        }
        console.log('Session check failed');
      })
      // Обновление профиля
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
          localStorage.setItem('user', JSON.stringify(state.user));
          console.log('Profile updated:', state.user);
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка обновления профиля';
        console.error('Profile update failed:', action.error);
      })
      // Смена пароля
      .addCase(changePassword.fulfilled, () => {
        console.log('Password changed successfully');
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка смены пароля';
        console.error('Password change failed:', action.error);
      });
  },
});

export const { clearError, restoreSession, updateUser, setAuthData } = authSlice.actions;
export default authSlice.reducer;