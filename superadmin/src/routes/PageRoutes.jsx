import { lazy } from "react";
const Dealer = lazy(() => import("../pages/dealer"));
const Vans = lazy(() => import("../pages/vans"));
const VanDetail = lazy(() => import("../pages/vans/VanDetail.jsx"));

const Login = lazy(() => import("../pages/auth/Login"));
const Dashboard = lazy(() => import("../pages/dashboard"));
// const Dealers = lazy(() => import("../pages/Dealers"));
// const CreateDealer = lazy(() => import("../pages/CreateDealer"));
// const Profile = lazy(() => import("../pages/Profile"));
const PageNotFound = lazy(() => import("../pages/PageNotFound"));

export const pageRoutes = {
  login: "/login",
  dashboard: "/",
  dealers: "/dealers",
  vans: "/vans",
  van_detail: "/van-detail",
  owners: "/owners",
  service_providers: "/service-providers",
  warranty_providers: "/warranty-providers",
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
    name: "Dashboard",
    path: pageRoutes.dashboard,
    element: <Dashboard />,
    isPrivate: true,
  },
  {
    name: "Dealer",
    path: pageRoutes.dealers,
    element: <Dealer />,
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
  //   {
  //     name: "Create Dealer",
  //     path: pageRoutes.create_dealer,
  //     element: <CreateDealer />,
  //     isPrivate: true,
  //   },
  //   {
  //     name: "Profile",
  //     path: pageRoutes.profile,
  //     element: <Profile />,
  //     isPrivate: true,
  //   },
  {
    name: "Page Not Found",
    path: "*",
    element: <PageNotFound />,
    isPrivate: false,
  },
];