import { lazy } from "react";

const Login = lazy(() => import("../pages/auth/Login"));
const FogotPassword = lazy(() => import("../pages/auth/FogotPassword"));
const MyProfile = lazy(() => import("../pages/auth/MyProfile"));
const EditProfile = lazy(() => import("../pages/auth/EditProfile"));
const ChangePassword = lazy(() => import("../pages/auth/ChangePassword"));
const Notifications = lazy(() => import("../pages/auth/Notifications"));

const Vans = lazy(() => import("../pages/vans"));
const Owners = lazy(() => import("../pages/owners"));
const OwnerDetail = lazy(() => import("../pages/owners/OwnerDetail"));
const Technicians = lazy(() => import("../pages/technicians"));
const TechnicianDetail = lazy(() => import("../pages/technicians/TechnicianDetail"));
const Suppliers = lazy(() => import("../pages/suppliers"));
const SupplierDetail = lazy(() => import("../pages/suppliers/SupplierDetail"));
const Dashboard = lazy(() => import("../pages/dashboard"));
const VanDetail = lazy(() => import("../pages/vans/VanDetail"));
const PageNotFound = lazy(() => import("../pages/PageNotFound"));
const VehicleInformation = lazy(() => import("../pages/vans/VehicleInformation"));
const Parts = lazy(() => import("../pages/parts"));
const PartDetail = lazy(() => import("../pages/parts/PartDetail"));

export const pageRoutes = {
  login: "/login",
  fogotPassword: "/fogot-password",
  dashboard: "/",
  myProfile: "/my-profile",
  editProfile: "/edit-profile",
  notifications: "/notifications",
  changePassword: "/change-password",
  vans: "/vans",
  van_detail: "/van-detail",
  vehicle_information: "/vehicle-information",
  owners: "/owners",
  owner_detail: "/owner-detail",
  dealers: "/dealers",
  technicians: "/technicians",
  technician_detail: "/technician-detail",
  suppliers: "/suppliers",
  supplier_detail: "/supplier-detail",
  parts: "/parts",
  part_detail: "/part-detail",
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
    name: "Owner Detail",
    path: pageRoutes.owner_detail,
    element: <OwnerDetail />,
    isPrivate: true,
  },
  {
    name: "Technicians",
    path: pageRoutes.technicians,
    element: <Technicians />,
    isPrivate: true,
  },
  {
    name: "Technician Detail",
    path: pageRoutes.technician_detail,
    element: <TechnicianDetail />,
    isPrivate: true,
  },
  {
    name: "Suppliers",
    path: pageRoutes.suppliers,
    element: <Suppliers />,
    isPrivate: true,
  },
  {
    name: "Supplier Detail",
    path: pageRoutes.supplier_detail,
    element: <SupplierDetail />,
    isPrivate: true,
  },
  {
    name: "Parts",
    path: pageRoutes.parts,
    element: <Parts />,
    isPrivate: true,
  },
  {
    name: "Part Detail",
    path: pageRoutes.part_detail,
    element: <PartDetail />,
    isPrivate: true,
  },
  {
    name: "Dealers",
    path: pageRoutes.dealers,
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
