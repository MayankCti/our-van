import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vanReducer from './slices/vanSlice';

export const store = configureStore({
  reducer: {
    authReducer,
    vanReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
