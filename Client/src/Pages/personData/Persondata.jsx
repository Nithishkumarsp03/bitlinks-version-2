import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import Persontab from "../../Components/Tabs/Persontab";
import "../../Styles/persondata.css";
import User from "../../Assets/user.jpg";
import { Outlet, useParams } from "react-router-dom";
import { Dialog, DialogActions, DialogTitle, Button, DialogContent,
  TextField,
  Typography, } from "@mui/material";
import History from "./History";
import Profile from "./Profile";
import CustomSnackbar from "../../Utils/snackbar/CustomsnackBar";
import { useNavigate } from "react-router-dom";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Input from "@mui/joy/Input";

export default function Persondata() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const api = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const role = decryptData(localStorage.getItem("role"));
  const [activeTab, setActiveTab] = useState("Profile");
  const [step, setStep] = useState(1); // 1 = initial, 2 = confirmation input
  const [confirmText, setConfirmText] = useState("");
  const [deleteopen, setDeleteopen] = useState(false);
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
          authorization: `Bearer ${decryptData(localStorage.getItem("token"))}`,
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

  const handleConfirmClick = () => {
    setStep(2); // Move to next step (input confirmation)
  };

  const handleFinalDelete = async() => {
    // console.log("Contact deleted", selectedPerson.person_id);
    try {
      const res = await fetch(`${api}/api/person/delete`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
          },
        body: JSON.stringify({id: selectedPerson.person_id})
      });

      const data = await res.json();
      if(!res.ok){
        showSnackbar(`HTTP error! status: ${res.status}`, 'error');
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      showSnackbar('Action done succesfully', 'success')
      if(role === 'admin') navigate('/admin');
      else if(role === 'user') navigate('/');
      else{}
    } catch (error) {
      console.error(error);
      showSnackbar('Something went wrong', 'error');
    }
  };

  const handleOpenDialog = (person) => {
    setSelectedPerson(person); // Store selected person details
    setActiondialog(true);
  };

  const handleDeleteClick = (person) => {
    setSelectedPerson(person);
    setDeleteopen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedPerson) return;

    try {
      const response = await fetch(`${api}/api/person/updatestatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({
          uuid: selectedPerson.uuid,
          status: selectedPerson.status === 1 ? 2 : 3, // Toggle status
        }),
      });

      if (!response.ok) {
        showSnackbar(`HTTP error! status: ${response.status}`, "error");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      showSnackbar("Status updation request submitted succesfully!", "success");

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
          <Persontab
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            uuid={uuid}
          />
        </div>
        {activeTab === "Profile" ? (
          <div
            className="profile-content"
            style={{ width: "100%", height: "90%" }}
          >
            <Profile />
          </div>
        ) : (
          <div className="tab-content" style={{ display: "flex" }}>
            <div className="left-data" style={{ padding: "0px 10px" }}>
              {persondata.map((person, index) => (
                <div
                  className="person-card"
                  key={index}
                  style={{ border: "2px solid #2867b2" }}
                >
                  <div
                    className="plus-icon"
                    onClick={() => handleAddConnection(person.email)}
                  >
                    <FaPlus />
                  </div>
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
                        <div>
                          {person.linkedinurl ? (
                            <a
                              href={
                                person.linkedinurl.startsWith("http")
                                  ? person.linkedinurl
                                  : `https://${person.linkedinurl}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Linkedin <i class="fa-solid fa-link"></i>
                            </a>
                          ) : (
                            "Not mentioned"
                          )}
                        </div>
                      </div>
                      <div>
                        <i className="fa-solid fa-envelope"></i>
                        <div>{person.email}</div>
                      </div>
                      <div>
                        <i className="fa-solid fa-user"></i>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                          }}
                        >
                          <span style={{ fontWeight: "600", color: "grey" }}>
                            Referred By
                          </span>
                          <div>{person.sub_name}</div>
                        </div>
                      </div>
                      <div className="profile-action-buttons">
                        <button
                          disabled={
                            !(person.status === 0 || person.status === 1)
                          }
                          onClick={() => handleOpenDialog(person)}
                        >
                          {person.status === 1
                            ? "Mark as Inactive"
                            : person.status === 0
                            ? "Mark as Active"
                            : "Request Sent"}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(person)}
                          style={{ backgroundColor: "red" }}
                        >
                          <MdDelete /> <div>Delete</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="outcome-data">{/* <div>Outcome:</div> */}</div>
            </div>
            <div
              className="middle-data"
              style={{
                flex: isFullWidth ? 1 : 2,
                display: isFullWidth ? "block" : "flex",
              }}
            >
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
          <Button
            variant="contained"
            color="error"
            onClick={() => setActiondialog(false)}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirmAction}>
            Yes, Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteopen} onClose={() => setDeleteopen(false)}>
        <DialogTitle>
          {step === 1
            ? "Are you sure you want to delete this contact?"
            : "Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          {step === 1 ? (
            <Typography>
              This action cannot be undone. This will permanently delete this
              contact.
            </Typography>
          ) : (
            <>
              <Typography color="error" gutterBottom>
                Please type <strong>"delete"</strong> to confirm.
              </Typography>
              <Input
                fullWidth
                variant="outlined"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type 'delete' here"
                autoFocus
                autoComplete="false"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={() => setDeleteopen(false)}
          >
            Cancel
          </Button>
          {step === 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmClick}
            >
              Yes, Confirm
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              onClick={handleFinalDelete}
              disabled={confirmText !== "delete"}
            >
              Delete Permanently
            </Button>
          )}
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
