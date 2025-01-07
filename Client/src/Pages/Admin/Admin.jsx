import React, { useState } from "react";
import Header from "../../Components/Header/Header";
import Tab from "../../Components/Tabs/Tab";
import "../../Styles/admin.css";
import Iecc from "../IECC/Iecc";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("IECC");

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className="header">
        <Header />
      </div>
      <div className="admin-body">
        <div className="tabs">
          <Tab activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="tab-content">
          {activeTab === "IECC"
            ? <Iecc />
            : activeTab === "Colleges"
            ? "Colleges"
            : activeTab === "Schools"
            ? "Schools"
            : activeTab === "Students"
            ? "Students"
            : activeTab === "Company"
            ? "Company"
            : activeTab === "Startup"
            ? "Startup"
            : activeTab === "Job"
            ? "Job"
            : "none"}
        </div>
      </div>
    </div>
  );
}
