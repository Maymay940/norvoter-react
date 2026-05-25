// store/index.ts
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
    auth: authReducer,
    request: requestReducer,
    meters: metersReducer,
    requests: requestsReducer,
    ui: uiReducer,
    filters: filtersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { axios },
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
