import React, { useState } from "react";
import Header from "../../Components/Header/Header";
import DataTable from "../../Components/Settings/Datatable";
import DeveloperContact from "../../Components/Settings/DeveloperContact";
import Report from "../../Components/Settings/Report";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import "../../Styles/settings.css";

const tabs = [
  { label: "Location", key: "location" },
  { label: "Company Name", key: "companyname" },
  { label: "Role", key: "role" },
  { label: "Skillset", key: "skillset" },
  { label: "Domain", key: "domain" },
  { label: "Login", key: "login" },
  { label: "Generate Report", key: "Generate Report" },
  { label: "Developer Contact", key: "developerContact" },
];

export default function Settings() {
  const role = decryptData(localStorage.getItem("role"));
  const [activeTab, setActiveTab] = useState(
    role === "user"
      ? "developerContact"
      : role === "guest"
      ? "developerContact"
      : role === "intern"
      ? "developerContact"
      : tabs[0].key
  );
  const [menuOpen, setMenuOpen] = useState(false); // Sidebar toggle for mobile

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div className="header">
        <Header />
      </div>

      {/* Sidebar Toggle Button for Mobile */}
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰ Menu
      </button>

      <div className="settings-body">
        {role === "admin" && (
          <div className={`sidebar ${menuOpen ? "open" : ""}`}>
            {tabs.map((tab) => (
              <div
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setMenuOpen(false); // Close menu after selection on mobile
                }}
                className={`tab-item ${activeTab === tab.key ? "active" : ""}`}
              >
                {tab.label}
              </div>
            ))}
          </div>
        )}

        <div className="content">
          {activeTab === "developerContact" ? (
            <DeveloperContact />
          ) : activeTab === "Generate Report" ? (<Report />) : (
            <DataTable tab={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
}
