import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_REQUEST } from "../../services/api";

// Create / Save Van Step-1 Vehicle Information
export const createVanStep1 = createAsyncThunk(
  "van/createVanStep1",
  async (props, { rejectWithValue }) => {
    const { payload, callback } = props;
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_VAN_STEP_1_API,
        method: "POST",
        data: payload,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        isErrorToast: true,
        isSuccessToast: true,
      });

      if (typeof callback === "function") {
        callback(response);
      }
      return response;
    } catch (error) {
      if (typeof callback === "function") {
        callback(null, error);
      }
      return rejectWithValue(error?.data || error);
    }
  }
);

// Create / Save Van Step-2 Owner Details
export const createVanStep2 = createAsyncThunk(
  "van/createVanStep2",
  async (props, { rejectWithValue }) => {
    const { vanId, payload, callback } = props;
    try {
      const endpoint = (import.meta.env.VITE_VAN_STEP_2_API || "/dealer/vans/:vanId/step-2").replace(
        ":vanId",
        vanId
      );
      const response = await API_REQUEST({
        url: endpoint,
        method: "POST",
        data: payload,
        isErrorToast: true,
        isSuccessToast: true,
      });

      if (typeof callback === "function") {
        callback(response);
      }
      return response;
    } catch (error) {
      if (typeof callback === "function") {
        callback(null, error);
      }
      return rejectWithValue(error?.data || error);
    }
  }
);

// Get Van Progress across all steps
export const getVanProgress = createAsyncThunk(
  "van/getVanProgress",
  async (props, { rejectWithValue }) => {
    const { vanId, callback } = props;
    try {
      const endpoint = (import.meta.env.VITE_VAN_PROGRESS_API || "/dealer/vans/:vanId/progress").replace(
        ":vanId",
        vanId
      );
      const response = await API_REQUEST({
        url: endpoint,
        method: "GET",
        isErrorToast: true,
        isSuccessToast: false,
      });

      if (typeof callback === "function") {
        callback(response);
      }
      return response;
    } catch (error) {
      if (typeof callback === "function") {
        callback(null, error);
      }
      return rejectWithValue(error?.data || error);
    }
  }
);

// Get Vans List (paginated with search)
export const getVansList = createAsyncThunk(
  "van/getVansList",
  async (props = {}, { rejectWithValue }) => {
    const { page = 1, limit = 10, search = "", callback } = props;
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_GET_VANS_API || "/dealer/vans/get",
        method: "GET",
        params: {
          page,
          limit,
          search: search || undefined,
        },
        isErrorToast: true,
        isSuccessToast: false,
      });

      if (typeof callback === "function") {
        callback(response);
      }
      return response;
    } catch (error) {
      if (typeof callback === "function") {
        callback(null, error);
      }
      return rejectWithValue(error?.data || error);
    }
  }
);

// Get Dealer Owners List (paginated with search)
export const getDealerOwnersList = createAsyncThunk(
  "van/getDealerOwnersList",
  async (props = {}, { rejectWithValue }) => {
    const { page = 1, limit = 10, search = "", callback } = props;
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_GET_OWNERS_API || "/dealer/vans/get/owners/list",
        method: "GET",
        params: {
          page,
          limit,
          search: search || undefined,
        },
        isErrorToast: true,
        isSuccessToast: false,
      });

      if (typeof callback === "function") {
        callback(response);
      }
      return response;
    } catch (error) {
      if (typeof callback === "function") {
        callback(null, error);
      }
      return rejectWithValue(error?.data || error);
    }
  }
);

// Get Dealer Dashboard details
export const getDealerDashboard = createAsyncThunk(
  "van/getDealerDashboard",
  async (props = {}, { rejectWithValue }) => {
    const { callback } = props || {};
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_GET_DASHBOARD_API || "/dealer/dashboard",
        method: "GET",
        isErrorToast: true,
        isSuccessToast: false,
      });

      if (typeof callback === "function") {
        callback(response);
      }
      return response;
    } catch (error) {
      if (typeof callback === "function") {
        callback(null, error);
      }
      return rejectWithValue(error?.data || error);
    }
  }
);

// Get Available Components List (for step 3 selection)
export const getComponentsList = createAsyncThunk(
  "van/getComponentsList",
  async (props = {}, { rejectWithValue }) => {
    const { callback } = props || {};
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_GET_COMPONENTS_API || "/dealer/vans/components",
        method: "GET",
        isErrorToast: true,
        isSuccessToast: false,
      });

      if (typeof callback === "function") {
        callback(response);
      }
      return response;
    } catch (error) {
      if (typeof callback === "function") {
        callback(null, error);
      }
      return rejectWithValue(error?.data || error);
    }
  }
);

// Create / Save Van Step-3 Components
export const createVanStep3 = createAsyncThunk(
  "van/createVanStep3",
  async (props, { rejectWithValue }) => {
    const { vanId, payload, callback } = props;
    try {
      const endpoint = (import.meta.env.VITE_VAN_STEP_3_API || "/dealer/vans/:vanId/step-3").replace(
        ":vanId",
        vanId
      );
      const response = await API_REQUEST({
        url: endpoint,
        method: "POST",
        data: payload,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        isErrorToast: true,
        isSuccessToast: true,
      });

      if (typeof callback === "function") {
        callback(response);
      }
      return response;
    } catch (error) {
      if (typeof callback === "function") {
        callback(null, error);
      }
      return rejectWithValue(error?.data || error);
    }
  }
);

// Create / Save Van Step-4 Warranty Details
export const createVanStep4 = createAsyncThunk(
  "van/createVanStep4",
  async (props, { rejectWithValue }) => {
    const { vanId, payload, callback } = props;
    try {
      const endpoint = (import.meta.env.VITE_VAN_STEP_4_API || "/dealer/vans/:vanId/step-4").replace(
        ":vanId",
        vanId
      );
      const response = await API_REQUEST({
        url: endpoint,
        method: "POST",
        data: payload,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        isErrorToast: true,
        isSuccessToast: true,
      });

      if (typeof callback === "function") {
        callback(response);
      }
      return response;
    } catch (error) {
      if (typeof callback === "function") {
        callback(null, error);
      }
      return rejectWithValue(error?.data || error);
    }
  }
);

// Create / Save Van Step-5 Documents Upload
export const createVanStep5 = createAsyncThunk(
  "van/createVanStep5",
  async (props, { rejectWithValue }) => {
    const { vanId, payload, callback } = props;
    try {
      const endpoint = (import.meta.env.VITE_VAN_STEP_5_API || "/dealer/vans/:vanId/step-5/upload").replace(
        ":vanId",
        vanId
      );
      const response = await API_REQUEST({
        url: endpoint,
        method: "POST",
        data: payload,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        isErrorToast: true,
        isSuccessToast: true,
      });

      if (typeof callback === "function") {
        callback(response);
      }
      return response;
    } catch (error) {
      if (typeof callback === "function") {
        callback(null, error);
      }
      return rejectWithValue(error?.data || error);
    }
  }
);

// Create / Save Van Step-6 Maintenance Setup
export const createVanStep6 = createAsyncThunk(
  "van/createVanStep6",
  async (props, { rejectWithValue }) => {
    const { vanId, payload, callback } = props;
    try {
      const endpoint = (import.meta.env.VITE_VAN_STEP_6_API || "/dealer/vans/:vanId/step-6").replace(
        ":vanId",
        vanId
      );
      const response = await API_REQUEST({
        url: endpoint,
        method: "POST",
        data: payload,
        isErrorToast: true,
        isSuccessToast: true,
      });

      if (typeof callback === "function") {
        callback(response);
      }
      return response;
    } catch (error) {
      if (typeof callback === "function") {
        callback(null, error);
      }
      return rejectWithValue(error?.data || error);
    }
  }
);

// Get Van Review Details (for Step 7)
export const getVanReview = createAsyncThunk(
  "van/getVanReview",
  async (props, { rejectWithValue }) => {
    const { vanId, callback } = props;
    try {
      const endpoint = (import.meta.env.VITE_VAN_REVIEW_API || "/dealer/vans/:vanId/review").replace(
        ":vanId",
        vanId
      );
      const response = await API_REQUEST({
        url: endpoint,
        method: "GET",
        isErrorToast: true,
        isSuccessToast: false,
      });

      if (typeof callback === "function") {
        callback(response);
      }
      return response;
    } catch (error) {
      if (typeof callback === "function") {
        callback(null, error);
      }
      return rejectWithValue(error?.data || error);
    }
  }
);

// Publish / Create Van Profile (Step 7)
export const publishVan = createAsyncThunk(
  "van/publishVan",
  async (props, { rejectWithValue }) => {
    const { vanId, callback } = props;
    try {
      const endpoint = (import.meta.env.VITE_VAN_PUBLISH_API || "/dealer/vans/:vanId/publish").replace(
        ":vanId",
        vanId
      );
      const response = await API_REQUEST({
        url: endpoint,
        method: "POST",
        isErrorToast: true,
        isSuccessToast: true,
      });

      if (typeof callback === "function") {
        callback(response);
      }
      return response;
    } catch (error) {
      if (typeof callback === "function") {
        callback(null, error);
      }
      return rejectWithValue(error?.data || error);
    }
  }
);

// Get Single Van Details (for Van Details page)
export const getVanDetails = createAsyncThunk(
  "van/getVanDetails",
  async (props, { rejectWithValue }) => {
    const { vanId, callback } = props;
    try {
      const endpoint = (import.meta.env.VITE_GET_VAN_DETAILS_API || "/dealer/vans/get/:vanId").replace(
        ":vanId",
        vanId
      );
      const response = await API_REQUEST({
        url: endpoint,
        method: "GET",
        isErrorToast: true,
        isSuccessToast: false,
      });

      if (typeof callback === "function") {
        callback(response);
      }
      return response;
    } catch (error) {
      if (typeof callback === "function") {
        callback(null, error);
      }
      return rejectWithValue(error?.data || error);
    }
  }
);



