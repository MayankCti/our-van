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

// Update Maintenance Job Timer (START, PAUSE, RESUME)
export const updateSupplierMaintenanceTimer = createAsyncThunk(
  "maintenance/updateSupplierMaintenanceTimer",
  async (props, { rejectWithValue }) => {
    const { maintenance_id, type, callback } = props;
    try {
      const endpoint =
        import.meta.env.VITE_SUPPLIER_TIMER_API || "/supplier/timer";

      const response = await API_REQUEST({
        url: endpoint,
        method: "POST",
        data: { maintenance_id: Number(maintenance_id), type },
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

// Submit / Update CDS Job Sheet
export const updateSupplierCdsSheet = createAsyncThunk(
  "maintenance/updateSupplierCdsSheet",
  async (props, { rejectWithValue }) => {
    const { id, data, callback } = props;
    try {
      const endpoint = (
        import.meta.env.VITE_SUPPLIER_CDS_SHEET_API ||
        "/supplier/maintenance/:id/cds-sheet"
      ).replace(":id", id);

      const response = await API_REQUEST({
        url: endpoint,
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

// Get Parts List for Selection
export const getSupplierPartsList = createAsyncThunk(
  "maintenance/getSupplierPartsList",
  async (props = {}, { rejectWithValue }) => {
    const { callback } = props;
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_GET_PARTS_API || "/dealer/parts",
        method: "GET",
        isErrorToast: false,
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

// Request Extra Part
export const createSupplierPartRequest = createAsyncThunk(
  "maintenance/createSupplierPartRequest",
  async (props, { rejectWithValue }) => {
    const { maintenance_id, part_name, quantity, callback } = props;
    try {
      const response = await API_REQUEST({
        url:
          import.meta.env.VITE_SUPPLIER_PART_REQUESTS_API ||
          "/supplier/part-requests",
        method: "POST",
        data: {
          maintenance_id: Number(maintenance_id),
          part_name: String(part_name).trim(),
          quantity: Number(quantity),
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

// Complete Maintenance Task (Upload Images & Summary)
export const completeSupplierMaintenanceTask = createAsyncThunk(
  "maintenance/completeSupplierMaintenanceTask",
  async (props, { rejectWithValue }) => {
    const { id, data, callback } = props;
    try {
      const endpoint = (
        import.meta.env.VITE_SUPPLIER_COMPLETE_TASK_API ||
        "/supplier/maintenance/:id/complete-task"
      ).replace(":id", id);

      const response = await API_REQUEST({
        url: endpoint,
        method: "POST",
        data, // FormData (multipart/form-data)
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



