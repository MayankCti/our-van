import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dealerReducer from "./slices/dealerSlice";
import ownerReducer from "./slices/ownerSlice";
import vanReducer from "./slices/vanSlice";
import componentReducer from "./slices/componentSlice";
import dashboardReducer from "./slices/dashboardSlice";
import technicianReducer from "./slices/technicianSlice";
import supplierReducer from "./slices/supplierSlice";

export const store = configureStore({
  reducer: {
    authReducer,
    dealerReducer,
    ownerReducer,
    vanReducer,
    componentReducer,
    dashboardReducer,
    technicianReducer,
    supplierReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


export default store;
