import React, { useEffect, useState } from "react";
import RoutesController from "./Routes/Routes";
import { useNavigate } from "react-router-dom";
import { decryptData } from "./Utils/crypto/cryptoHelper";


function App() {


  const navigate = useNavigate();
  const role = decryptData(localStorage.getItem("role"));
  const token = decryptData(localStorage.getItem("token"))

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (role && token) {
      if (role === "user" && !currentPath.startsWith("/")) {
        navigate("/myconnections");
      } else if (role === "admin" && !currentPath.startsWith("/admin")) {
        navigate("/admin/myconnections");
      } else if (role === "guest" && !currentPath.startsWith("/secure-data-hub")) {
        navigate("/secure-data-hub");
      }
    }
  }, [role, token, navigate]);  

  return (
      <div style={{ height: "100vh", width: "100vw" }}>
        <RoutesController />
      </div>
  );
}

export default App;
