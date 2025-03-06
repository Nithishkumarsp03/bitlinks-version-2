import React, { useState, useEffect } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import Leftside from "../Admin/Leftside";
import Adminremainder from "../../Components/Notification/Adminremainder";
import { Home, Users, Network, Folder, UserPlus, Database, BellDot, CircleX } from "lucide-react";
import { decryptData } from "../../Utils/crypto/cryptoHelper";

export default function Iecc() {
  const email = decryptData(localStorage.getItem("email"));
  const location = useLocation();
  const navigate = useNavigate();
  
  const isAddConnectionsRoute = location.pathname.startsWith("/admin/add-connection/");
  const isPojectRoute = location.pathname === "/admin/projects";
  const isDatahub = location.pathname === "/admin/data-hub";
  
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 800);
  // State to toggle the right-side (History/Adminremainder) panel on smaller screens
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
        {!isSmallScreen && <Leftside role={"admin"} />}
      </div>
      {isAddConnectionsRoute || isPojectRoute || isDatahub ? (
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
                  <Adminremainder />
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
                <Adminremainder />
              </div>
            </>
          )}
        </>
      )}
      {isSmallScreen && (
        <div className="floating-navbar">
          <button
            className={getActiveClass("/admin/myconnections")}
            onClick={() => navigate("/admin/myconnections")}
          >
            <Users size={20} />
            <span>Connections</span>
          </button>
          <button
            className={getActiveClass("/admin/network")}
            onClick={() => navigate("/admin/network")}
          >
            <Network size={20} />
            <span>Networks</span>
          </button>
          <button
            className={getActiveClass("/admin/projects")}
            onClick={() => navigate("/admin/projects")}
          >
            <Folder size={20} />
            <span>Projects</span>
          </button>
          <button
            className={getActiveClass("/admin/spoc")}
            onClick={() => navigate("/admin/spoc")}
          >
            <UserPlus size={20} />
            <span>SPOC</span>
          </button>
          <button
            className={getActiveClass("/admin/data-hub")}
            onClick={() => navigate("/admin/data-hub")}
          >
            <Database size={20} />
            <span>Datahub</span>
          </button>
          <button
            className={getActiveClass("/admin/add-connection/")}
            onClick={() => navigate(`/admin/add-connection/${email}`)}
          >
            <Home size={20} />
            <span>Add Connections</span>
          </button>
        </div>
      )}
    </div>
  );
}
