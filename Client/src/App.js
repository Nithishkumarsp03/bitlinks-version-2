import React, { useEffect, useState } from "react";
import RoutesController from "./Routes/Routes";
import { useNavigate } from "react-router-dom";


function App() {


  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (role && token) {
      if (role === "user" && currentPath !== "/") {
        navigate("/myconnections");
      } else if (role === "admin" && !currentPath.startsWith("/admin")) {
        navigate("/admin/myconnections");
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
