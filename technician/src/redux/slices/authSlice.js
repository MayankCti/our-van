import authReducer, { logoutUser, setUser } from "../reducers/authReducer";
import {
  authLogin,
  authForgotPassword,
  authChangePassword,
  authGetProfile,
  authUpdateProfile,
} from "../actions/authAction";

export {
  authLogin,
  authForgotPassword,
  authChangePassword,
  authGetProfile,
  authUpdateProfile,
  logoutUser,
  setUser,
};
export default authReducer;
