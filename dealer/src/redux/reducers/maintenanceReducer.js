import { createSlice } from "@reduxjs/toolkit";
import {
  getMaintenanceList,
  getMaintenanceById,
  createMaintenance,
} from "../actions/maintenanceAction";

const initialState = {
  maintenanceList: [],
  maintenanceMeta: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isMaintenanceLoading: false,
  maintenanceError: null,

  maintenanceDetails: null,
  isDetailsLoading: false,
  detailsError: null,

  isActionLoading: false,
};

const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState,
  reducers: {
    clearMaintenanceDetails: (state) => {
      state.maintenanceDetails = null;
      state.detailsError = null;
    },
    setMaintenanceList: (state, action) => {
      state.maintenanceList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Maintenance List
      .addCase(getMaintenanceList.pending, (state) => {
        state.isMaintenanceLoading = true;
        state.maintenanceError = null;
      })
      .addCase(getMaintenanceList.fulfilled, (state, action) => {
        state.isMaintenanceLoading = false;
        const payloadData = action.payload?.data;

        if (Array.isArray(payloadData)) {
          state.maintenanceList = payloadData;
          state.maintenanceMeta = {
            totalItems: action.payload?.meta?.totalItems || payloadData.length,
            totalPages: action.payload?.meta?.totalPages || 1,
            currentPage: action.payload?.meta?.currentPage || 1,
            limit: action.payload?.meta?.limit || payloadData.length || 10,
            hasNextPage: action.payload?.meta?.hasNextPage || false,
            hasPrevPage: action.payload?.meta?.hasPrevPage || false,
          };
        } else if (payloadData && Array.isArray(payloadData.data)) {
          state.maintenanceList = payloadData.data;
          const pagination = payloadData.pagination || payloadData.meta || action.payload?.pagination || action.payload?.meta;
          if (pagination) {
            state.maintenanceMeta = {
              totalItems: pagination.totalItems ?? payloadData.data.length,
              totalPages: pagination.totalPages ?? 1,
              currentPage: pagination.currentPage ?? 1,
              limit: pagination.limit ?? payloadData.data.length ?? 10,
              hasNextPage: pagination.hasNextPage ?? false,
              hasPrevPage: pagination.hasPrevPage ?? false,
            };
          }
        } else {
          state.maintenanceList = [];
        }
      })
      .addCase(getMaintenanceList.rejected, (state, action) => {
        state.isMaintenanceLoading = false;
        state.maintenanceError =
          action.payload?.message || "Failed to fetch maintenance tasks";
      })

      // Get Maintenance Details By ID
      .addCase(getMaintenanceById.pending, (state) => {
        state.isDetailsLoading = true;
        state.detailsError = null;
      })
      .addCase(getMaintenanceById.fulfilled, (state, action) => {
        state.isDetailsLoading = false;
        state.maintenanceDetails = action.payload?.data || null;
      })
      .addCase(getMaintenanceById.rejected, (state, action) => {
        state.isDetailsLoading = false;
        state.detailsError =
          action.payload?.message || "Failed to fetch maintenance task details";
      })

      // Create Maintenance Task
      .addCase(createMaintenance.pending, (state) => {
        state.isActionLoading = true;
      })
      .addCase(createMaintenance.fulfilled, (state) => {
        state.isActionLoading = false;
      })
      .addCase(createMaintenance.rejected, (state) => {
        state.isActionLoading = false;
      });
  },
});

export const { clearMaintenanceDetails, setMaintenanceList } =
  maintenanceSlice.actions;
export default maintenanceSlice.reducer;
