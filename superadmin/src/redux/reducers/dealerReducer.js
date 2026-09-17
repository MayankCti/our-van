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
      const rawData = action?.payload?.data || action?.payload?.dealers || action?.payload;
      state.dealersList = Array.isArray(rawData) ? rawData : [];
      state.dealersMeta = action?.payload?.meta || action?.payload?.pagination || {
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
      const newStatus = action?.payload?.status || action?.payload?.data?.status;
      if (newStatus && state.dealerDetails) {
        state.dealerDetails.status = newStatus;
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
    builder.addCase(createDealer.fulfilled, (state) => {
      state.isCreateDealerLoading = false;
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


