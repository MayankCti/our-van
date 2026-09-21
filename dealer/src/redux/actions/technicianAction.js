import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_REQUEST } from "../../services/api";

// Get All Technicians Assigned to Dealer
export const getTechniciansByDealer = createAsyncThunk(
  "technician/getTechniciansByDealer",
  async (props = {}, { rejectWithValue }) => {
    const { page, limit, search, callback } = props;
    try {
      const params = {};
      if (page !== undefined) params.page = page;
      if (limit !== undefined) params.limit = limit;
      if (search) params.search = search;

      const response = await API_REQUEST({
        url: import.meta.env.VITE_GET_TECHNICIANS_BY_DEALER_API || "/technician/by-dealer",
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

// Get Technician Details By ID
export const getTechnicianById = createAsyncThunk(
  "technician/getTechnicianById",
  async (props, { rejectWithValue }) => {
    const { id, callback } = props;
    try {
      const endpoint = (
        import.meta.env.VITE_GET_TECHNICIAN_DETAILS_BY_DEALER_API ||
        "/technician/by-dealer/:id"
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

// Toggle Block / Unblock Technician
export const toggleBlockTechnician = createAsyncThunk(
  "technician/toggleBlockTechnician",
  async (props, { rejectWithValue }) => {
    const { id, callback } = props;
    try {
      const endpoint = (
        import.meta.env.VITE_TOGGLE_BLOCK_TECHNICIAN_API ||
        "/technician/by-dealer/:id/block"
      ).replace(":id", id);

      const response = await API_REQUEST({
        url: endpoint,
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

// Delete Technician
export const deleteTechnician = createAsyncThunk(
  "technician/deleteTechnician",
  async (props, { rejectWithValue }) => {
    const { id, callback } = props;
    try {
      const endpoint = (
        import.meta.env.VITE_DELETE_TECHNICIAN_API ||
        "/technician/by-dealer/:id"
      ).replace(":id", id);

      const response = await API_REQUEST({
        url: endpoint,
        method: "DELETE",
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
