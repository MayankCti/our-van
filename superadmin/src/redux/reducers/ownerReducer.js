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
      const ownerId = action.meta?.arg?.ownerId;
      const newStatus = action?.payload?.status || action?.payload?.data?.status;

      // Update directly in ownersList
      if (ownerId && Array.isArray(state.ownersList)) {
        state.ownersList = state.ownersList.map((o) => {
          const currentId = o?.ownerId || o?.id || o?.owner_id;
          if (String(currentId) === String(ownerId)) {
            const currentIsActive =
              o.status === "ACTIVE" ||
              o.status === 1 ||
              o.is_active === 1 ||
              o.is_active === true ||
              o.is_blocked === 0 ||
              o.is_blocked === false;
            const updatedStatus = newStatus || (currentIsActive ? "BLOCKED" : "ACTIVE");
            const updatedBlock = updatedStatus === "BLOCKED" ? 1 : 0;
            return {
              ...o,
              status: updatedStatus,
              is_blocked: updatedBlock,
              is_active: updatedBlock === 0 ? 1 : 0,
            };
          }
          return o;
        });
      }

      // Update directly in ownerDetails
      if (state.ownerDetails) {
        const currentIsActive =
          state.ownerDetails.status === "ACTIVE" ||
          state.ownerDetails.status === 1 ||
          state.ownerDetails.is_active === 1 ||
          state.ownerDetails.is_active === true ||
          state.ownerDetails.is_blocked === 0 ||
          state.ownerDetails.is_blocked === false;
        const updatedStatus = newStatus || (currentIsActive ? "BLOCKED" : "ACTIVE");
        const updatedBlock = updatedStatus === "BLOCKED" ? 1 : 0;
        state.ownerDetails = {
          ...state.ownerDetails,
          status: updatedStatus,
          is_blocked: updatedBlock,
          is_active: updatedBlock === 0 ? 1 : 0,
        };
        if (state.ownerDetails.data) {
          state.ownerDetails.data = {
            ...state.ownerDetails.data,
            status: updatedStatus,
            is_block: updatedBlock,
            is_blocked: updatedBlock,
            is_active: updatedBlock === 0 ? 1 : 0,
          };
        }
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


