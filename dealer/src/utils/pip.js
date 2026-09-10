// Authorization and Storage Helpers for Dealer Panel
export const pipSetAccessToken = (token) => {
  if (!token) return;
  localStorage.setItem("ourvan-dealer-token", token);
};

export const pipGetAccessToken = () => {
  return localStorage.getItem("ourvan-dealer-token");
};

export const pipSaveProfile = (user) => {
  if (!user) return;
  localStorage.setItem("ourvan-dealer-user", JSON.stringify(user));
};

export const pipSetUser = pipSaveProfile;

export const pipGetProfile = () => {
  try {
    const user = localStorage.getItem("ourvan-dealer-user");
    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.error("Error parsing user profile data:", err);
    return null;
  }
};

export const pipGetUser = pipGetProfile;

export const logout = () => {
  localStorage.removeItem("ourvan-dealer-token");
  localStorage.removeItem("ourvan-dealer-user");
};

// Multi-step Van Creation Draft Helpers (Persists across page refresh)
export const pipSaveVanDraft = (data) => {
  if (!data) return;
  try {
    sessionStorage.setItem("ourvan-dealer-van-draft", JSON.stringify(data));
  } catch (err) {
    console.error("Error saving van draft to sessionStorage:", err);
  }
};

export const pipGetVanDraft = () => {
  try {
    const draft = sessionStorage.getItem("ourvan-dealer-van-draft");
    return draft ? JSON.parse(draft) : null;
  } catch (err) {
    console.error("Error retrieving van draft from sessionStorage:", err);
    return null;
  }
};

export const pipClearVanDraft = () => {
  try {
    sessionStorage.removeItem("ourvan-dealer-van-draft");
  } catch (err) {
    console.error("Error clearing van draft from sessionStorage:", err);
  }
};
