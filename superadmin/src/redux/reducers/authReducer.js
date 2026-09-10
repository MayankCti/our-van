import { createSlice } from "@reduxjs/toolkit";
import {
  authLogin,
  authForgotPassword,
  authChangePassword,
  authGetProfile,
  authUpdateProfile,
} from "../actions/authAction";
import {
  pipSetAccessToken,
  pipSaveProfile,
  pipGetAccessToken,
  pipGetProfile,
  logout,
} from "../../utils/pip";

const initialState = {
  isLoading: false,
  token: pipGetAccessToken() || null,
  user: pipGetProfile() || null,
  isAuth: !!pipGetAccessToken(),
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      logout();
      state.user = null;
      state.token = null;
      state.isAuth = false;
      state.isLoading = false;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      pipSaveProfile(action.payload);
    },
  },
  extraReducers: (builder) => {
    // auth-login
    builder.addCase(authLogin.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(authLogin.fulfilled, (state, action) => {
      const data = action?.payload?.data || action?.payload;
      const token = data?.token;
      const user = data?.admin || data?.user || (typeof data === "object" && !data?.token ? data : null);

      if (token) pipSetAccessToken(token);
      if (user) pipSaveProfile(user);

      state.isLoading = false;
      state.token = token || state.token;
      state.user = user || state.user;
      state.isAuth = true;
      state.error = null;
    });
    builder.addCase(authLogin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error?.message;
    });

    // auth-forgot-password
    builder.addCase(authForgotPassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(authForgotPassword.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(authForgotPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error?.message;
    });

    // auth-change-password
    builder.addCase(authChangePassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(authChangePassword.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(authChangePassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error?.message;
    });

    // auth-get-profile
    builder.addCase(authGetProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(authGetProfile.fulfilled, (state, action) => {
      const user = action?.payload?.data || action?.payload?.admin || action?.payload?.user;
      if (user) {
        state.user = user;
        pipSaveProfile(user);
      }
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(authGetProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error?.message;
    });

    // auth-update-profile
    builder.addCase(authUpdateProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(authUpdateProfile.fulfilled, (state, action) => {
      const user = action?.payload?.data || action?.payload?.admin || action?.payload?.user;
      if (user) {
        state.user = user;
        pipSaveProfile(user);
      }
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(authUpdateProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error?.message;
    });
  },
});

export const { logoutUser, setUser } = authSlice.actions;
export default authSlice.reducer;

