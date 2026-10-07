import { createSlice } from "@reduxjs/toolkit";
import {
  getSupplierAssignedTasks,
  getSupplierMaintenanceDetail,
  getSupplierPartsList,
  updateSupplierMaintenanceTimer,
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

  partsCatalog: [],
  isPartsLoading: false,
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
      })

      // Update Supplier Maintenance Timer
      .addCase(updateSupplierMaintenanceTimer.fulfilled, (state, action) => {
        const timerData =
          action.payload?.data?.timer ||
          action.payload?.data ||
          action.payload?.timer;
        if (state.taskDetails && timerData) {
          state.taskDetails = {
            ...state.taskDetails,
            timer: {
              ...(state.taskDetails.timer || {}),
              ...(typeof timerData === 'object' ? timerData : {}),
            },
            timer_status:
              timerData.timer_status ||
              (state.taskDetails.timer
                ? state.taskDetails.timer.timer_status
                : undefined),
          };
        }
      })

      // Get Parts List for selection
      .addCase(getSupplierPartsList.pending, (state) => {
        state.isPartsLoading = true;
      })
      .addCase(getSupplierPartsList.fulfilled, (state, action) => {
        state.isPartsLoading = false;
        const resData = action.payload?.data || action.payload;
        if (Array.isArray(resData)) {
          state.partsCatalog = resData;
        } else if (resData && Array.isArray(resData.parts)) {
          state.partsCatalog = resData.parts;
        } else {
          state.partsCatalog = [];
        }
      })
      .addCase(getSupplierPartsList.rejected, (state) => {
        state.isPartsLoading = false;
      });
  },
});

export const { clearMaintenanceDetails } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;

