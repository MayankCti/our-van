import { createSlice } from "@reduxjs/toolkit";
import {
  getSuppliersList,
  getSupplierDetails,
} from "../actions/supplierAction";

const initialState = {
  // Suppliers List
  suppliersList: [],
  suppliersMeta: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isSuppliersLoading: false,
  suppliersError: null,

  // Supplier Details
  supplierDetails: null,
  isSupplierDetailsLoading: false,
  supplierDetailsError: null,
};

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    setSuppliersList: (state, action) => {
      state.suppliersList = action.payload;
    },
    setSupplierDetails: (state, action) => {
      state.supplierDetails = action.payload;
    },
    resetSupplierDetails: (state) => {
      state.supplierDetails = null;
      state.isSupplierDetailsLoading = false;
      state.supplierDetailsError = null;
    },
    resetSupplierState: () => initialState,
  },
  extraReducers: (builder) => {
    // getSuppliersList
    builder.addCase(getSuppliersList.pending, (state) => {
      state.isSuppliersLoading = true;
      state.suppliersError = null;
    });
    builder.addCase(getSuppliersList.fulfilled, (state, action) => {
      state.isSuppliersLoading = false;
      const rawData =
        action?.payload?.data ||
        action?.payload?.suppliers ||
        action?.payload;
      state.suppliersList = Array.isArray(rawData) ? rawData : [];

      const meta = action?.payload?.meta || action?.payload?.pagination;
      state.suppliersMeta = {
        totalItems: meta?.total ?? meta?.totalItems ?? (Array.isArray(rawData) ? rawData.length : 0),
        totalPages: meta?.totalPages ?? 1,
        currentPage: meta?.page ?? meta?.currentPage ?? 1,
        limit: meta?.limit ?? 10,
        hasNextPage: meta?.hasNextPage ?? false,
        hasPrevPage: meta?.hasPrevPage ?? false,
      };
      state.suppliersError = null;
    });
    builder.addCase(getSuppliersList.rejected, (state, action) => {
      state.isSuppliersLoading = false;
      state.suppliersError = action.payload || action.error?.message;
    });

    // getSupplierDetails
    builder.addCase(getSupplierDetails.pending, (state) => {
      state.isSupplierDetailsLoading = true;
      state.supplierDetailsError = null;
    });
    builder.addCase(getSupplierDetails.fulfilled, (state, action) => {
      state.isSupplierDetailsLoading = false;
      state.supplierDetails =
        action?.payload?.data || action?.payload || null;
      state.supplierDetailsError = null;
    });
    builder.addCase(getSupplierDetails.rejected, (state, action) => {
      state.isSupplierDetailsLoading = false;
      state.supplierDetailsError = action.payload || action.error?.message;
    });
  },
});

export const {
  setSuppliersList,
  setSupplierDetails,
  resetSupplierDetails,
  resetSupplierState,
} = supplierSlice.actions;

export default supplierSlice.reducer;
