import React from "react";
import { useNavigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";

export default function Leftside({Outlet}) {
  const navigate = useNavigate();

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div className="navigation-buttons">
        <div onClick={() => navigate("/admin/myconnections")}>My connections</div>
        <div onClick={() => navigate("/admin/network")}>Networks</div>
        <div onClick={() => navigate("/admin/projects")}>Projects</div>
        <div onClick={() => navigate("/admin/spoc")}>SPOC</div>
        <div onClick={() => navigate("/admin/add-connection")}>Add connections</div>
      </div>
    </div>
  );
}
