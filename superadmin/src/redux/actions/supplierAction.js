import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_REQUEST } from "../../services/api";

// Get Suppliers List (paginated with optional search)
export const getSuppliersList = createAsyncThunk(
  "supplier/getSuppliersList",
  async (props = {}, { rejectWithValue }) => {
    const { page = 1, limit = 10, search = "", callback } = props;
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_GET_SUPPLIERS_API || "/admin/dealers/get/suppliers",
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

// Get Supplier Details by ID
export const getSupplierDetails = createAsyncThunk(
  "supplier/getSupplierDetails",
  async (props = {}, { rejectWithValue }) => {
    const { supplierId, callback } = props;
    try {
      const baseUrl =
        import.meta.env.VITE_GET_SUPPLIER_DETAILS_API ||
        "/admin/dealers/get/supplier";
      const response = await API_REQUEST({
        url: `${baseUrl}/${supplierId}`,
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
