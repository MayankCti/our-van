// Authorizationw
export const pipSetAccessToken = (token) => {
  if (!token) return;
  localStorage.setItem("ourvan-token", token);
};
export const pipGetAccessToken = () => {
  return localStorage.getItem("ourvan-token");
};

export const logout = () => {
  localStorage.removeItem("ourvan-token");
  localStorage.removeItem("ourvan-user");
};