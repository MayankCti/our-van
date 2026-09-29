import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_REQUEST } from "../../services/api";

// Get All Maintenance Tasks
export const getMaintenanceList = createAsyncThunk(
  "maintenance/getMaintenanceList",
  async (props = {}, { rejectWithValue }) => {
    const { page, limit, search, callback } = props;
    try {
      const params = {};
      if (page !== undefined) params.page = page;
      if (limit !== undefined) params.limit = limit;
      if (search) params.search = search;

      const response = await API_REQUEST({
        url:
          import.meta.env.VITE_GET_MAINTENANCE_LIST_API ||
          "/dealer/maintenance/get/all",
        method: "GET",
        params: Object.keys(params).length > 0 ? params : undefined,
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

// Get Maintenance Task Details By ID
export const getMaintenanceById = createAsyncThunk(
  "maintenance/getMaintenanceById",
  async (props, { rejectWithValue }) => {
    const { id, callback } = props;
    try {
      const endpoint = (
        import.meta.env.VITE_GET_MAINTENANCE_DETAILS_API ||
        "/dealer/maintenance/:id"
      ).replace(":id", id);

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

// Create New Maintenance Task
export const createMaintenance = createAsyncThunk(
  "maintenance/createMaintenance",
  async (props, { rejectWithValue }) => {
    const { data, callback } = props;
    try {
      const response = await API_REQUEST({
        url:
          import.meta.env.VITE_CREATE_MAINTENANCE_API ||
          "/dealer/maintenance/create",
        method: "POST",
        data,
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
