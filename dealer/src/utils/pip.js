// Authorization
export const pipSetAccessToken = (token) => {
  if (!token) return;
  localStorage.setItem("ourvan-dealer-token", token);
};

export const pipGetAccessToken = () => {
  return localStorage.getItem("ourvan-dealer-token");
};

export const logout = () => {
  localStorage.removeItem("ourvan-dealer-token");
  localStorage.removeItem("ourvan-dealer-user");
};
