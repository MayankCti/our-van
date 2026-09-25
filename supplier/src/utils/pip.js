// Authorization and Storage Helpers for Supplier Panel
export const pipSetAccessToken = (token) => {
  if (!token) return;
  localStorage.setItem("ourvan-supplier-token", token);
};

export const pipGetAccessToken = () => {
  return localStorage.getItem("ourvan-supplier-token");
};

export const pipSaveProfile = (user) => {
  if (!user) return;
  localStorage.setItem("ourvan-supplier-user", JSON.stringify(user));
};

export const pipSetUser = pipSaveProfile;

export const pipGetProfile = () => {
  try {
    const user = localStorage.getItem("ourvan-supplier-user");
    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.error("Error parsing user profile data:", err);
    return null;
  }
};

export const pipGetUser = pipGetProfile;

export const logout = () => {
  localStorage.removeItem("ourvan-supplier-token");
  localStorage.removeItem("ourvan-supplier-user");
};
