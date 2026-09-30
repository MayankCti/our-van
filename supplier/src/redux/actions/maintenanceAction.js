import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_REQUEST } from "../../services/api";

// Get All Assigned Maintenance Tasks for Current Supplier
export const getSupplierAssignedTasks = createAsyncThunk(
  "maintenance/getSupplierAssignedTasks",
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
        url: import.meta.env.VITE_GET_SUPPLIER_ASSIGNED_TASKS_API || "/supplier/my-assigned-tasks",
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
export const getSupplierMaintenanceDetail = createAsyncThunk(
  "maintenance/getSupplierMaintenanceDetail",
  async (props, { rejectWithValue }) => {
    const { id, callback } = props;
    try {
      const endpoint = (
        import.meta.env.VITE_GET_SUPPLIER_MAINTENANCE_DETAILS_API ||
        "/supplier/maintenance/:id"
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

// Respond to Assigned Maintenance Task (Accept or Reject)
export const respondToSupplierMaintenanceTask = createAsyncThunk(
  "maintenance/respondToSupplierMaintenanceTask",
  async (props, { rejectWithValue }) => {
    const { id, status, callback } = props;
    try {
      const endpoint = (
        import.meta.env.VITE_RESPOND_SUPPLIER_MAINTENANCE_API ||
        "/supplier/maintenance/:id/respond"
      ).replace(":id", id);

      const response = await API_REQUEST({
        url: endpoint,
        method: "PATCH",
        data: { status },
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

