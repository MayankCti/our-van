import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_REQUEST } from "../../services/api";

// auth-login
export const authLogin = createAsyncThunk("auth-login", async (props, { rejectWithValue }) => {
  const { payload, callback } = props;
  try {
    const response = await API_REQUEST({
      url: import.meta.env.VITE_LOGIN_API,
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
});

// auth-forgot-password
export const authForgotPassword = createAsyncThunk(
  "auth-forgot-password",
  async (props, { rejectWithValue }) => {
    const { payload, callback } = props;
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_FORGOT_PASSWORD_API,
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

// auth-change-password (PUT method)
export const authChangePassword = createAsyncThunk(
  "auth-change-password",
  async (props, { rejectWithValue }) => {
    const { payload, callback } = props;
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_CHANGE_PASSWORD_API,
        method: "PUT",
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

// auth-get-profile
export const authGetProfile = createAsyncThunk(
  "auth-get-profile",
  async (props = {}, { rejectWithValue }) => {
    const { callback } = props || {};
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_GET_PROFILE_API,
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
  },
  {
    condition: (props, { getState }) => {
      const { authReducer } = getState();
      if (authReducer?.isLoadingProfile) {
        return false;
      }
      return true;
    },
  }
);

// auth-update-profile (PUT method with multipart/form-data)
export const authUpdateProfile = createAsyncThunk(
  "auth-update-profile",
  async (props, { rejectWithValue }) => {
    const { payload, callback } = props;
    try {
      const response = await API_REQUEST({
        url: import.meta.env.VITE_UPDATE_PROFILE_API,
        method: "PUT",
        data: payload,
        headers: {
          "Content-Type": "multipart/form-data",
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
