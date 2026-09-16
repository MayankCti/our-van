import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dealerReducer from "./slices/dealerSlice";
import ownerReducer from "./slices/ownerSlice";
import vanReducer from "./slices/vanSlice";

export const store = configureStore({
  reducer: {
    authReducer,
    dealerReducer,
    ownerReducer,
    vanReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


export default store;
