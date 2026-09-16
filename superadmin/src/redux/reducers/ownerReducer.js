import { createSlice } from "@reduxjs/toolkit";
import {
  getOwnersList,
  getOwnerDetails,
  toggleBlockOwner,
} from "../actions/ownerAction";

const initialState = {
  // Owners List
  ownersList: [],
  ownersMeta: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isOwnersLoading: false,
  ownersError: null,

  // Owner Details
  ownerDetails: null,
  assignedVans: [],
  assignedVansMeta: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 5,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isOwnerDetailsLoading: false,
  ownerDetailsError: null,

  // Toggle Block / Unblock Owner
  isToggleBlockOwnerLoading: false,
  toggleBlockOwnerError: null,
};

const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    setOwnersList: (state, action) => {
      state.ownersList = action.payload;
    },
    setOwnerDetails: (state, action) => {
      state.ownerDetails = action.payload;
    },
    resetOwnerDetails: (state) => {
      state.ownerDetails = null;
      state.assignedVans = [];
      state.assignedVansMeta = initialState.assignedVansMeta;
      state.isOwnerDetailsLoading = false;
      state.ownerDetailsError = null;
    },
    resetOwnerState: () => initialState,
  },
  extraReducers: (builder) => {
    // getOwnersList
    builder.addCase(getOwnersList.pending, (state) => {
      state.isOwnersLoading = true;
      state.ownersError = null;
    });
    builder.addCase(getOwnersList.fulfilled, (state, action) => {
      state.isOwnersLoading = false;
      const rawData = action?.payload?.data || action?.payload?.owners || action?.payload;
      state.ownersList = Array.isArray(rawData) ? rawData : [];
      state.ownersMeta = action?.payload?.meta || action?.payload?.pagination || {
        totalItems: Array.isArray(rawData) ? rawData.length : 0,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false,
      };
      state.ownersError = null;
    });
    builder.addCase(getOwnersList.rejected, (state, action) => {
      state.isOwnersLoading = false;
      state.ownersError = action.payload || action.error?.message;
    });

    // getOwnerDetails
    builder.addCase(getOwnerDetails.pending, (state) => {
      state.isOwnerDetailsLoading = true;
      state.ownerDetailsError = null;
    });
    builder.addCase(getOwnerDetails.fulfilled, (state, action) => {
      state.isOwnerDetailsLoading = false;
      const data = action?.payload?.data || {};
      state.ownerDetails = data?.owner || null;
      state.assignedVans = Array.isArray(data?.assignedVans) ? data.assignedVans : [];
      state.assignedVansMeta = data?.meta || action?.payload?.meta || {
        totalItems: Array.isArray(data?.assignedVans) ? data.assignedVans.length : 0,
        totalPages: 1,
        currentPage: 1,
        limit: 5,
        hasNextPage: false,
        hasPrevPage: false,
      };
      state.ownerDetailsError = null;
    });
    builder.addCase(getOwnerDetails.rejected, (state, action) => {
      state.isOwnerDetailsLoading = false;
      state.ownerDetailsError = action.payload || action.error?.message;
    });

    // toggleBlockOwner
    builder.addCase(toggleBlockOwner.pending, (state) => {
      state.isToggleBlockOwnerLoading = true;
      state.toggleBlockOwnerError = null;
    });
    builder.addCase(toggleBlockOwner.fulfilled, (state, action) => {
      state.isToggleBlockOwnerLoading = false;
      const newStatus = action?.payload?.status || action?.payload?.data?.status;
      if (newStatus && state.ownerDetails) {
        state.ownerDetails.status = newStatus;
      }
      state.toggleBlockOwnerError = null;
    });
    builder.addCase(toggleBlockOwner.rejected, (state, action) => {
      state.isToggleBlockOwnerLoading = false;
      state.toggleBlockOwnerError = action.payload || action.error?.message;
    });
  },
});

export const {
  setOwnersList,
  setOwnerDetails,
  resetOwnerDetails,
  resetOwnerState,
} = ownerSlice.actions;
export default ownerSlice.reducer;


