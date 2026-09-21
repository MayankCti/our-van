import { createSlice } from "@reduxjs/toolkit";
import {
  getTechniciansByDealer,
  getTechnicianById,
  toggleBlockTechnician,
  deleteTechnician,
} from "../actions/technicianAction";

const initialState = {
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

  technicianDetails: null,
  isDetailsLoading: false,
  detailsError: null,

  isActionLoading: false,
};

const technicianSlice = createSlice({
  name: "technician",
  initialState,
  reducers: {
    clearTechnicianDetails: (state) => {
      state.technicianDetails = null;
      state.detailsError = null;
    },
    setTechniciansList: (state, action) => {
      state.techniciansList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Technicians List
      .addCase(getTechniciansByDealer.pending, (state) => {
        state.isTechniciansLoading = true;
        state.techniciansError = null;
      })
      .addCase(getTechniciansByDealer.fulfilled, (state, action) => {
        state.isTechniciansLoading = false;
        const payloadData = action.payload?.data;
        if (Array.isArray(payloadData)) {
          state.techniciansList = payloadData;
          state.techniciansMeta = {
            totalItems: action.payload?.meta?.totalItems || payloadData.length,
            totalPages: action.payload?.meta?.totalPages || 1,
            currentPage: action.payload?.meta?.currentPage || 1,
            limit: action.payload?.meta?.limit || payloadData.length || 10,
            hasNextPage: action.payload?.meta?.hasNextPage || false,
            hasPrevPage: action.payload?.meta?.hasPrevPage || false,
          };
        } else if (payloadData && Array.isArray(payloadData.technicians)) {
          state.techniciansList = payloadData.technicians;
          state.techniciansMeta = payloadData.meta || state.techniciansMeta;
        } else {
          state.techniciansList = [];
        }
      })
      .addCase(getTechniciansByDealer.rejected, (state, action) => {
        state.isTechniciansLoading = false;
        state.techniciansError = action.payload?.message || "Failed to fetch technicians";
      })

      // Get Technician Details By ID
      .addCase(getTechnicianById.pending, (state) => {
        state.isDetailsLoading = true;
        state.detailsError = null;
      })
      .addCase(getTechnicianById.fulfilled, (state, action) => {
        state.isDetailsLoading = false;
        state.technicianDetails = action.payload?.data || null;
      })
      .addCase(getTechnicianById.rejected, (state, action) => {
        state.isDetailsLoading = false;
        state.detailsError = action.payload?.message || "Failed to fetch technician details";
      })

      // Toggle Block / Unblock Technician
      .addCase(toggleBlockTechnician.pending, (state) => {
        state.isActionLoading = true;
      })
      .addCase(toggleBlockTechnician.fulfilled, (state, action) => {
        state.isActionLoading = false;
        const updatedData = action.payload?.data;
        const techId = updatedData?.id || updatedData?.technician_id || action.meta?.arg?.id;
        const newIsBlock = updatedData?.is_block !== undefined ? updatedData.is_block : null;

        if (techId && Array.isArray(state.techniciansList)) {
          state.techniciansList = state.techniciansList.map((tech) => {
            const currentId = tech.id || tech.technician_id;
            if (String(currentId) === String(techId)) {
              const currentBlock = tech.is_block !== undefined ? tech.is_block : (tech.status === 0 ? 1 : 0);
              const toggledBlock = newIsBlock !== null ? newIsBlock : (currentBlock === 1 ? 0 : 1);
              return {
                ...tech,
                is_block: toggledBlock,
                status: toggledBlock === 1 ? 0 : 1,
              };
            }
            return tech;
          });
        }

        if (state.technicianDetails && techId) {
          const detailsId =
            state.technicianDetails?.id ||
            state.technicianDetails?.technician_id ||
            state.technicianDetails?.data?.id ||
            state.technicianDetails?.data?.technician_id;
          if (String(detailsId) === String(techId)) {
            const currentBlock =
              state.technicianDetails.is_block !== undefined
                ? state.technicianDetails.is_block
                : (state.technicianDetails.data?.is_block !== undefined
                    ? state.technicianDetails.data.is_block
                    : (state.technicianDetails.status === 0 ? 1 : 0));
            const toggledBlock = newIsBlock !== null ? newIsBlock : (currentBlock === 1 ? 0 : 1);
            state.technicianDetails = {
              ...state.technicianDetails,
              is_block: toggledBlock,
              status: toggledBlock === 1 ? 0 : 1,
            };
            if (state.technicianDetails.data) {
              state.technicianDetails.data = {
                ...state.technicianDetails.data,
                is_block: toggledBlock,
                status: toggledBlock === 1 ? 0 : 1,
              };
            }
          }
        }
      })
      .addCase(toggleBlockTechnician.rejected, (state) => {
        state.isActionLoading = false;
      })

      // Delete Technician
      .addCase(deleteTechnician.pending, (state) => {
        state.isActionLoading = true;
      })
      .addCase(deleteTechnician.fulfilled, (state, action) => {
        state.isActionLoading = false;
        const deletedId = action.meta?.arg?.id;
        if (deletedId) {
          state.techniciansList = state.techniciansList.filter(
            (tech) => tech.id !== deletedId
          );
          state.techniciansMeta = {
            ...state.techniciansMeta,
            totalItems: Math.max(0, (state.techniciansMeta.totalItems || 1) - 1),
          };
          if (state.technicianDetails && state.technicianDetails.id === deletedId) {
            state.technicianDetails = null;
          }
        }
      })
      .addCase(deleteTechnician.rejected, (state) => {
        state.isActionLoading = false;
      });
  },
});

export const { clearTechnicianDetails, setTechniciansList } = technicianSlice.actions;
export default technicianSlice.reducer;
