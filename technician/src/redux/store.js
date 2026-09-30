import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import maintenanceReducer from './slices/maintenanceSlice';

export const store = configureStore({
  reducer: {
    authReducer,
    maintenanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
