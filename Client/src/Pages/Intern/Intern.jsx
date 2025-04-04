import React, { useState, useEffect } from "react";
import Header from "../../Components/Header/Header";
import Tab from "../../Components/Tabs/Tab";
import "../../Styles/admin.css";
import Alumni from "./Alumni";
import CustomSnackbar from "../../Utils/snackbar/CustomsnackBar";
import { decryptData } from "../../Utils/crypto/cryptoHelper";

export default function Intern() {
  const [activeTab, setActiveTab] = useState("Alumni");
  const name = decryptData(localStorage.getItem("name"));
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const isLoggedIn = decryptData(localStorage.getItem("isLoggedIn"));
    if (isLoggedIn) {
      showSnackbar(`Welcome back ${name}!`, "success");
      decryptData(localStorage.removeItem("isLoggedIn"));
    }
  }, []); 

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className="header">
        <Header />
      </div>
      <div className="admin-body" style={{margin: "0", padding: "0"}}>
        <div className="tabs" style={{display: "none"}}>
          <Tab activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="tab-content" style={{height: "100%"}}>
          {activeTab === "IECC" ? (
            "IECC"
          ) : activeTab === "Alumni" ? (
            <Alumni />
          ) : activeTab === "Schools" ? (
            "Schools"
          ) : activeTab === "Students" ? (
            "Students"
          ) : activeTab === "Company" ? (
            "Company"
          ) : activeTab === "Startup" ? (
            "Startup"
          ) : activeTab === "Job" ? (
            "Job"
          ) : (
            "none"
          )}
        </div>
      </div>
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
}
