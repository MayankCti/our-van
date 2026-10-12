import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_REQUEST } from "../../services/api";

// Get Technicians List (paginated with optional search)
export const getTechniciansList = createAsyncThunk(
  "technician/getTechniciansList",
  async (props = {}, { rejectWithValue }) => {
    const { page = 1, limit = 10, search = "", callback } = props;
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_GET_TECHNICIANS_API || "/admin/dealers/get/technicians",
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

// Get Technician Details by ID
export const getTechnicianDetails = createAsyncThunk(
  "technician/getTechnicianDetails",
  async (props = {}, { rejectWithValue }) => {
    const { technicianId, callback } = props;
    try {
      const baseUrl =
        import.meta.env.VITE_GET_TECHNICIAN_DETAILS_API ||
        "/admin/dealers/get/technicians";
      const response = await API_REQUEST({
        url: `${baseUrl}/${technicianId}`,
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
