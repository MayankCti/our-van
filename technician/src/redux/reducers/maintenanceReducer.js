import { createSlice } from "@reduxjs/toolkit";
import {
  getTechnicianAssignedTasks,
  getTechnicianMaintenanceDetail,
} from "../actions/maintenanceAction";

const initialState = {
  tasksList: [],
  tasksSummary: {
    total_assigned: 0,
    total_completed: 0,
    total_pending: 0,
  },
  taskDetails: null,
  isTasksLoading: false,
  isDetailsLoading: false,
  tasksError: null,
  detailsError: null,
};

const maintenanceSlice = createSlice({
  name: "maintenance",
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
        state.tasksError = action.payload || "Failed to fetch assigned tasks";
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
        state.detailsError = action.payload || "Failed to fetch maintenance details";
      });
  },
});

export const { clearMaintenanceDetails, resetMaintenanceState } =
  maintenanceSlice.actions;

export default maintenanceSlice.reducer;
