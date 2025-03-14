import React, { useEffect, useState } from "react";
import RoutesController from "./Routes/Routes";
import { useNavigate } from "react-router-dom";
import { decryptData } from "./Utils/crypto/cryptoHelper";
import UnauthorizedDialog from "./Dialog/utilsDialog/Unauthorised";
import { useApi } from "./hooks/useApi";
import useStore from "./store/store";
import NoInternetPage from "./Components/offline/Offlinepage";

const OfflinePage = () => (
  <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
    <h1>No Internet Connection</h1>
    <p>Please check your connection and try again.</p>
  </div>
);

function App() {
  const navigate = useNavigate();
  const { logopen } = useStore();
  const { api, UnauthorizedUI } = useApi();
  const role = decryptData(localStorage.getItem("role"));
  const token = decryptData(localStorage.getItem("token"));

  const [isOnline, setIsOnline] = useState(true);

  // Function to check real internet connectivity
  const checkInternet = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("No internet");
      }

      setIsOnline(true);
    } catch (error) {
      setIsOnline(false);
    }
  };

  useEffect(() => {
    checkInternet(); // Initial check

    const interval = setInterval(checkInternet, 5000); // Check every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (role && token && isOnline) {
      if (role === "user" && !currentPath.startsWith("/")) {
        navigate("/myconnections");
      } else if (role === "admin" && !currentPath.startsWith("/admin")) {
        navigate("/admin/myconnections");
      } else if (
        role === "guest" &&
        !currentPath.startsWith("/secure-data-hub")
      ) {
        navigate("/secure-data-hub");
      }
    }
  }, [role, token, navigate, isOnline]);

  if (!isOnline) {
    return <NoInternetPage onRetry={() => navigate('/login')}/>;
  }

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <UnauthorizedDialog open={logopen} />
      <RoutesController />
    </div>
  );
}

export default App;
