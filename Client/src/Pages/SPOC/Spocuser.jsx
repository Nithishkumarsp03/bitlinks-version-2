import React, { useState, useEffect } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import Leftside from "../Admin/Leftside";
import Spocremainder from "../../Components/Notification/Spocremainder";
import { Home, Users, Folder, BellDot, CircleX } from "lucide-react";
import { decryptData } from "../../Utils/crypto/cryptoHelper";

export default function Spocuser() {
  const email = decryptData(localStorage.getItem("email"));
  const navigate = useNavigate();
  const location = useLocation();
  const isAddConnectionsRoute =
    location.pathname.startsWith("/add-connection/");
  const isPojectRoute = location.pathname === "/projects";
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 800);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 800);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getActiveClass = (path) =>
    location.pathname.startsWith(path) ? "active" : "";

  return (
    <div className="iecc-body">
      <div className="left-side">
        {!isSmallScreen && <Leftside role={"user"} />}
      </div>
      {isAddConnectionsRoute || isPojectRoute ? (
        <div className="full-width-outlet">
          <Outlet />
        </div>
      ) : (
        <>
          {isSmallScreen ? (
            <>
              <div className="middle-side">
                <Outlet />
              </div>
              {showRight && (
                <div className="right-side">
                  <Spocremainder />
                </div>
              )}
              <button
                className="floating-right-btn"
                onClick={() => setShowRight(!showRight)}
              >
                {showRight ? <CircleX size={20} /> : <BellDot size={20} />}
                {/* You can change the icon if desired.
                              For example, use FaTimes when open and FaBars when closed:
                              {showRight ? <FaTimes size={20} /> : <FaBars size={20} />} */}
              </button>
            </>
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
        </>
      )}
      {isSmallScreen && (
        <div className="floating-navbar">
          <button
            className={getActiveClass("/myconnections")}
            onClick={() => navigate("/myconnections")}
          >
            <Users size={20} />
            <span>Connections</span>
          </button>
          <button
            className={getActiveClass("/projects")}
            onClick={() => navigate("/projects")}
          >
            <Folder size={20} />
            <span>Projects</span>
          </button>
          <button
            className={getActiveClass("/add-connection/")}
            onClick={() => navigate(`/add-connection/${email}`)}
          >
            <Home size={20} />
            <span>Add Connections</span>
          </button>
        </div>
      )}
    </div>
  );
}
