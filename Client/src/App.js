import React, { useEffect } from "react";
import RoutesController from "./Routes/Routes";
import { useNavigate } from "react-router-dom";
import { decryptData } from "./Utils/crypto/cryptoHelper";
import UnauthorizedDialog from "./Dialog/utilsDialog/Unauthorised";
import { useApi } from "./hooks/useApi";
import useStore from "./store/store";

function App() {
  const navigate = useNavigate();
  const { logopen } = useStore();
  const { api, UnauthorizedUI } = useApi();
  const role = decryptData(localStorage.getItem("role"));
  const token = decryptData(localStorage.getItem("token"));

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (role && token) {
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
  }, [role, token, navigate]);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <UnauthorizedDialog open={logopen} />
      <RoutesController />
    </div>
  );
}

export default App;
