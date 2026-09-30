import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_REQUEST } from "../../services/api";

// Get All Assigned Maintenance Tasks for Current Technician
export const getTechnicianAssignedTasks = createAsyncThunk(
  "maintenance/getTechnicianAssignedTasks",
  async (props = {}, { rejectWithValue }) => {
    const { page, limit, search, priority, status, callback } = props;
    try {
      const params = {};
      if (page !== undefined) params.page = page;
      if (limit !== undefined) params.limit = limit;
      if (search) params.search = search;
      if (priority && priority !== 'all') params.priority = priority;
      if (status && status !== 'all') params.status = status;

      const response = await API_REQUEST({
        url: import.meta.env.VITE_GET_TECHNICIAN_ASSIGNED_TASKS_API || "/technician/my-assigned-tasks",
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

// Get Assigned Maintenance Task Details By ID
export const getTechnicianMaintenanceDetail = createAsyncThunk(
  "maintenance/getTechnicianMaintenanceDetail",
  async (props, { rejectWithValue }) => {
    const { id, callback } = props;
    try {
      const endpoint = (
        import.meta.env.VITE_GET_TECHNICIAN_MAINTENANCE_DETAILS_API ||
        "/technician/maintenance/:id"
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
