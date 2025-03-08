import React from "react";
import { HiOutlineMenu } from "react-icons/hi";
import { Popover } from "@headlessui/react";
import "../../Styles/header.css";
import Logo from "../../Assets/bitlinks logo.svg";
import picture from "../../Assets/user.jpg";
import settings from "../../Assets/settings.svg";
import { useNavigate } from "react-router-dom";
import { decryptData } from "../../Utils/crypto/cryptoHelper";

export default function Header() {
  const navigate = useNavigate();
  const name = decryptData(localStorage.getItem("name"));
  const profile = decryptData(localStorage.getItem("picture"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSettings = () => {
    navigate('/settings');
  }

  return (
    <div className="header">
      <div className="logo-container">
        <img src={Logo} alt="BITLINKS" />
      </div>

      <div className="end-container">
        <div className="user-image">
          <img src={profile || picture} alt="User" />
        </div>
        <div className="user-details">
          <div className="user-name">{name}</div>
          <div className="logout" onClick={handleLogout}>Logout</div>
        </div>
        <hr />
        <div className="settings-container" onClick={handleSettings}>
          <img src={settings} alt="Settings" />
          <p>SETTINGS</p>
        </div>
      </div>

      {/* Hamburger & Popover Menu for Mobile */}
      <div className="pop-hover">
        <Popover className="relative md:hidden">
          <Popover.Button className="hamburger">
            <HiOutlineMenu size={30} />
          </Popover.Button>
          <Popover.Panel className="menu">
            <div className="user-image">
              <img src={profile || picture} alt="User" />
            </div>
            <div className="user-details">
              <div className="user-name">{name}</div>
              <div className="logout" onClick={handleLogout}>Logout</div>
            </div>
            <div className="settings-container" onClick={handleSettings}>
              <img src={settings} alt="Settings" />
              <p>SETTINGS</p>
            </div>
          </Popover.Panel>
        </Popover>
      </div>
    </div>
  );
}
