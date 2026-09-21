import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vanReducer from './slices/vanSlice';
import technicianReducer from './slices/technicianSlice';
import supplierReducer from './slices/supplierSlice';

export const store = configureStore({
  reducer: {
    authReducer,
    vanReducer,
    technicianReducer,
    supplierReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
