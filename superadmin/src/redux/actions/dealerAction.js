import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_REQUEST } from "../../services/api";

// Get Dealers List (paginated with search)
export const getDealersList = createAsyncThunk(
  "dealer/getDealersList",
  async (props = {}, { rejectWithValue }) => {
    const { page = 1, limit = 10, search = "", callback } = props;
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_GET_DEALERS_API || "/admin/dealers/get",
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

// Get Dealer Details by ID (with assigned vans & pagination)
export const getDealerDetails = createAsyncThunk(
  "dealer/getDealerDetails",
  async (props = {}, { rejectWithValue }) => {
    const { dealerId, page = 1, limit = 10, search = "", callback } = props;
    try {
      const baseUrl = import.meta.env.VITE_GET_DEALER_DETAILS_API || "/admin/dealers";
      const response = await API_REQUEST({
        url: `${baseUrl}/${dealerId}`,
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

// Toggle Block / Unblock Dealer
export const toggleBlockDealer = createAsyncThunk(
  "dealer/toggleBlockDealer",
  async (props = {}, { rejectWithValue }) => {
    const { dealerId, callback } = props;
    try {
      const baseUrl = import.meta.env.VITE_BLOCK_DEALER_API || "/admin/dealers/block";
      const response = await API_REQUEST({
        url: `${baseUrl}/${dealerId}`,
        method: "PATCH",
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

