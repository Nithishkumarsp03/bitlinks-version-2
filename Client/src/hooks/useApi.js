import axios from "axios";
import { useState } from "react";
import UnauthorizedDialog from "../Dialog/utilsDialog/Unauthorised";

const apiUrl = axios.create({
  baseURL: process.env.REACT_APP_API,
});

// ✅ Attach interceptor **once** (outside `useApi` function)
apiUrl.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent("sessionExpired")); // Notify React components
    }
    return Promise.reject(error);
  }
);

export function useApi() {
  const [sessionExpired, setSessionExpired] = useState(false);

  // ✅ Listen for session expiration
  window.addEventListener("sessionExpired", () => setSessionExpired(true));

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login"; // Redirect to login page
  };

  return {
    apiUrl,
    UnauthorizedUI: <UnauthorizedDialog open={sessionExpired} onLogout={logout} />,
  };
}
