import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_REQUEST } from "../../services/api";

// Get Components List (paginated with search)
export const getComponentsList = createAsyncThunk(
  "component/getComponentsList",
  async (props = {}, { rejectWithValue }) => {
    const { page = 1, limit = 10, search = "", callback } = props;
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_GET_COMPONENTS_API || "/admin/vans/component/get",
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

// Create Component
export const createComponent = createAsyncThunk(
  "component/createComponent",
  async (props = {}, { rejectWithValue }) => {
    const { payload, callback } = props;
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_CREATE_COMPONENT_API || "/admin/vans/component/create",
        method: "POST",
        data: payload,
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

// Edit Component
export const editComponent = createAsyncThunk(
  "component/editComponent",
  async (props = {}, { rejectWithValue }) => {
    const { payload, callback } = props;
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_EDIT_COMPONENT_API || "/admin/vans/component/edit",
        method: "PATCH",
        data: payload,
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

// Delete Component
export const deleteComponent = createAsyncThunk(
  "component/deleteComponent",
  async (props = {}, { rejectWithValue }) => {
    const { id, payload, callback } = props;
    try {
      const baseUrl = import.meta.env.VITE_DELETE_COMPONENT_API || "/admin/vans/component/delete";
      const response = await API_REQUEST({
        url: `${baseUrl}/${id}`,
        method: "DELETE",
        data: payload,
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
