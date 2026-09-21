import { createSlice } from "@reduxjs/toolkit";
import {
  getSuppliersByDealer,
  getSupplierById,
  toggleBlockSupplier,
  deleteSupplier,
} from "../actions/supplierAction";

const initialState = {
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

  supplierDetails: null,
  isDetailsLoading: false,
  detailsError: null,

  isActionLoading: false,
};

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    clearSupplierDetails: (state) => {
      state.supplierDetails = null;
      state.detailsError = null;
    },
    setSuppliersList: (state, action) => {
      state.suppliersList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Suppliers List
      .addCase(getSuppliersByDealer.pending, (state) => {
        state.isSuppliersLoading = true;
        state.suppliersError = null;
      })
      .addCase(getSuppliersByDealer.fulfilled, (state, action) => {
        state.isSuppliersLoading = false;
        const payloadData = action.payload?.data;
        if (Array.isArray(payloadData)) {
          state.suppliersList = payloadData;
          state.suppliersMeta = {
            totalItems: action.payload?.meta?.totalItems || payloadData.length,
            totalPages: action.payload?.meta?.totalPages || 1,
            currentPage: action.payload?.meta?.currentPage || 1,
            limit: action.payload?.meta?.limit || payloadData.length || 10,
            hasNextPage: action.payload?.meta?.hasNextPage || false,
            hasPrevPage: action.payload?.meta?.hasPrevPage || false,
          };
        } else if (payloadData && Array.isArray(payloadData.suppliers)) {
          state.suppliersList = payloadData.suppliers;
          state.suppliersMeta = payloadData.meta || state.suppliersMeta;
        } else {
          state.suppliersList = [];
        }
      })
      .addCase(getSuppliersByDealer.rejected, (state, action) => {
        state.isSuppliersLoading = false;
        state.suppliersError = action.payload?.message || "Failed to fetch suppliers";
      })

      // Get Supplier Details By ID
      .addCase(getSupplierById.pending, (state) => {
        state.isDetailsLoading = true;
        state.detailsError = null;
      })
      .addCase(getSupplierById.fulfilled, (state, action) => {
        state.isDetailsLoading = false;
        state.supplierDetails = action.payload?.data || null;
      })
      .addCase(getSupplierById.rejected, (state, action) => {
        state.isDetailsLoading = false;
        state.detailsError = action.payload?.message || "Failed to fetch supplier details";
      })

      // Toggle Block / Unblock Supplier
      .addCase(toggleBlockSupplier.pending, (state) => {
        state.isActionLoading = true;
      })
      .addCase(toggleBlockSupplier.fulfilled, (state, action) => {
        state.isActionLoading = false;
        const updatedData = action.payload?.data;
        const suppId = updatedData?.id || action.meta?.arg?.id;
        const newIsBlock = updatedData?.is_block !== undefined ? updatedData.is_block : null;

        if (suppId) {
          state.suppliersList = state.suppliersList.map((sup) => {
            if (sup.id === suppId) {
              const currentBlock = sup.is_block !== undefined ? sup.is_block : (sup.status === 0 ? 1 : 0);
              const toggledBlock = newIsBlock !== null ? newIsBlock : (currentBlock === 1 ? 0 : 1);
              return {
                ...sup,
                is_block: toggledBlock,
                status: toggledBlock === 1 ? 0 : 1,
              };
            }
            return sup;
          });

          if (state.supplierDetails && state.supplierDetails.id === suppId) {
            const currentBlock = state.supplierDetails.is_block !== undefined ? state.supplierDetails.is_block : (state.supplierDetails.status === 0 ? 1 : 0);
            const toggledBlock = newIsBlock !== null ? newIsBlock : (currentBlock === 1 ? 0 : 1);
            state.supplierDetails = {
              ...state.supplierDetails,
              is_block: toggledBlock,
              status: toggledBlock === 1 ? 0 : 1,
            };
          }
        }
      })
      .addCase(toggleBlockSupplier.rejected, (state) => {
        state.isActionLoading = false;
      })

      // Delete Supplier
      .addCase(deleteSupplier.pending, (state) => {
        state.isActionLoading = true;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.isActionLoading = false;
        const deletedId = action.meta?.arg?.id;
        if (deletedId) {
          state.suppliersList = state.suppliersList.filter(
            (sup) => sup.id !== deletedId
          );
          state.suppliersMeta = {
            ...state.suppliersMeta,
            totalItems: Math.max(0, (state.suppliersMeta.totalItems || 1) - 1),
          };
          if (state.supplierDetails && state.supplierDetails.id === deletedId) {
            state.supplierDetails = null;
          }
        }
      })
      .addCase(deleteSupplier.rejected, (state) => {
        state.isActionLoading = false;
      });
  },
});

export const { clearSupplierDetails, setSuppliersList } = supplierSlice.actions;
export default supplierSlice.reducer;
