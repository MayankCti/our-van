// Authorization and Storage Helpers for Superadmin Panel
export const pipSetAccessToken = (token) => {
  if (!token) return;
  localStorage.setItem("ourvan-superadmin-token", token);
};

export const pipGetAccessToken = () => {
  return localStorage.getItem("ourvan-superadmin-token");
};

export const pipSaveProfile = (user) => {
  if (!user) return;
  localStorage.setItem("ourvan-superadmin-user", JSON.stringify(user));
};

export const pipSetUser = pipSaveProfile;

export const pipGetProfile = () => {
  try {
    const user = localStorage.getItem("ourvan-superadmin-user");
    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.error("Error parsing superadmin user data:", err);
    return null;
  }
};

export const pipGetUser = pipGetProfile;

export const logout = () => {
  localStorage.removeItem("ourvan-superadmin-token");
  localStorage.removeItem("ourvan-superadmin-user");
};