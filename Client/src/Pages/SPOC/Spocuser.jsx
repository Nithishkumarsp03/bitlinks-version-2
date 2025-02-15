import React, { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Leftside from "../Admin/Leftside";
import Spocremainder from "../../Components/Notification/Spocremainder";

export default function Spocuser() {
  const location = useLocation();
  const isAddConnectionsRoute = location.pathname.startsWith("/add-connection/");
  const isPojectRoute = location.pathname === "/projects";
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 800);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 800);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="iecc-body">
      <div className="left-side">
        {!isSmallScreen && <Leftside role={"user"}/>}
      </div>
      {isAddConnectionsRoute || isPojectRoute ? (
        <div className="full-width-outlet">
          <Outlet />
        </div>
      ) : (
        <>
          <div className="middle-side">
            <Outlet />
          </div>
          <div className="right-side">
            <Spocremainder />
          </div>
        </>
      )}
      {isSmallScreen && (
        <div className="floating-navbar">
          <button>Home</button>
          <button>Settings</button>
          <button>Profile</button>
        </div>
      )}
    </div>
  );
}
