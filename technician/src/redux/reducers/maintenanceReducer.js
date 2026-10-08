import { createSlice } from "@reduxjs/toolkit";
import {
  getTechnicianAssignedTasks,
  getTechnicianMaintenanceDetail,
  getTechnicianPartsList,
  updateTechnicianMaintenanceTimer,
} from "../actions/maintenanceAction";

const initialState = {
  tasksList: [],
  tasksSummary: {
    total_assigned: 0,
    total_completed: 0,
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
  name: "technicianMaintenance",
  initialState,
  reducers: {
    clearMaintenanceDetails: (state) => {
      state.taskDetails = null;
      state.detailsError = null;
    },
    resetMaintenanceState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // getTechnicianAssignedTasks
      .addCase(getTechnicianAssignedTasks.pending, (state) => {
        state.isTasksLoading = true;
        state.tasksError = null;
      })
      .addCase(getTechnicianAssignedTasks.fulfilled, (state, action) => {
        state.isTasksLoading = false;
        const payloadData = action.payload?.data;
        if (payloadData && typeof payloadData === "object") {
          state.tasksList = Array.isArray(payloadData.tasks)
            ? payloadData.tasks
            : Array.isArray(payloadData)
            ? payloadData
            : [];
          state.tasksSummary = payloadData.summary || {
            total_assigned: 0,
            total_completed: 0,
            total_pending: 0,
          };
        } else if (Array.isArray(action.payload)) {
          state.tasksList = action.payload;
        } else {
          state.tasksList = [];
        }
      })
      .addCase(getTechnicianAssignedTasks.rejected, (state, action) => {
        state.isTasksLoading = false;
        state.tasksError = action.payload?.message || action.payload || "Failed to fetch assigned tasks";
      })

      // getTechnicianMaintenanceDetail
      .addCase(getTechnicianMaintenanceDetail.pending, (state) => {
        state.isDetailsLoading = true;
        state.detailsError = null;
      })
      .addCase(getTechnicianMaintenanceDetail.fulfilled, (state, action) => {
        state.isDetailsLoading = false;
        state.taskDetails = action.payload?.data || action.payload || null;
      })
      .addCase(getTechnicianMaintenanceDetail.rejected, (state, action) => {
        state.isDetailsLoading = false;
        state.detailsError = action.payload?.message || action.payload || "Failed to fetch maintenance details";
      })

      // updateTechnicianMaintenanceTimer
      .addCase(updateTechnicianMaintenanceTimer.fulfilled, (state, action) => {
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

      // getTechnicianPartsList
      .addCase(getTechnicianPartsList.pending, (state) => {
        state.isPartsLoading = true;
      })
      .addCase(getTechnicianPartsList.fulfilled, (state, action) => {
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
      .addCase(getTechnicianPartsList.rejected, (state) => {
        state.isPartsLoading = false;
      });
  },
});

export const { clearMaintenanceDetails, resetMaintenanceState } =
  maintenanceSlice.actions;

export default maintenanceSlice.reducer;
