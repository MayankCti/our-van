import { createSlice } from "@reduxjs/toolkit";
import { getVansList, getVanDetails } from "../actions/vanAction";

const initialState = {
  // Vans List
  vansList: [],
  vansMeta: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isVansLoading: false,
  vansError: null,

  // Van Details
  vanDetails: null,
  isVanDetailsLoading: false,
  vanDetailsError: null,
};

const vanSlice = createSlice({
  name: "van",
  initialState,
  reducers: {
    setVansList: (state, action) => {
      state.vansList = action.payload;
    },
    setVanDetails: (state, action) => {
      state.vanDetails = action.payload;
    },
    resetVanDetails: (state) => {
      state.vanDetails = null;
      state.isVanDetailsLoading = false;
      state.vanDetailsError = null;
    },
    resetVanState: () => initialState,
  },
  extraReducers: (builder) => {
    // getVansList
    builder.addCase(getVansList.pending, (state) => {
      state.isVansLoading = true;
      state.vansError = null;
    });
    builder.addCase(getVansList.fulfilled, (state, action) => {
      state.isVansLoading = false;
      const rawData = action?.payload?.data || action?.payload?.vans || action?.payload;
      state.vansList = Array.isArray(rawData) ? rawData : [];
      state.vansMeta = action?.payload?.meta || action?.payload?.pagination || {
        totalItems: Array.isArray(rawData) ? rawData.length : 0,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false,
      };
      state.vansError = null;
    });
    builder.addCase(getVansList.rejected, (state, action) => {
      state.isVansLoading = false;
      state.vansError = action.payload || action.error?.message;
    });

    // getVanDetails
    builder.addCase(getVanDetails.pending, (state) => {
      state.isVanDetailsLoading = true;
      state.vanDetailsError = null;
    });
    builder.addCase(getVanDetails.fulfilled, (state, action) => {
      state.isVanDetailsLoading = false;
      state.vanDetails = action?.payload?.data || action?.payload || null;
      state.vanDetailsError = null;
    });
    builder.addCase(getVanDetails.rejected, (state, action) => {
      state.isVanDetailsLoading = false;
      state.vanDetailsError = action.payload || action.error?.message;
    });
  },
});

export const { setVansList, setVanDetails, resetVanDetails, resetVanState } = vanSlice.actions;
export default vanSlice.reducer;

