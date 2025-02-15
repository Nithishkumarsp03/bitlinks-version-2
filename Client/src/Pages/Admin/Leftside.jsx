import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Leftside({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const email = localStorage.getItem('email')
  const [active, setActive] = useState("myconnections");

  useEffect(() => {
    if (location.pathname === "/admin/projects" || location.pathname === "/projects") {
      setActive("projects");
    } else if (location.pathname.startsWith("/admin/add-connection/") || location.pathname.startsWith("/add-connection/")) {
      setActive("addConnection");
    } else if (location.pathname === "/admin/network") {
      setActive("networks");
    } else if (location.pathname === "/admin/spoc") {
      setActive("spoc");
    } else if (location.pathname === "/admin/data-hub") {
      setActive("merge");
    }
    else{
      setActive("myconnections")
    }
  }, [location.pathname]);

  const handleActive = (navbar) => {
    setActive(navbar);
  };

  const routes = {
    admin: {
      myconnections: "/admin/myconnections",
      networks: "/admin/network",
      projects: "/admin/projects",
      spoc: "/admin/spoc",
      merge: "/admin/data-hub",
      addConnection: `/admin/add-connection/${email}`,
    },
    user: {
      myconnections: "/myconnections",
      projects: "/projects",
      addConnection: `/add-connection/${email}`,
    },
  };

  const buttons = {
    admin: [
      { name: "My connections", key: "myconnections" },
      { name: "Networks", key: "networks" },
      { name: "Projects", key: "projects" },
      { name: "SPOC", key: "spoc" },
      { name: "Data Hub", key: "merge" },
      { name: "Add connections", key: "addConnection" },
    ],
    user: [
      { name: "My connections", key: "myconnections" },
      { name: "Projects", key: "projects" },
      { name: "Add connections", key: "addConnection" }, 
    ],
  };

  return (
    <div style={{ height: "100%", width: "100%", paddingTop: "5px" }}>
      <div className="navigation-buttons">
        {buttons[role]?.map((button) => (
          <div
            key={button.key}
            onClick={() => {
              navigate(routes[role][button.key]);
              handleActive(button.key);
            }}
            className={`buttons-myconnection ${active === button.key ? "open" : ""}`}
          >
            {button.name}
          </div>
        ))}
      </div>
    </div>
  );
}
