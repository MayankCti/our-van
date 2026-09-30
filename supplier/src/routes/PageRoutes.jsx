import { lazy } from "react";

const Login = lazy(() => import("../pages/auth/Login"));
const FogotPassword = lazy(() => import("../pages/auth/FogotPassword"));
const Dashboard = lazy(() => import("../pages/dashboard"));
const Maintenance = lazy(() => import("../pages/maintenance"));
const MaintenanceDetail = lazy(() => import("../pages/maintenance/MaintenanceDetail"));
const MyProfile = lazy(() => import("../pages/auth/MyProfile"));
const EditProfile = lazy(() => import("../pages/auth/EditProfile"));
const ChangePassword = lazy(() => import("../pages/auth/ChangePassword"));
const PageNotFound = lazy(() => import("../pages/PageNotFound"));

export const pageRoutes = {
  login: "/login",
  fogotPassword: "/fogot-password",
  forgotPassword: "/forgot-password",
  dashboard: "/",
  maintenance: "/maintenance",
  maintenance_detail: "/maintenance-detail",
  myProfile: "/my-profile",
  editProfile: "/edit-profile",
  changePassword: "/change-password",
};

export const AllRoutes = [
  {
    name: "Login",
    path: pageRoutes.login,
    element: <Login />,
    isPrivate: false,
  },
  {
    name: "FogotPassword",
    path: pageRoutes.fogotPassword,
    element: <FogotPassword />,
    isPrivate: false,
  },
  {
    name: "ForgotPasswordAlias",
    path: pageRoutes.forgotPassword,
    element: <FogotPassword />,
    isPrivate: false,
  },
  {
    name: "Dashboard",
    path: pageRoutes.dashboard,
    element: <Dashboard />,
    isPrivate: true,
  },
  {
    name: "Maintenance",
    path: pageRoutes.maintenance,
    element: <Maintenance />,
    isPrivate: true,
  },
  {
    name: "MaintenanceDetail",
    path: pageRoutes.maintenance_detail,
    element: <MaintenanceDetail />,
    isPrivate: true,
  },
  {
    name: "MyProfile",
    path: pageRoutes.myProfile,
    element: <MyProfile />,
    isPrivate: true,
  },
  {
    name: "EditProfile",
    path: pageRoutes.editProfile,
    element: <EditProfile />,
    isPrivate: true,
  },
  {
    name: "ChangePassword",
    path: pageRoutes.changePassword,
    element: <ChangePassword />,
    isPrivate: true,
  },
  {
    name: "Page Not Found",
    path: "*",
    element: <PageNotFound />,
    isPrivate: false,
  },
];
