import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vanReducer from './slices/vanSlice';
import technicianReducer from './slices/technicianSlice';
import supplierReducer from './slices/supplierSlice';
import partReducer from './slices/partSlice';
import serviceReducer from './slices/serviceSlice';
import maintenanceReducer from './slices/maintenanceSlice';

export const store = configureStore({
  reducer: {
    authReducer,
    vanReducer,
    technicianReducer,
    supplierReducer,
    partReducer,
    serviceReducer,
    maintenanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
