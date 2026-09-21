import { createSlice } from "@reduxjs/toolkit";
import {
  getDealersList,
  getDealerDetails,
  toggleBlockDealer,
  createDealer,
} from "../actions/dealerAction";

const initialState = {
  // Dealers List
  dealersList: [],
  dealersMeta: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isDealersLoading: false,
  dealersError: null,

  // Create Dealer
  isCreateDealerLoading: false,
  createDealerError: null,

  // Dealer Details
  dealerDetails: null,
  assignedVans: [],
  assignedVansMeta: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isDealerDetailsLoading: false,
  dealerDetailsError: null,

  // Toggle Block / Unblock Dealer
  isToggleBlockLoading: false,
  toggleBlockError: null,
};

const dealerSlice = createSlice({
  name: "dealer",
  initialState,
  reducers: {
    setDealersList: (state, action) => {
      state.dealersList = action.payload;
    },
    setDealerDetails: (state, action) => {
      state.dealerDetails = action.payload;
    },
    resetDealerDetails: (state) => {
      state.dealerDetails = null;
      state.assignedVans = [];
      state.assignedVansMeta = initialState.assignedVansMeta;
      state.isDealerDetailsLoading = false;
      state.dealerDetailsError = null;
    },
    resetDealerState: () => initialState,
  },
  extraReducers: (builder) => {
    // getDealersList
    builder.addCase(getDealersList.pending, (state) => {
      state.isDealersLoading = true;
      state.dealersError = null;
    });
    builder.addCase(getDealersList.fulfilled, (state, action) => {
      state.isDealersLoading = false;
      const rawData =
        action?.payload?.data?.dealers ||
        action?.payload?.dealers ||
        action?.payload?.data ||
        action?.payload;
      state.dealersList = Array.isArray(rawData) ? rawData : [];
      state.dealersMeta =
        action?.payload?.data?.meta ||
        action?.payload?.meta ||
        action?.payload?.pagination || {
          totalItems: Array.isArray(rawData) ? rawData.length : 0,
          totalPages: 1,
          currentPage: 1,
          limit: 10,
          hasNextPage: false,
          hasPrevPage: false,
        };
      state.dealersError = null;
    });
    builder.addCase(getDealersList.rejected, (state, action) => {
      state.isDealersLoading = false;
      state.dealersError = action.payload || action.error?.message;
    });

    // getDealerDetails
    builder.addCase(getDealerDetails.pending, (state) => {
      state.isDealerDetailsLoading = true;
      state.dealerDetailsError = null;
    });
    builder.addCase(getDealerDetails.fulfilled, (state, action) => {
      state.isDealerDetailsLoading = false;
      const data = action?.payload?.data || {};
      state.dealerDetails = data?.dealer || null;
      state.assignedVans = Array.isArray(data?.assignedVans) ? data.assignedVans : [];
      state.assignedVansMeta = data?.meta || action?.payload?.meta || {
        totalItems: Array.isArray(data?.assignedVans) ? data.assignedVans.length : 0,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false,
      };
      state.dealerDetailsError = null;
    });
    builder.addCase(getDealerDetails.rejected, (state, action) => {
      state.isDealerDetailsLoading = false;
      state.dealerDetailsError = action.payload || action.error?.message;
    });

    // toggleBlockDealer
    builder.addCase(toggleBlockDealer.pending, (state) => {
      state.isToggleBlockLoading = true;
      state.toggleBlockError = null;
    });
    builder.addCase(toggleBlockDealer.fulfilled, (state, action) => {
      state.isToggleBlockLoading = false;
      const dealerId = action.meta?.arg?.dealerId;
      const newStatus = action?.payload?.status || action?.payload?.data?.status;

      // Update directly in dealersList
      if (dealerId && Array.isArray(state.dealersList)) {
        state.dealersList = state.dealersList.map((d) => {
          const currentId = d?.dealerId || d?.id || d?.dealer_id;
          if (String(currentId) === String(dealerId)) {
            const currentIsActive =
              d.status === "ACTIVE" ||
              d.status === 1 ||
              d.is_active === 1 ||
              d.is_active === true ||
              d.is_blocked === 0 ||
              d.is_blocked === false;
            const updatedStatus = newStatus || (currentIsActive ? "BLOCKED" : "ACTIVE");
            const updatedBlock = updatedStatus === "BLOCKED" ? 1 : 0;
            return {
              ...d,
              status: updatedStatus,
              is_blocked: updatedBlock,
              is_active: updatedBlock === 0 ? 1 : 0,
            };
          }
          return d;
        });
      }

      // Update directly in dealerDetails
      if (state.dealerDetails) {
        const currentIsActive =
          state.dealerDetails.status === "ACTIVE" ||
          state.dealerDetails.status === 1 ||
          state.dealerDetails.is_active === 1 ||
          state.dealerDetails.is_active === true ||
          state.dealerDetails.is_blocked === 0 ||
          state.dealerDetails.is_blocked === false;
        const updatedStatus = newStatus || (currentIsActive ? "BLOCKED" : "ACTIVE");
        const updatedBlock = updatedStatus === "BLOCKED" ? 1 : 0;
        state.dealerDetails = {
          ...state.dealerDetails,
          status: updatedStatus,
          is_blocked: updatedBlock,
          is_active: updatedBlock === 0 ? 1 : 0,
        };
        if (state.dealerDetails.data) {
          state.dealerDetails.data = {
            ...state.dealerDetails.data,
            status: updatedStatus,
            is_block: updatedBlock,
            is_blocked: updatedBlock,
            is_active: updatedBlock === 0 ? 1 : 0,
          };
        }
      }
      state.toggleBlockError = null;
    });
    builder.addCase(toggleBlockDealer.rejected, (state, action) => {
      state.isToggleBlockLoading = false;
      state.toggleBlockError = action.payload || action.error?.message;
    });

    // createDealer
    builder.addCase(createDealer.pending, (state) => {
      state.isCreateDealerLoading = true;
      state.createDealerError = null;
    });
    builder.addCase(createDealer.fulfilled, (state, action) => {
      state.isCreateDealerLoading = false;
      const createdDealer =
        action.payload?.data?.dealer ||
        action.payload?.dealer ||
        action.payload?.data;
      if (
        createdDealer &&
        typeof createdDealer === "object" &&
        (createdDealer.dealer_name || createdDealer.dealerName || createdDealer.email)
      ) {
        const normalized = {
          dealerId: createdDealer.dealerId || createdDealer.id || createdDealer.dealer_id || Date.now(),
          dealerName: createdDealer.dealerName || createdDealer.dealer_name || createdDealer.name || "",
          email: createdDealer.email || "",
          ownersCount: createdDealer.ownersCount || createdDealer.owners_count || 0,
          dateRegistered:
            createdDealer.dateRegistered ||
            createdDealer.date_registered ||
            createdDealer.createdAt ||
            createdDealer.created_at ||
            new Date().toISOString(),
          status: createdDealer.status || "ACTIVE",
          is_active: 1,
          is_blocked: 0,
          ...createdDealer,
        };
        const exists = state.dealersList.some(
          (d) => String(d.dealerId || d.id || d.dealer_id) === String(normalized.dealerId)
        );
        if (!exists) {
          state.dealersList = [normalized, ...state.dealersList];
          state.dealersMeta = {
            ...state.dealersMeta,
            totalItems: (state.dealersMeta.totalItems || 0) + 1,
          };
        }
      }
      state.createDealerError = null;
    });
    builder.addCase(createDealer.rejected, (state, action) => {
      state.isCreateDealerLoading = false;
      state.createDealerError = action.payload || action.error?.message;
    });
  },
});

export const { setDealersList, setDealerDetails, resetDealerDetails, resetDealerState } =
  dealerSlice.actions;
export default dealerSlice.reducer;


