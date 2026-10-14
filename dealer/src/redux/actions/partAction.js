import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_REQUEST } from "../../services/api";

// Get All Parts for Dealer
export const getParts = createAsyncThunk(
  "part/getParts",
  async (props = {}, { rejectWithValue }) => {
    const { page, limit, search, callback } = props;
    try {
      const params = {};
      if (page !== undefined) params.page = page;
      if (limit !== undefined) params.limit = limit;
      if (search) params.search = search;

      const response = await API_REQUEST({
        url: import.meta.env.VITE_GET_PARTS_API || "/dealer/parts",
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

// Get Part Details By ID
export const getPartById = createAsyncThunk(
  "part/getPartById",
  async (props, { rejectWithValue }) => {
    const { id, callback } = props;
    try {
      const endpoint = (
        import.meta.env.VITE_GET_PART_DETAILS_API || "/dealer/parts/:id"
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

// Create New Part
export const createPart = createAsyncThunk(
  "part/createPart",
  async (props, { rejectWithValue }) => {
    const { data, callback } = props;
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_CREATE_PART_API || "/dealer/parts",
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

// Update Part By ID
export const updatePart = createAsyncThunk(
  "part/updatePart",
  async (props, { rejectWithValue }) => {
    const { id, partId, data, callback } = props;
    try {
      const rawEndpoint = import.meta.env.VITE_UPDATE_PART_API || "/dealer/parts";
      const endpoint = rawEndpoint.replace("/:id", "").replace(":id", "");
      const targetId = partId || id || data?.partId || data?.id;
      const numId = !isNaN(Number(targetId)) ? Number(targetId) : targetId;
      const requestData = {
        partId: numId,
        ...(data || {}),
      };
      if (requestData.partId !== undefined && !isNaN(Number(requestData.partId))) {
        requestData.partId = Number(requestData.partId);
      }

      const response = await API_REQUEST({
        url: endpoint,
        method: "PATCH",
        data: requestData,
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

// Delete Part By ID
export const deletePart = createAsyncThunk(
  "part/deletePart",
  async (props, { rejectWithValue }) => {
    const { id, callback } = props;
    try {
      const endpoint = (
        import.meta.env.VITE_DELETE_PART_API || "/dealer/parts/:id"
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

// Get All Part Requests for Dealer
export const getDealerPartRequests = createAsyncThunk(
  "part/getDealerPartRequests",
  async (props = {}, { rejectWithValue }) => {
    const { status, page, limit, search, callback } = props;
    try {
      const params = {};
      if (status !== undefined && status !== 'all') params.status = status;
      if (page !== undefined) params.page = page;
      if (limit !== undefined) params.limit = limit;
      if (search) params.search = search;

      const response = await API_REQUEST({
        url: import.meta.env.VITE_GET_DEALER_PART_REQUESTS_API || "/dealer/part-requests",
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

// Complete Dealer Part Request By ID
export const completeDealerPartRequest = createAsyncThunk(
  "part/completeDealerPartRequest",
  async (props, { rejectWithValue }) => {
    const { id, data, callback } = props;
    try {
      const rawEndpoint =
        import.meta.env.VITE_COMPLETE_DEALER_PART_REQUEST_API ||
        "/dealer/part-requests/complete";
      const endpoint = rawEndpoint
        .replace("/:id/complete", "/complete")
        .replace("/:id", "")
        .replace(":id", "");
      const finalId = id || data?.id;
      const numId = !isNaN(Number(finalId)) ? Number(finalId) : finalId;
      const requestData = {
        id: numId,
        ...(data || {}),
      };
      if (requestData.id !== undefined && !isNaN(Number(requestData.id))) {
        requestData.id = Number(requestData.id);
      }

      const response = await API_REQUEST({
        url: endpoint,
        method: "PATCH",
        data: requestData,
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

