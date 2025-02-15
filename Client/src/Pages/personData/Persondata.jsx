import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import Persontab from "../../Components/Tabs/Persontab";
import "../../Styles/persondata.css";
import User from "../../Assets/user.jpg";
import { Outlet, useParams } from "react-router-dom";
import { Dialog, DialogActions, DialogTitle, Button } from "@mui/material";
import History from "./History";
import Profile from "./Profile";
import CustomSnackbar from "../../Utils/snackbar/CustomsnackBar";
import { useNavigate } from "react-router-dom";

export default function Persondata() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const api = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [activeTab, setActiveTab] = useState("Profile");
  const [actionDialog, setActiondialog] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [persondata, setPersondata] = useState([]);
  const { uuid } = useParams();

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const isFullWidth = activeTab === "M.O.M";

  const fetchData = async () => {
    try {
      const res = await fetch(`${api}/api/person/fetchdata/uuid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ uuid: uuid }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (Array.isArray(data.data)) {
        setPersondata(data.data); // Update state with the array
      } else {
        setPersondata([]); // Fallback if data is not an array
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddConnection = (email) => {
    if (role === "admin") {
      navigate(`/admin/add-connection/${email}`);
    } else if (role === "user") {
      navigate(`/add-connection/${email}`);
    }
  };

  const handleOpenDialog = (person) => {
    setSelectedPerson(person); // Store selected person details
    setActiondialog(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedPerson) return;

    try {
      const response = await fetch(`${api}/api/person/updatestatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          uuid: selectedPerson.uuid,
          status: selectedPerson.status === 1 ? 2 : 3, // Toggle status
        }),
      });

      if (!response.ok) {
        showSnackbar(`HTTP error! status: ${response.status}`, 'error')
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      showSnackbar('Status updation request submitted succesfully!', 'success')

      fetchData();
    } catch (error) {
      showSnackbar("Error updating status", "error");
      console.error("Error updating status:", error);
    }

    setActiondialog(false);
    setSelectedPerson(null);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className="header">
        <Header />
      </div>
      <div className="admin-body">
        <div className="tabs">
          <Persontab activeTab={activeTab} setActiveTab={setActiveTab} uuid={uuid} />
        </div>
        {activeTab === "Profile" ? (
          <div className="profile-content" style={{ width: "100%", height: "90%" }}>
            <Profile />
          </div>
        ) : (
          <div className="tab-content" style={{ display: "flex" }}>
            <div className="left-data" style={{ padding: "0px 10px" }}>
              {persondata.map((person, index) => (
                <div className="person-card" key={index} style={{ border: "2px solid #2867b2" }}>
                  <div className="image-details">
                    <br />
                    <div className="profile-container">
                      <img src={User} alt="Profile" />
                      <img className="small-image" src="" alt="Small Image" />
                    </div>
                    <div className="details-container">
                      <div className="name">{person.fullname}</div>
                      <div className="role">{person.role || null}</div>
                    </div>
                  </div>
                  <div className="person-info">
                    <div className="card-links">
                      <div>
                        <i className="fa-solid fa-phone"></i>
                        <div>{person.phonenumber}</div>
                      </div>
                      <div>
                        <i className="fa-brands fa-linkedin"></i>
                        <div>{person.linkedinurl || "Not Mentioned"}</div>
                      </div>
                      <div>
                        <i className="fa-solid fa-envelope"></i>
                        <div>{person.email}</div>
                      </div>
                      <div>
                        <i className="fa-solid fa-user"></i>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                          <span style={{ fontWeight: "600", color: "grey" }}>Referred By</span>
                          <div>{person.sub_name}</div>
                        </div>
                      </div>
                      <div className="profile-action-buttons">
                        <button onClick={() => handleAddConnection(person.email)}>Add connections</button>
                        <button
                          disabled={!(person.status === 0 || person.status === 1)}
                          onClick={() => handleOpenDialog(person)}
                        >
                          {person.status === 1 ? "Mark as Inactive" : person.status === 0 ? "Mark as Active" : "Request Sent"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="outcome-data">{/* <div>Outcome:</div> */}</div>
            </div>
            <div className="middle-data" style={{ flex: isFullWidth ? 1 : 2, display: isFullWidth ? "block" : "flex" }}>
              <Outlet />
            </div>
            {!isFullWidth && (
              <div className="right-data">
                <History />
              </div>
            )}
          </div>
        )}
      </div>
      <Dialog open={actionDialog} onClose={() => setActiondialog(false)}>
        <DialogTitle>
          Are you sure you want to mark this contact as{" "}
          {selectedPerson?.status === 1 ? "Inactive" : "Active"}?
        </DialogTitle>
        <DialogActions>
          <Button variant="contained" color="error" onClick={() => setActiondialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirmAction}>
            Yes, Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
}
