import { createSlice } from "@reduxjs/toolkit";
import { createVanStep1, createVanStep2, getVanProgress } from "../actions/vanAction";

const initialState = {
  isLoading: false,
  vanStep1Data: null,
  vanStep2Data: null,
  vanProgressData: null,
  vanId: null,
  ownerId: null,
  error: null,
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
    setVanProgressData: (state, action) => {
      state.vanProgressData = action.payload;
    },
    resetVanState: (state) => {
      state.isLoading = false;
      state.vanStep1Data = null;
      state.vanStep2Data = null;
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
  },
});

export const {
  setVanId,
  setOwnerId,
  setVanStep1Data,
  setVanStep2Data,
  setVanProgressData,
  resetVanState,
} = vanSlice.actions;
export default vanSlice.reducer;
