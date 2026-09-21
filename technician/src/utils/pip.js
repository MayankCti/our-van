// Authorization and Storage Helpers for Technician Panel
export const pipSetAccessToken = (token) => {
  if (!token) return;
  localStorage.setItem("ourvan-technician-token", token);
};

export const pipGetAccessToken = () => {
  return localStorage.getItem("ourvan-technician-token");
};

export const pipSaveProfile = (user) => {
  if (!user) return;
  localStorage.setItem("ourvan-technician-user", JSON.stringify(user));
};

export const pipSetUser = pipSaveProfile;

export const pipGetProfile = () => {
  try {
    const user = localStorage.getItem("ourvan-technician-user");
    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.error("Error parsing user profile data:", err);
    return null;
  }
};

export const pipGetUser = pipGetProfile;

export const logout = () => {
  localStorage.removeItem("ourvan-technician-token");
  localStorage.removeItem("ourvan-technician-user");
};
