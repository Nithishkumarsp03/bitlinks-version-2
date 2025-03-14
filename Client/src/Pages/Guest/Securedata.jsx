import React, { useState, useEffect } from "react";
import Header from "../../Components/Header/Header";
import { Input } from "@mui/joy";
import Select from "react-select";
import "../../Styles/securedata.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CustomSnackbar from "../../Utils/snackbar/CustomsnackBar";
import CompanyDropdown from "../../Dropdown/CompanyDropdown";
import RoleDropdown from "../../Dropdown/RoleDropdown";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import useStore from "../../store/store";

export default function Securedata() {
  const { setLogopen } = useStore();
  const api = process.env.REACT_APP_API;
  const name = decryptData(localStorage.getItem("name"));
  const [loading, setLoading] = useState(false);
  const [formValues, setformValues] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    linkedinurl: "",
    designation: "",
    companyname: null,
    role: null,
    dob: "",
    rating: "",
    hashtags: "",
    address: "",
    purpose: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [visitingCard, setVisitingCard] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState(null);
  const [open, setOpen] = useState(false);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handlecompanyChange = (newValue) => {
    setformValues((prev) => ({ ...prev, companyname: newValue }));
  };

  useEffect(() => {
    const isLoggedIn = decryptData(localStorage.getItem("isLoggedIn"));
    if (isLoggedIn) {
      showSnackbar(`Welcome back ${name}!`, "success");
      decryptData(localStorage.removeItem("isLoggedIn"));
    }
  }, []);

  const options = [
    { label: "Highly Recommended", value: "Highly Recommended" },
    { label: "Recommended", value: "Recommended" },
    { label: "Not Recommended", value: "Not Recommended" },
  ];

  const designation = [
    { label: "Industry", value: "Industry" },
    { label: "College", value: "College" },
    { label: "School", value: "School" },
    { label: "Student", value: "Student" },
    { label: "Company", value: "Company" },
    { label: "Startup", value: "Startup" },
    { label: "Job", value: "Job" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption, name) => {
    // console.log(selectedOption, name);
    setformValues((prevData) => ({
      ...prevData,
      [name]: selectedOption ? selectedOption.value : "", // Update value correctly
    }));
  };

  // Handle visiting card upload
  const handleVisitingCard = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVisitingCard(file);
      setPreviewUrl(url);
    }
  };

  // Handle remove visiting card image
  const handleRemoveImage = () => {
    setVisitingCard(null);
    setPreviewUrl(null);
  };

  // Handle profile photo upload
  const handleProfilePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfilePhoto(file);
      setProfilePreviewUrl(url);
    }
  };

  // Handle remove profile photo
  const handleRemoveProfilePhoto = () => {
    setProfilePhoto(null);
    setProfilePreviewUrl(null);
  };

  // Handle open/close modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClear = () => {
    setformValues({
      fullname: "",
      email: "",
      phonenumber: "",
      linkedinurl: "",
      designation: "",
      companyname: null,
      role: null,
      dob: "",
      rating: "",
      hashtags: "",
      address: "",
      purpose: "",
    });
    handleRemoveImage();
    handleRemoveProfilePhoto();
  };

  const handleSubmit = async (e) => {
    setLoading(true)
    if (!formValues.fullname) {
      showSnackbar("Please enter the name to proceed!", "error");
      setLoading(false);
      return;
    }
    e.preventDefault();
    let newProfilePath = null;
    let newVisitingCardPath = null;

    try {
      const formData = new FormData();
      if (profilePhoto) {
        formData.append("profileImage", profilePhoto); // Add profile photo if available
      }
      if (visitingCard) {
        formData.append("visitingcard", visitingCard); // Add visiting card photo if available
      }

      let filePaths = [];
      if (formData.has("profileImage") || formData.has("visitingcard")) {
        const uploadResponse = await fetch(`${api}/api/upload`, {
          method: "POST",
          body: formData,
        });

        if (uploadResponse.status == 401) {
          setLogopen(true);
          return;
        }

        if (!uploadResponse.ok) {
          showSnackbar("Photo upload Failed", "error");
          setLoading(false);
          throw new Error("Photo upload failed");
        }

        const uploadResult = await uploadResponse.json();
        // console.log(uploadResult);

        newProfilePath = uploadResult.profileImage;
        newVisitingCardPath = uploadResult.visitingcard;
      }

      const finalData = {
        ...formValues,
        name: name,
        profilePhoto: newProfilePath || "/uploads/1738045401481-user.jpg", // Use the first file path if available
        visitingCard: newVisitingCardPath || null, // Use the second file path if available
      };

      const jsonResponse = await fetch(`${api}/api/securehub/insertdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ finalData }), // Only send the necessary JSON data
      });

      if (jsonResponse.status == 401) {
        setLogopen(true);
        return;
      }

      if (!jsonResponse.ok) {
        showSnackbar("Data submission Failed", "error");
        setLoading(false);
        throw new Error("Data submission failed");
      }

      const result = await jsonResponse.json();
      handleClear();
      showSnackbar(
        "Data submitted Succesfully. You will receive a mail once it is approved!",
        "success"
      );
      setLoading(false);
    } catch (error) {
      showSnackbar(error.message, "error");
      setLoading(false)
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="secure-data-hub">
      <div className="header">
        <Header />
      </div>
      <div className="admin-body">
        <div className="secure-data-container">
          <div className="left-side-sections">
            {/* Profile Photo Upload */}
            <div className="profile-section">
              <div className="profile-left-container">
                {profilePreviewUrl ? (
                  <>
                    <img src={profilePreviewUrl} alt="Profile" />
                    <IconButton
                      onClick={handleRemoveProfilePhoto}
                      style={{
                        position: "absolute",
                        top: 27,
                        right: 25,
                        background: "rgba(0,0,0,0.6)",
                        color: "white",
                        zIndex: 2,
                      }}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <input
                      id="profile-photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePhoto}
                      style={{ display: "none" }}
                    />
                    <label htmlFor="profile-photo-upload">
                      <CloudUploadIcon fontSize="large" />
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Other input fields */}
            <div className="input-fields">
              <label>Name:</label>
              <Input
                placeholder="Ex: John Doe (with initial at back)"
                name="fullname"
                value={formValues.fullname}
                onChange={handleChange}
              />
            </div>
            <div className="input-fields">
              <label>Email:</label>
              <Input
                placeholder="user@gmail.com"
                value={formValues.email}
                name="email"
                onChange={handleChange}
              />
            </div>
            <div className="input-fields">
              <label>Phone:</label>
              <Input
                placeholder="+91 00000 00000"
                value={formValues.phonenumber}
                name="phonenumber"
                onChange={handleChange}
              />
            </div>
            <div className="input-fields">
              <label>LinkedIn URL:</label>
              <Input
                placeholder="https://www.linkedin.com/..."
                value={formValues.linkedinurl}
                name="linkedinurl"
                onChange={handleChange}
              />
            </div>
            <div className="input-fields">
              <label>Division:</label>
              <Select
                placeholder="Select division"
                value={
                  formValues.designation
                    ? {
                        value: formValues.designation,
                        label: formValues.designation,
                      }
                    : null
                }
                options={designation}
                name="designation"
                onChange={(option) => handleSelectChange(option, "designation")}
              />
            </div>

            {/* Visiting Card Upload */}
            <div className="input-fields">
              <label>Visiting Card</label>
              {visitingCard ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleRemoveImage}
                  >
                    Remove Image
                  </Button>
                  <VisibilityIcon
                    onClick={handleOpen}
                    style={{
                      cursor: "pointer",
                      fontSize: "30px",
                      color: "#1976d2",
                    }}
                  />
                </div>
              ) : (
                <>
                  <input
                    id="visiting-card-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleVisitingCard}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="visiting-card-upload">
                    <Button variant="contained" component="span">
                      Upload Card
                    </Button>
                  </label>
                </>
              )}
            </div>
          </div>

          <div className="right-side-sections">
            <div className="input-fields">
              <label>Date of Birth</label>
              <Input
                type="date"
                value={formValues.dob}
                name="dob"
                onChange={handleChange}
              />
            </div>
            <div className="input-fields">
              <label>Rating</label>
              <Select
                placeholder="Select rating"
                value={
                  formValues.rating
                    ? { value: formValues.rating, label: formValues.rating }
                    : null
                }
                options={options}
                name="rating"
                onChange={(option) => handleSelectChange(option, "rating")}
              />
            </div>
            <div className="input-fields">
              <label>CompanyName</label>
              <CompanyDropdown 
                onChange={handlecompanyChange}
                value={formValues.companyname}
              />
            </div>
            <div className="input-fields">
              <label>Role</label>
              <RoleDropdown
                onChange={(newValue) =>
                  setformValues({ ...formValues, role: newValue })
                }
                value={formValues.role}
              />
            </div>
            <div className="input-fields">
              <label>Hashtags</label>
              <Input
                placeholder="#companyname #influencer #bitsathy"
                value={formValues.hashtags}
                name="hashtags"
                onChange={handleChange}
              />
            </div>
            <div className="input-fields">
              <label>Address</label>
              <Input
                placeholder="1600 Pennsylvania Ave NW, Washington, DC 20500, USA. ..."
                value={formValues.address}
                name="address"
                onChange={handleChange}
              />
            </div>
            <div className="input-fields">
              <label>Purpose</label>
              <Input
                placeholder="Provide detailed description of the visit."
                value={formValues.purpose}
                name="purpose"
                onChange={handleChange}
              />
            </div>
            <div className="action-button-bottom">
              <Button variant="contained" color="inherit" onClick={handleClear}>
                Clear
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Please wait...": "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for visiting card preview */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Visiting Card</DialogTitle>
        <DialogContent>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Visiting Card"
              style={{ width: "100%" }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
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
