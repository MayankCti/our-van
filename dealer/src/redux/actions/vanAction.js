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
