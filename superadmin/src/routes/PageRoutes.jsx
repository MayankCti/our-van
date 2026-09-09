import { lazy } from "react";
import Notifications from "../pages/auth/Notifications";
import EditProfile from "../pages/auth/EditProfile";
import ChangePassword from "../pages/auth/ChangePassword";
import FogotPassword from "../pages/auth/FogotPassword";
import DealerDetail from "../pages/dealer/DealerDetail";

const Vans = lazy(() => import("../pages/vans"));
const Owners = lazy(() => import("../pages/owners"));
const Dealer = lazy(() => import("../pages/dealer"));
const Login = lazy(() => import("../pages/auth/Login"));
const Dashboard = lazy(() => import("../pages/dashboard"));
const VanDetail = lazy(() => import("../pages/vans/VanDetail"));
const PageNotFound = lazy(() => import("../pages/PageNotFound"));
const OwnerDetail = lazy(() => import("../pages/owners/OwnerDetail"));
const ServiceProviders = lazy(() => import("../pages/service providers"));
const ComponentsLibrary = lazy(() => import("../pages/components library"));
const WarrantyProviders = lazy(() => import("../pages/warranty providers"));
const ServiceProviderDetail = lazy(() => import("../pages/service providers/ServiceProviderDetail"));
const WarrantyProviderDetail = lazy(() => import("../pages/warranty providers/WarrantyProviderDetail"));

// const Dealers = lazy(() => import("../pages/Dealers"));
// const CreateDealer = lazy(() => import("../pages/CreateDealer"));
// const Profile = lazy(() => import("../pages/Profile"));

export const pageRoutes = {
  login: "/login",
  fogotPassword: "/fogot-password",
  dashboard: "/",
  editProfile: "/edit-profile",
  notifications: "/notifications",
  changePassword: "/change-password",
  dealers: "/dealers",
  dealerDetail: "/dealer-detail",
  vans: "/vans",
  van_detail: "/van-detail",
  owners: "/owners",
  owner_detail: "/owner-detail",
  service_providers: "/service-providers",
  service_provider_detail: "/service-provider-detail",
  warranty_providers: "/warranty-providers",
  warranty_provider_detail: "/warranty-provider-detail",

  components_library: "/components-library",
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
    name: "Change Password",
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
    name: "Dealer",
    path: pageRoutes.dealers,
    element: <Dealer />,
    isPrivate: true,
  },
  {
    name: "Dealer Detail",
    path: pageRoutes.dealerDetail,
    element: <DealerDetail />,
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
    name: "Service Provider",
    path: pageRoutes.service_providers,
    element: <ServiceProviders />,
    isPrivate: true,
  },
  {
    name: "Service Provider Details",
    path: pageRoutes.service_provider_detail,
    element: <ServiceProviderDetail />,
    isPrivate: true,
  },

  {
    name: "Warranty Provider",
    path: pageRoutes.warranty_providers,
    element: <WarrantyProviders />,
    isPrivate: true,
  },
  {
    name: "Warranty Provider Details",
    path: pageRoutes.warranty_provider_detail,
    element: <WarrantyProviderDetail />,
    isPrivate: true,
  },

  {
    name: "Components Library",
    path: pageRoutes.components_library,
    element: <ComponentsLibrary />,
    isPrivate: true,
  },
  //   {
  //     name: "Create Dealer",
  //     path: pageRoutes.create_dealer,
  //     element: <CreateDealer />,
  //     isPrivate: true,
  //   },
  {
    name: "EditProfile",
    path: pageRoutes.editProfile,
    element: <EditProfile />,
    isPrivate: true,
  },
  {
    name: "Page Not Found",
    path: "*",
    element: <PageNotFound />,
    isPrivate: false,
  },
];