import { Navigate } from "react-router-dom";
import { pipGetAccessToken } from "../utils/pip.js";
import { pageRoutes } from "../routes/PageRoutes";

const PrivateRoute = ({ children }) => {
  const isAuth = pipGetAccessToken();

  if (!isAuth) {
    return <Navigate to={pageRoutes.login} replace />;
  }

  return children;
};

export default PrivateRoute;
