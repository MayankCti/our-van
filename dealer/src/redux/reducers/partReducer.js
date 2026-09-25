import { createSlice } from "@reduxjs/toolkit";
import {
  getParts,
  getPartById,
  createPart,
  updatePart,
  deletePart,
} from "../actions/partAction";

const initialState = {
  partsList: [],
  partsMeta: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isPartsLoading: false,
  partsError: null,

  partDetails: null,
  isDetailsLoading: false,
  detailsError: null,

  isActionLoading: false,
};

const partSlice = createSlice({
  name: "part",
  initialState,
  reducers: {
    clearPartDetails: (state) => {
      state.partDetails = null;
      state.detailsError = null;
    },
    setPartsList: (state, action) => {
      state.partsList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Parts List
      .addCase(getParts.pending, (state) => {
        state.isPartsLoading = true;
        state.partsError = null;
      })
      .addCase(getParts.fulfilled, (state, action) => {
        state.isPartsLoading = false;
        const payloadData = action.payload?.data;
        if (Array.isArray(payloadData)) {
          state.partsList = payloadData;
          state.partsMeta = {
            totalItems: action.payload?.meta?.totalItems || payloadData.length,
            totalPages: action.payload?.meta?.totalPages || 1,
            currentPage: action.payload?.meta?.currentPage || 1,
            limit: action.payload?.meta?.limit || payloadData.length || 10,
            hasNextPage: action.payload?.meta?.hasNextPage || false,
            hasPrevPage: action.payload?.meta?.hasPrevPage || false,
          };
        } else if (payloadData && Array.isArray(payloadData.data)) {
          state.partsList = payloadData.data;
          state.partsMeta = payloadData.meta || action.payload?.meta || state.partsMeta;
        } else if (payloadData && Array.isArray(payloadData.parts)) {
          state.partsList = payloadData.parts;
          state.partsMeta = payloadData.meta || action.payload?.meta || state.partsMeta;
        } else {
          state.partsList = [];
        }
      })
      .addCase(getParts.rejected, (state, action) => {
        state.isPartsLoading = false;
        state.partsError = action.payload?.message || "Failed to fetch parts";
      })

      // Get Part Details By ID
      .addCase(getPartById.pending, (state) => {
        state.isDetailsLoading = true;
        state.detailsError = null;
      })
      .addCase(getPartById.fulfilled, (state, action) => {
        state.isDetailsLoading = false;
        state.partDetails = action.payload?.data || null;
      })
      .addCase(getPartById.rejected, (state, action) => {
        state.isDetailsLoading = false;
        state.detailsError = action.payload?.message || "Failed to fetch part details";
      })

      // Create Part
      .addCase(createPart.pending, (state) => {
        state.isActionLoading = true;
      })
      .addCase(createPart.fulfilled, (state, action) => {
        state.isActionLoading = false;
        const newPart = action.payload?.data;
        if (newPart && Array.isArray(state.partsList)) {
          state.partsList = [newPart, ...state.partsList];
          state.partsMeta = {
            ...state.partsMeta,
            totalItems: (state.partsMeta.totalItems || 0) + 1,
          };
        }
      })
      .addCase(createPart.rejected, (state) => {
        state.isActionLoading = false;
      })

      // Update Part
      .addCase(updatePart.pending, (state) => {
        state.isActionLoading = true;
      })
      .addCase(updatePart.fulfilled, (state, action) => {
        state.isActionLoading = false;
        const updatedPart = action.payload?.data;
        const targetId = updatedPart?.id || action.meta?.arg?.id;

        if (targetId && Array.isArray(state.partsList)) {
          state.partsList = state.partsList.map((part) => {
            if (String(part.id) === String(targetId)) {
              return { ...part, ...updatedPart };
            }
            return part;
          });
        }

        if (state.partDetails && String(state.partDetails?.id) === String(targetId)) {
          state.partDetails = {
            ...state.partDetails,
            ...(updatedPart || {}),
          };
        }
      })
      .addCase(updatePart.rejected, (state) => {
        state.isActionLoading = false;
      })

      // Delete Part
      .addCase(deletePart.pending, (state) => {
        state.isActionLoading = true;
      })
      .addCase(deletePart.fulfilled, (state, action) => {
        state.isActionLoading = false;
        const deletedId = action.meta?.arg?.id;
        if (deletedId) {
          state.partsList = state.partsList.filter(
            (part) => String(part.id) !== String(deletedId)
          );
          state.partsMeta = {
            ...state.partsMeta,
            totalItems: Math.max(0, (state.partsMeta.totalItems || 1) - 1),
          };
          if (state.partDetails && String(state.partDetails.id) === String(deletedId)) {
            state.partDetails = null;
          }
        }
      })
      .addCase(deletePart.rejected, (state) => {
        state.isActionLoading = false;
      });
  },
});

export const { clearPartDetails, setPartsList } = partSlice.actions;
export default partSlice.reducer;
