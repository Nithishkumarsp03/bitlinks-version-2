import React, { useState, useEffect } from "react";
import "../../Styles/header.css";
import Logo from "../../Assets/bitlinks logo.svg";
import picture from "../../Assets/user.jpg";
import settings from "../../Assets/settings.svg";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [isTablet, setIsTablet] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateScreenSize = () => {
      setIsTablet(window.innerWidth <= 768);
    };

    // Initialize screen size check
    updateScreenSize();

    // Add event listener
    window.addEventListener("resize", updateScreenSize);

    return () => {
      // Cleanup event listener
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () =>{
    localStorage.removeItem('role')
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('name')
    navigate('/login')
  }

  return (
    <div className="header">
      <div className="logo-container">
        <img src={Logo} alt="BITLINKS" />
      </div>

      {!isTablet ? (
        <div className="end-container">
          <div className="user-image">
            <img src={picture} alt="User" />
          </div>
          <div className="user-details">
            <div className="user-name">John Doe</div>
            <div className="logout" onClick={handleLogout}>Logout</div>
          </div>
          <hr />
          <div className="settings-container">
            <img src={settings} alt="Settings" />
            <p>SETTINGS</p>
          </div>
        </div>
      ) : (
        <>
          <div className="hamburger" onClick={toggleMenu}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
          {menuOpen && (
            <div className="menu">
              <div className="user-image">
                <img src={picture} alt="User" />
              </div>
              <div className="user-details">
                <div className="user-name">John Doe</div>
                <div className="logout" onClick={handleLogout}>Logout</div>
              </div>
              <div className="settings-container">
                <img src={settings} alt="Settings" />
                <p>SETTINGS</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
