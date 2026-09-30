import axios from "axios";
import toast from "react-hot-toast";
import { pipGetAccessToken, logout } from "../utils/pip";
import { pageRoutes } from "../routes/PageRoutes";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Guard to prevent multiple simultaneous logout/redirect triggers and stacked toast messages
let isSessionExpiring = false;

export const API_REQUEST = async (props) => {
  const {
    url,
    method = "GET",
    data,
    headers,
    params,
    isErrorToast = true,
    isSuccessToast = true,
  } = props;
  const token = pipGetAccessToken();

  const requestOptions = {
    url: BASE_URL + url,
    method,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      ...headers,
    },
    params: method?.toUpperCase() === "GET" ? params : undefined,
    data: method?.toUpperCase() !== "GET" ? data : undefined,
  };

  try {
    const response = await axios(requestOptions);
    if (isSuccessToast) {
      if (
        method?.toUpperCase() !== "GET" &&
        (response?.data?.success === true || response?.data?.status === true)
      ) {
        toast.success(response?.data?.message || "Success");
      } else if (
        (response?.data?.success === false || response?.data?.status === false) &&
        method?.toUpperCase() !== "GET"
      ) {
        toast.error(response?.data?.message || "Something went wrong");
      }
    }
    return response?.data;
  } catch (error) {
    if (isErrorToast && !isSessionExpiring) {
      if (error.response) {
        const isAuthEndpoint = url?.includes("/login") || url?.includes("/forgot-password");
        const status =
          error?.response?.status ||
          error?.response?.data?.status ||
          error?.response?.data?.statusCode;
        const msg = String(error?.response?.data?.message || "").toLowerCase();

        const isUnauthorized =
          status === 401 ||
          status === 403 ||
          msg.includes("token expired") ||
          msg.includes("jwt expired") ||
          msg.includes("unauthorized") ||
          msg.includes("invalid token") ||
          msg.includes("session expired");

        if (isUnauthorized && !isAuthEndpoint) {
          if (!isSessionExpiring) {
            isSessionExpiring = true;
            toast.dismiss();
            toast.error(
              error?.response?.data?.message || "Token expired, please login again.",
              { id: "session-expired" }
            );
            logout();
            const loginPath = pageRoutes?.login || "/login";
            if (window.location.pathname !== loginPath) {
              window.location.href = loginPath;
            }
            setTimeout(() => {
              isSessionExpiring = false;
            }, 3000);
          }
        } else if (!isSessionExpiring) {
          toast.error(error?.response?.data?.message || "Something went wrong");
        }
      } else if (error.request) {
        toast.error("No response received from server");
      } else {
        toast.error(error?.message || "An unexpected error occurred");
      }
    }
    throw error?.response || error;
  }
};

export default API_REQUEST;
