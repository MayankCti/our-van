import { createSlice } from "@reduxjs/toolkit";
import {
  getTechniciansList,
  getTechnicianDetails,
} from "../actions/technicianAction";

const initialState = {
  // Technicians List
  techniciansList: [],
  techniciansMeta: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isTechniciansLoading: false,
  techniciansError: null,

  // Technician Details
  technicianDetails: null,
  isTechnicianDetailsLoading: false,
  technicianDetailsError: null,
};

const technicianSlice = createSlice({
  name: "technician",
  initialState,
  reducers: {
    setTechniciansList: (state, action) => {
      state.techniciansList = action.payload;
    },
    setTechnicianDetails: (state, action) => {
      state.technicianDetails = action.payload;
    },
    resetTechnicianDetails: (state) => {
      state.technicianDetails = null;
      state.isTechnicianDetailsLoading = false;
      state.technicianDetailsError = null;
    },
    resetTechnicianState: () => initialState,
  },
  extraReducers: (builder) => {
    // getTechniciansList
    builder.addCase(getTechniciansList.pending, (state) => {
      state.isTechniciansLoading = true;
      state.techniciansError = null;
    });
    builder.addCase(getTechniciansList.fulfilled, (state, action) => {
      state.isTechniciansLoading = false;
      const rawData =
        action?.payload?.data ||
        action?.payload?.technicians ||
        action?.payload;
      state.techniciansList = Array.isArray(rawData) ? rawData : [];

      const meta = action?.payload?.meta || action?.payload?.pagination;
      state.techniciansMeta = {
        totalItems: meta?.total ?? meta?.totalItems ?? (Array.isArray(rawData) ? rawData.length : 0),
        totalPages: meta?.totalPages ?? 1,
        currentPage: meta?.page ?? meta?.currentPage ?? 1,
        limit: meta?.limit ?? 10,
        hasNextPage: meta?.hasNextPage ?? false,
        hasPrevPage: meta?.hasPrevPage ?? false,
      };
      state.techniciansError = null;
    });
    builder.addCase(getTechniciansList.rejected, (state, action) => {
      state.isTechniciansLoading = false;
      state.techniciansError = action.payload || action.error?.message;
    });

    // getTechnicianDetails
    builder.addCase(getTechnicianDetails.pending, (state) => {
      state.isTechnicianDetailsLoading = true;
      state.technicianDetailsError = null;
    });
    builder.addCase(getTechnicianDetails.fulfilled, (state, action) => {
      state.isTechnicianDetailsLoading = false;
      state.technicianDetails =
        action?.payload?.data || action?.payload || null;
      state.technicianDetailsError = null;
    });
    builder.addCase(getTechnicianDetails.rejected, (state, action) => {
      state.isTechnicianDetailsLoading = false;
      state.technicianDetailsError = action.payload || action.error?.message;
    });
  },
});

export const {
  setTechniciansList,
  setTechnicianDetails,
  resetTechnicianDetails,
  resetTechnicianState,
} = technicianSlice.actions;

export default technicianSlice.reducer;
