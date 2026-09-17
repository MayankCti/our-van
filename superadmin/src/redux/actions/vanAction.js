import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_REQUEST } from "../../services/api";

// Get Vans List (paginated with search)
export const getVansList = createAsyncThunk(
  "van/getVansList",
  async (props = {}, { rejectWithValue }) => {
    const { page = 1, limit = 10, search = "", callback } = props;
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_GET_VANS_API || "/admin/vans/get",
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

// Get Van Details by ID
export const getVanDetails = createAsyncThunk(
  "van/getVanDetails",
  async (props = {}, { rejectWithValue }) => {
    const { vanId, callback } = props;
    try {
      const baseUrl = import.meta.env.VITE_GET_VAN_DETAILS_API || "/admin/vans/get";
      const response = await API_REQUEST({
        url: `${baseUrl}/${vanId}`,
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

