import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_REQUEST } from "../../services/api";

// Get All Suppliers Assigned to Dealer
export const getSuppliersByDealer = createAsyncThunk(
  "supplier/getSuppliersByDealer",
  async (props = {}, { rejectWithValue }) => {
    const { page, limit, search, callback } = props;
    try {
      const params = {};
      if (page !== undefined) params.page = page;
      if (limit !== undefined) params.limit = limit;
      if (search) params.search = search;

      const response = await API_REQUEST({
        url: import.meta.env.VITE_GET_SUPPLIERS_BY_DEALER_API || "/supplier/by-dealer",
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

// Get Supplier Details By ID
export const getSupplierById = createAsyncThunk(
  "supplier/getSupplierById",
  async (props, { rejectWithValue }) => {
    const { id, callback } = props;
    try {
      const endpoint = (
        import.meta.env.VITE_GET_SUPPLIER_DETAILS_BY_DEALER_API ||
        "/supplier/by-dealer/:id"
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

// Toggle Block / Unblock Supplier
export const toggleBlockSupplier = createAsyncThunk(
  "supplier/toggleBlockSupplier",
  async (props, { rejectWithValue }) => {
    const { id, callback } = props;
    try {
      const endpoint = (
        import.meta.env.VITE_TOGGLE_BLOCK_SUPPLIER_API ||
        "/supplier/by-dealer/:id/block"
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

// Delete Supplier
export const deleteSupplier = createAsyncThunk(
  "supplier/deleteSupplier",
  async (props, { rejectWithValue }) => {
    const { id, callback } = props;
    try {
      const endpoint = (
        import.meta.env.VITE_DELETE_SUPPLIER_API ||
        "/supplier/by-dealer/:id"
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
