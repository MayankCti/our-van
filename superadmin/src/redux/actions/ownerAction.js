import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_REQUEST } from "../../services/api";

// Get Owners List (paginated with search)
export const getOwnersList = createAsyncThunk(
  "owner/getOwnersList",
  async (props = {}, { rejectWithValue }) => {
    const { page = 1, limit = 10, search = "", callback } = props;
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_GET_OWNERS_API || "/admin/owners/get",
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

// Get Owner Details by ID (with assigned vans & pagination)
export const getOwnerDetails = createAsyncThunk(
  "owner/getOwnerDetails",
  async (props = {}, { rejectWithValue }) => {
    const { ownerId, page = 1, limit = 10, search = "", callback } = props;
    try {
      const baseUrl = import.meta.env.VITE_GET_OWNER_DETAILS_API || "/admin/owners/details";
      const response = await API_REQUEST({
        url: `${baseUrl}/${ownerId}`,
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

// Toggle Block / Unblock Owner
export const toggleBlockOwner = createAsyncThunk(
  "owner/toggleBlockOwner",
  async (props = {}, { rejectWithValue }) => {
    const { ownerId, callback } = props;
    try {
      const baseUrl = import.meta.env.VITE_BLOCK_OWNER_API || "/admin/owners/block";
      const response = await API_REQUEST({
        url: `${baseUrl}/${ownerId}`,
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


