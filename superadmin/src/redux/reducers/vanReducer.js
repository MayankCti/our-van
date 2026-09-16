import { createSlice } from "@reduxjs/toolkit";
import { getVansList } from "../actions/vanAction";

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
};

const vanSlice = createSlice({
  name: "van",
  initialState,
  reducers: {
    setVansList: (state, action) => {
      state.vansList = action.payload;
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
  },
});

export const { setVansList, resetVanState } = vanSlice.actions;
export default vanSlice.reducer;
