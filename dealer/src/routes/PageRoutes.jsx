import { lazy } from "react";

const Login = lazy(() => import("../pages/auth/Login"));
const FogotPassword = lazy(() => import("../pages/auth/FogotPassword"));
const EditProfile = lazy(() => import("../pages/auth/EditProfile"));
const ChangePassword = lazy(() => import("../pages/auth/ChangePassword"));
const Notifications = lazy(() => import("../pages/auth/Notifications"));

const Vans = lazy(() => import("../pages/vans"));
const Owners = lazy(() => import("../pages/owners"));
const Dashboard = lazy(() => import("../pages/dashboard"));
const VanDetail = lazy(() => import("../pages/vans/VanDetail"));
const PageNotFound = lazy(() => import("../pages/PageNotFound"));
const VehicleInformation = lazy(() => import("../pages/vans/VehicleInformation"));

export const pageRoutes = {
  login: "/login",
  fogotPassword: "/fogot-password",
  dashboard: "/",
  editProfile: "/edit-profile",
  notifications: "/notifications",
  changePassword: "/change-password",
  vans: "/vans",
  van_detail: "/van-detail",
  vehicle_information: "/vehicle-information",
  owners: "/owners",
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
    name: "Dashboard",
    path: pageRoutes.dashboard,
    element: <Dashboard />,
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
    name: "Notifications",
    path: pageRoutes.notifications,
    element: <Notifications />,
    isPrivate: true,
  },
  {
    name: "Vans",
    path: pageRoutes.vans,
    element: <Vans />,
    isPrivate: true,
  },
  {
    name: "Van Detail",
    path: pageRoutes.van_detail,
    element: <VanDetail />,
    isPrivate: true,
  },
  {
    name: "Vehicle Information",
    path: pageRoutes.vehicle_information,
    element: <VehicleInformation />,
    isPrivate: true,
  },
  {
    name: "Owners",
    path: pageRoutes.owners,
    element: <Owners />,
    isPrivate: true,
  },
  {
    name: "Page Not Found",
    path: "*",
    element: <PageNotFound />,
    isPrivate: false,
  },
];
