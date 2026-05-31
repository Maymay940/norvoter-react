import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import authReducer from './slices/authSlice';
import requestReducer from './slices/requestSlice';
import metersReducer from './slices/metersSlice';
import requestsReducer from './slices/requestsSlice';
import uiReducer from './slices/uiSlice';
import filtersReducer from './slices/filtersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, // управление пользователем (логин, регистрация, сессия)
    request: requestReducer, // работа с одной заявкой (черновик, детали)
    meters: metersReducer, // список счетчиков и фильтрация
    requests: requestsReducer, // список заявок пользователя и админа
    ui: uiReducer, // глобальное UI состояние (лоадер, модалки, ошибки)
    filters: filtersReducer, // фильтры для счетчиков (адрес, тип, сортировка)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { axios }, // дополнительный аргумент в thunk
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
