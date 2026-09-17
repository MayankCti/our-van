import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_REQUEST } from "../../services/api";

// Get Superadmin Dashboard Data
export const getDashboardData = createAsyncThunk(
  "dashboard/getDashboardData",
  async (props = {}, { rejectWithValue }) => {
    const { callback } = props;
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_GET_DASHBOARD_API || "/admin/dashboard/",
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
