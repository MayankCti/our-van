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

// Update Maintenance Job Timer (START, PAUSE, RESUME)
export const updateTechnicianMaintenanceTimer = createAsyncThunk(
  "maintenance/updateTechnicianMaintenanceTimer",
  async (props, { rejectWithValue }) => {
    const { maintenance_id, type, callback } = props;
    try {
      const endpoint =
        import.meta.env.VITE_TECHNICIAN_TIMER_API || "/technician/timer";

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
export const updateTechnicianCdsSheet = createAsyncThunk(
  "maintenance/updateTechnicianCdsSheet",
  async (props, { rejectWithValue }) => {
    const { id, data, callback } = props;
    try {
      const endpoint = (
        import.meta.env.VITE_TECHNICIAN_CDS_SHEET_API ||
        "/technician/maintenance/:id/cds-sheet"
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
export const getTechnicianPartsList = createAsyncThunk(
  "maintenance/getTechnicianPartsList",
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
export const createTechnicianPartRequest = createAsyncThunk(
  "maintenance/createTechnicianPartRequest",
  async (props, { rejectWithValue }) => {
    const { maintenance_id, part_name, quantity, callback } = props;
    try {
      const response = await API_REQUEST({
        url:
          import.meta.env.VITE_TECHNICIAN_PART_REQUESTS_API ||
          "/technician/part-requests",
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
export const completeTechnicianMaintenanceTask = createAsyncThunk(
  "maintenance/completeTechnicianMaintenanceTask",
  async (props, { rejectWithValue }) => {
    const { id, data, callback } = props;
    try {
      const endpoint = (
        import.meta.env.VITE_TECHNICIAN_COMPLETE_TASK_API ||
        "/technician/maintenance/:id/complete-task"
      ).replace(":id", id);

      const response = await API_REQUEST({
        url: endpoint,
        method: "POST",
        data, // FormData
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
