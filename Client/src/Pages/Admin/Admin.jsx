import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import Tab from "../../Components/Tabs/Tab";
import "../../Styles/admin.css";
import Iecc from "../IECC/Iecc";
import CustomSnackbar from "../../Utils/snackbar/CustomsnackBar";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("IECC");
  const name = localStorage.getItem('name');
  const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "success",
    });

    const showSnackbar = (message, severity) => {
      setSnackbar({ open: true, message, severity });
    };

    useEffect(() => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn === "true") {
        showSnackbar(`Welcome back ${name}!`, "success");
        localStorage.removeItem("isLoggedIn");
      }
    }, []);    


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

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
}
