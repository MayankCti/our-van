import { createSlice } from "@reduxjs/toolkit";
import { getDashboardData } from "../actions/dashboardAction";

const initialState = {
  dashboardData: null,
  isDashboardLoading: false,
  dashboardError: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },
    resetDashboardState: () => initialState,
  },
  extraReducers: (builder) => {
    // getDashboardData
    builder.addCase(getDashboardData.pending, (state) => {
      state.isDashboardLoading = true;
      state.dashboardError = null;
    });
    builder.addCase(getDashboardData.fulfilled, (state, action) => {
      state.isDashboardLoading = false;
      state.dashboardData = action?.payload?.data || action?.payload || null;
      state.dashboardError = null;
    });
    builder.addCase(getDashboardData.rejected, (state, action) => {
      state.isDashboardLoading = false;
      state.dashboardError = action.payload || action.error?.message;
    });
  },
});

export const { setDashboardData, resetDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
