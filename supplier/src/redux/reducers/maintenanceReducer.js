import { createSlice } from "@reduxjs/toolkit";
import {
  getSupplierAssignedTasks,
  getSupplierMaintenanceDetail,
} from "../actions/maintenanceAction";

const initialState = {
  tasksList: [],
  tasksSummary: {
    total_assigned: 0,
    total_accepted: 0,
    total_rejected: 0,
    total_pending: 0,
  },
  isTasksLoading: false,
  tasksError: null,

  taskDetails: null,
  isDetailsLoading: false,
  detailsError: null,
};

const maintenanceSlice = createSlice({
  name: "supplierMaintenance",
  initialState,
  reducers: {
    clearMaintenanceDetails: (state) => {
      state.taskDetails = null;
      state.detailsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Supplier Assigned Tasks
      .addCase(getSupplierAssignedTasks.pending, (state) => {
        state.isTasksLoading = true;
        state.tasksError = null;
      })
      .addCase(getSupplierAssignedTasks.fulfilled, (state, action) => {
        state.isTasksLoading = false;
        const resData = action.payload?.data;
        if (resData) {
          if (Array.isArray(resData.tasks)) {
            state.tasksList = resData.tasks;
          } else if (Array.isArray(resData)) {
            state.tasksList = resData;
          } else {
            state.tasksList = [];
          }

          if (resData.summary) {
            state.tasksSummary = resData.summary;
          }
        } else {
          state.tasksList = [];
        }
      })
      .addCase(getSupplierAssignedTasks.rejected, (state, action) => {
        state.isTasksLoading = false;
        state.tasksError = action.payload?.message || "Failed to fetch assigned tasks";
      })

      // Get Supplier Maintenance Detail By ID
      .addCase(getSupplierMaintenanceDetail.pending, (state) => {
        state.isDetailsLoading = true;
        state.detailsError = null;
      })
      .addCase(getSupplierMaintenanceDetail.fulfilled, (state, action) => {
        state.isDetailsLoading = false;
        state.taskDetails = action.payload?.data || null;
      })
      .addCase(getSupplierMaintenanceDetail.rejected, (state, action) => {
        state.isDetailsLoading = false;
        state.detailsError = action.payload?.message || "Failed to fetch task details";
      });
  },
});

export const { clearMaintenanceDetails } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
