import { createSlice } from "@reduxjs/toolkit";
import {
  createVanStep1,
  createVanStep2,
  createVanStep3,
  createVanStep4,
  createVanStep5,
  createVanStep6,
  getVanProgress,
  getVansList,
  getDealerOwnersList,
  getDealerDashboard,
  getComponentsList,
  getVanReview,
  publishVan,
  getVanDetails,
} from "../actions/vanAction";

const initialState = {
  isLoading: false,
  vanStep1Data: null,
  vanStep2Data: null,
  vanStep3Data: null,
  vanStep4Data: null,
  vanStep5Data: null,
  vanStep6Data: null,
  vanProgressData: null,
  vanReviewData: null,
  isReviewLoading: false,
  reviewError: null,
  isPublishing: false,
  publishError: null,
  vanDetailsData: null,
  isVanDetailsLoading: false,
  vanDetailsError: null,
  vanId: null,
  ownerId: null,
  error: null,
  // Vans list & pagination
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
  // Owners list & pagination
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
  // Dashboard details
  dashboardData: null,
  isDashboardLoading: false,
  dashboardError: null,
  // Components Master List (Step 3)
  componentsList: [],
  isComponentsLoading: false,
  componentsError: null,
};

const vanSlice = createSlice({
  name: "van",
  initialState,
  reducers: {
    setVanId: (state, action) => {
      state.vanId = action.payload;
    },
    setOwnerId: (state, action) => {
      state.ownerId = action.payload;
    },
    setVanStep1Data: (state, action) => {
      state.vanStep1Data = action.payload;
    },
    setVanStep2Data: (state, action) => {
      state.vanStep2Data = action.payload;
    },
    setVanStep3Data: (state, action) => {
      state.vanStep3Data = action.payload;
    },
    setVanStep4Data: (state, action) => {
      state.vanStep4Data = action.payload;
    },
    setVanStep5Data: (state, action) => {
      state.vanStep5Data = action.payload;
    },
    setVanStep6Data: (state, action) => {
      state.vanStep6Data = action.payload;
    },
    setVanProgressData: (state, action) => {
      state.vanProgressData = action.payload;
    },
    resetVanState: (state) => {
      state.isLoading = false;
      state.vanStep1Data = null;
      state.vanStep2Data = null;
      state.vanStep3Data = null;
      state.vanStep4Data = null;
      state.vanStep5Data = null;
      state.vanStep6Data = null;
      state.vanProgressData = null;
      state.vanId = null;
      state.ownerId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // createVanStep1
    builder.addCase(createVanStep1.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createVanStep1.fulfilled, (state, action) => {
      state.isLoading = false;
      const resData = action?.payload?.data || action?.payload;
      state.vanStep1Data = resData;
      const id = resData?.van_id || resData?.id || resData?.van?.id || resData?.data?.van_id || resData?.data?.id;
      if (id) {
        state.vanId = id;
      }
      state.error = null;
    });
    builder.addCase(createVanStep1.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error?.message;
    });

    // createVanStep2
    builder.addCase(createVanStep2.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createVanStep2.fulfilled, (state, action) => {
      state.isLoading = false;
      const resData = action?.payload?.data || action?.payload;
      state.vanStep2Data = resData;
      const vId = resData?.van_id || resData?.id;
      if (vId) {
        state.vanId = vId;
      }
      const oId = resData?.owner_id || resData?.id;
      if (oId) {
        state.ownerId = oId;
      }
      state.error = null;
    });
    builder.addCase(createVanStep2.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error?.message;
    });

    // createVanStep3
    builder.addCase(createVanStep3.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createVanStep3.fulfilled, (state, action) => {
      state.isLoading = false;
      const resData = action?.payload?.data || action?.payload;
      state.vanStep3Data = resData;
      state.error = null;
    });
    builder.addCase(createVanStep3.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error?.message;
    });

    // createVanStep4
    builder.addCase(createVanStep4.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createVanStep4.fulfilled, (state, action) => {
      state.isLoading = false;
      const resData = action?.payload?.data || action?.payload;
      state.vanStep4Data = resData;
      state.error = null;
    });
    builder.addCase(createVanStep4.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error?.message;
    });

    // createVanStep5
    builder.addCase(createVanStep5.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createVanStep5.fulfilled, (state, action) => {
      state.isLoading = false;
      const resData = action?.payload?.data || action?.payload;
      state.vanStep5Data = resData;
      state.error = null;
    });
    builder.addCase(createVanStep5.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error?.message;
    });

    // createVanStep6
    builder.addCase(createVanStep6.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createVanStep6.fulfilled, (state, action) => {
      state.isLoading = false;
      const resData = action?.payload?.data || action?.payload;
      state.vanStep6Data = resData;
      state.error = null;
    });
    builder.addCase(createVanStep6.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error?.message;
    });

    // getComponentsList
    builder.addCase(getComponentsList.pending, (state) => {
      state.isComponentsLoading = true;
      state.componentsError = null;
    });
    builder.addCase(getComponentsList.fulfilled, (state, action) => {
      state.isComponentsLoading = false;
      const payload = action?.payload || {};
      state.componentsList = Array.isArray(payload?.data) ? payload.data : [];
      state.componentsError = null;
    });
    builder.addCase(getComponentsList.rejected, (state, action) => {
      state.isComponentsLoading = false;
      state.componentsError = action.payload || action.error?.message;
    });


    // getVanProgress
    builder.addCase(getVanProgress.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getVanProgress.fulfilled, (state, action) => {
      state.isLoading = false;
      const resData = action?.payload?.data || action?.payload;
      state.vanProgressData = resData;
      const vId = resData?.van_id || resData?.vehicle_details?.van_id;
      if (vId) {
        state.vanId = vId;
      }
      const oId = resData?.owner?.id || resData?.vehicle_details?.owner_id;
      if (oId) {
        state.ownerId = oId;
      }
      state.error = null;
    });
    builder.addCase(getVanProgress.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error?.message;
    });

    // getVansList
    builder.addCase(getVansList.pending, (state) => {
      state.isVansLoading = true;
      state.vansError = null;
    });
    builder.addCase(getVansList.fulfilled, (state, action) => {
      state.isVansLoading = false;
      const payload = action?.payload || {};
      state.vansList = Array.isArray(payload?.data) ? payload.data : [];
      if (payload?.meta) {
        state.vansMeta = payload.meta;
      }
      state.vansError = null;
    });
    builder.addCase(getVansList.rejected, (state, action) => {
      state.isVansLoading = false;
      state.vansError = action.payload || action.error?.message;
      state.vansList = [];
    });

    // getDealerOwnersList
    builder.addCase(getDealerOwnersList.pending, (state) => {
      state.isOwnersLoading = true;
      state.ownersError = null;
    });
    builder.addCase(getDealerOwnersList.fulfilled, (state, action) => {
      state.isOwnersLoading = false;
      const payload = action?.payload || {};
      state.ownersList = Array.isArray(payload?.data) ? payload.data : [];
      if (payload?.meta) {
        state.ownersMeta = payload.meta;
      }
      state.ownersError = null;
    });
    builder.addCase(getDealerOwnersList.rejected, (state, action) => {
      state.isOwnersLoading = false;
      state.ownersError = action.payload || action.error?.message;
      state.ownersList = [];
    });

    // getDealerDashboard
    builder.addCase(getDealerDashboard.pending, (state) => {
      state.isDashboardLoading = true;
      state.dashboardError = null;
    });
    builder.addCase(getDealerDashboard.fulfilled, (state, action) => {
      state.isDashboardLoading = false;
      const payload = action?.payload || {};
      state.dashboardData = payload?.data || null;
      state.dashboardError = null;
    });
    builder.addCase(getDealerDashboard.rejected, (state, action) => {
      state.isDashboardLoading = false;
      state.dashboardError = action.payload || action.error?.message;
    });

    // getVanReview
    builder.addCase(getVanReview.pending, (state) => {
      state.isReviewLoading = true;
      state.reviewError = null;
    });
    builder.addCase(getVanReview.fulfilled, (state, action) => {
      state.isReviewLoading = false;
      state.vanReviewData = action?.payload?.data || action?.payload || null;
      state.reviewError = null;
    });
    builder.addCase(getVanReview.rejected, (state, action) => {
      state.isReviewLoading = false;
      state.reviewError = action.payload || action.error?.message;
    });

    // publishVan (Step 7)
    builder.addCase(publishVan.pending, (state) => {
      state.isPublishing = true;
      state.publishError = null;
    });
    builder.addCase(publishVan.fulfilled, (state) => {
      state.isPublishing = false;
      state.publishError = null;
    });
    builder.addCase(publishVan.rejected, (state, action) => {
      state.isPublishing = false;
      state.publishError = action.payload || action.error?.message;
    });

    // getVanDetails (Van Detail page)
    builder.addCase(getVanDetails.pending, (state) => {
      state.isVanDetailsLoading = true;
      state.vanDetailsError = null;
    });
    builder.addCase(getVanDetails.fulfilled, (state, action) => {
      state.isVanDetailsLoading = false;
      state.vanDetailsData = action?.payload?.data || action?.payload || null;
      state.vanDetailsError = null;
    });
    builder.addCase(getVanDetails.rejected, (state, action) => {
      state.isVanDetailsLoading = false;
      state.vanDetailsError = action.payload || action.error?.message;
    });
  },
});

export const {
  setVanId,
  setOwnerId,
  setVanStep1Data,
  setVanStep2Data,
  setVanStep3Data,
  setVanStep4Data,
  setVanStep5Data,
  setVanStep6Data,
  setVanProgressData,
  resetVanState,
} = vanSlice.actions;
export default vanSlice.reducer;

