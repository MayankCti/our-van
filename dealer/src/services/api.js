import axios from "axios";
import toast from "react-hot-toast";
import { pipGetAccessToken, logout } from "../utils/pip";
import { pageRoutes } from "../routes/PageRoutes";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

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
      if (method?.toUpperCase() !== "GET" && (response?.data?.success === true || response?.data?.status === true)) {
        toast.success(response?.data?.message || "Success");
      } else if ((response?.data?.success === false || response?.data?.status === false) && method?.toUpperCase() !== "GET") {
        toast.error(response?.data?.message || "Something went wrong");
      }
    }
    return response?.data;
  } catch (error) {
    if (isErrorToast) {
      if (error.response) {
        const isAuthEndpoint = url?.includes("/login") || url?.includes("/forgot-password");
        const isUnauthorized =
          error?.response?.status === 403 ||
          error?.response?.data?.status === 403 ||
          error?.response?.data?.statusCode === 403;

        if (isUnauthorized && !isAuthEndpoint) {
          toast.error(error?.response?.data?.message || "Session expired. Please login again.");
          logout();
          window.location.href = pageRoutes?.login;
        } else {
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
