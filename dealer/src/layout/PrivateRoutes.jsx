import { pipGetAccessToken } from "../utils/pip.js";
import { pageRoutes } from "../routes/PageRoutes";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const isAuth = pipGetAccessToken();

  if (!isAuth) {
    return (
      <Navigate to={pageRoutes.login} state={{ from: location }} replace />
    );
  }

  return children;
};

export default PrivateRoute;
