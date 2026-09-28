import { createSlice } from "@reduxjs/toolkit";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../actions/serviceAction";

const initialState = {
  servicesList: [],
  servicesMeta: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isServicesLoading: false,
  servicesError: null,

  serviceDetails: null,
  isDetailsLoading: false,
  detailsError: null,

  isActionLoading: false,
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    clearServiceDetails: (state) => {
      state.serviceDetails = null;
      state.detailsError = null;
    },
    setServicesList: (state, action) => {
      state.servicesList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Services List
      .addCase(getServices.pending, (state) => {
        state.isServicesLoading = true;
        state.servicesError = null;
      })
      .addCase(getServices.fulfilled, (state, action) => {
        state.isServicesLoading = false;
        const payloadData = action.payload?.data;
        if (Array.isArray(payloadData)) {
          state.servicesList = payloadData;
          state.servicesMeta = {
            totalItems: action.payload?.meta?.totalItems || payloadData.length,
            totalPages: action.payload?.meta?.totalPages || 1,
            currentPage: action.payload?.meta?.currentPage || 1,
            limit: action.payload?.meta?.limit || payloadData.length || 10,
            hasNextPage: action.payload?.meta?.hasNextPage || false,
            hasPrevPage: action.payload?.meta?.hasPrevPage || false,
          };
        } else if (payloadData && Array.isArray(payloadData.data)) {
          state.servicesList = payloadData.data;
          state.servicesMeta = payloadData.meta || action.payload?.meta || state.servicesMeta;
        } else if (payloadData && Array.isArray(payloadData.services)) {
          state.servicesList = payloadData.services;
          state.servicesMeta = payloadData.meta || action.payload?.meta || state.servicesMeta;
        } else {
          state.servicesList = [];
        }
      })
      .addCase(getServices.rejected, (state, action) => {
        state.isServicesLoading = false;
        state.servicesError = action.payload?.message || "Failed to fetch services";
      })

      // Get Service Details By ID
      .addCase(getServiceById.pending, (state) => {
        state.isDetailsLoading = true;
        state.detailsError = null;
      })
      .addCase(getServiceById.fulfilled, (state, action) => {
        state.isDetailsLoading = false;
        state.serviceDetails = action.payload?.data || null;
      })
      .addCase(getServiceById.rejected, (state, action) => {
        state.isDetailsLoading = false;
        state.detailsError = action.payload?.message || "Failed to fetch service details";
      })

      // Create Service
      .addCase(createService.pending, (state) => {
        state.isActionLoading = true;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.isActionLoading = false;
        const newService = action.payload?.data;
        if (newService && Array.isArray(state.servicesList)) {
          state.servicesList = [newService, ...state.servicesList];
          state.servicesMeta = {
            ...state.servicesMeta,
            totalItems: (state.servicesMeta.totalItems || 0) + 1,
          };
        }
      })
      .addCase(createService.rejected, (state) => {
        state.isActionLoading = false;
      })

      // Update Service
      .addCase(updateService.pending, (state) => {
        state.isActionLoading = true;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.isActionLoading = false;
        const updatedService = action.payload?.data;
        const targetId = updatedService?.id || action.meta?.arg?.id;

        if (targetId && Array.isArray(state.servicesList)) {
          state.servicesList = state.servicesList.map((srv) => {
            if (String(srv.id) === String(targetId)) {
              return { ...srv, ...updatedService };
            }
            return srv;
          });
        }

        if (state.serviceDetails && String(state.serviceDetails?.id) === String(targetId)) {
          state.serviceDetails = {
            ...state.serviceDetails,
            ...(updatedService || {}),
          };
        }
      })
      .addCase(updateService.rejected, (state) => {
        state.isActionLoading = false;
      })

      // Delete Service
      .addCase(deleteService.pending, (state) => {
        state.isActionLoading = true;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.isActionLoading = false;
        const deletedId = action.meta?.arg?.id;
        if (deletedId) {
          state.servicesList = state.servicesList.filter(
            (srv) => String(srv.id) !== String(deletedId)
          );
          state.servicesMeta = {
            ...state.servicesMeta,
            totalItems: Math.max(0, (state.servicesMeta.totalItems || 1) - 1),
          };
          if (state.serviceDetails && String(state.serviceDetails.id) === String(deletedId)) {
            state.serviceDetails = null;
          }
        }
      })
      .addCase(deleteService.rejected, (state) => {
        state.isActionLoading = false;
      });
  },
});

export const { clearServiceDetails, setServicesList } = serviceSlice.actions;
export default serviceSlice.reducer;
