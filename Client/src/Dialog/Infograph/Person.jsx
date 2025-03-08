import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
} from "@mui/material";
import { Input } from "@mui/joy";
import Select from "react-select";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useParams } from "react-router-dom";
import Spocdropdown from '../../Dropdown/Spocdropdown'
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import useStore from "../../store/store";
import "../../Styles/dialog.css";

export default function Person({ open, setPersonopen, setpersonCompletion, showSnackbar }) {
  const {setLogopen} = useStore();
  const api = process.env.REACT_APP_API;
  const { uuid } = useParams();
  const [formValues, setFormValues] = useState({
    firstname: "",
    phonenumber: "",
    age: "",
    email: "",
    linkedin: "",
    address: "",
    shortdescription: "",
    designation: null,
    dob: "",
    hashtags: "",
    rating: null,
    visitingcard: null,
    projectLeader: "",
    spoc: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [visitingCardPreview, setVisitingCardPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormValues({ ...formValues, [name]: selectedOption });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setFormValues((prev) => ({ ...prev, profileImageFile: file }));
    }
  };

  const handleVisitingCardUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormValues((prev) => ({ ...prev, visitingcard: file }));
      setVisitingCardPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formValues.firstname || !formValues.phonenumber || !formValues.email) {
      showSnackbar('Please provide fullname, phonenumber, email', 'error');
      return;
    }
  
    try {
      const uploadData = new FormData();
      let newProfilePath = profileImage; // Keep existing value
      let newVisitingCardPath = visitingCardPreview; // Keep existing value
  
      // ✅ Append profile image correctly if it's a new file
      if (formValues.profileImageFile instanceof File) {
        uploadData.append("profileImage", formValues.profileImageFile);
      }
  
      // ✅ Append visiting card correctly if it's a new file
      if (formValues.visitingcard instanceof File) {
        uploadData.append("visitingcard", formValues.visitingcard);
      }
  
      // ✅ Upload only if new files exist
      if (uploadData.has("profileImage") || uploadData.has("visitingcard")) {
        const uploadResponse = await fetch(`${api}/api/upload`, {
          method: "POST",
          body: uploadData,
        });

        if(uploadResponse.status == 401){
          setLogopen(true);
          return;
        }
  
        if (!uploadResponse.ok) {
          showSnackbar("Photo upload failed", 'success');
          throw new Error("Photo upload failed");
        }
  
        const uploadResult = await uploadResponse.json();
  
        newProfilePath = uploadResult.profileImage || newProfilePath;
        newVisitingCardPath = uploadResult.visitingcard || newVisitingCardPath;
      }
  
      // ✅ Remove base URL function (to prevent sending full URL)
      const removeBaseUrl = (url) =>
        url && typeof url === "string" ? url.replace(/^https?:\/\/[^/]+\/bitlinks/, "") : null;      
  
      // ✅ Final data payload ensuring existing images are retained
      const finalData = {
        ...formValues,
        completion: completion,
        uuid: uuid,
        designation: formValues.designation?.value || null,
        rating: formValues.rating?.value || null,
        profileImage:
          newProfilePath && !newProfilePath.startsWith("blob:")
            ? removeBaseUrl(newProfilePath)
            : formValues.profileImage, // Retain existing if not changed
        visitingcard:
          newVisitingCardPath && !newVisitingCardPath.startsWith("blob:")
            ? removeBaseUrl(newVisitingCardPath)
            : formValues.visitingcard, // Retain existing if not changed
      };
  
      // ✅ Send correct data to backend
      const jsonResponse = await fetch(`${api}/api/infograph/update/person`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({finalData}),
      });

      if(jsonResponse.status == 401){
        setLogopen(true);
        return;
      }
  
      if (!jsonResponse.ok) {
        showSnackbar('Data submission failed', 'error');
        throw new Error("Data submission failed");
      }
  
      showSnackbar('Contact info updated Succesfully!', 'success');
      setPersonopen(false);
    } catch (error) {
      showSnackbar(error.message, 'error');
      console.error("Error:", error.message);
    }
  };  

  const calculateProgress = () => {
    const totalFields = Object.keys(formValues).length + 1; // Including profile image
    let filledFields = Object.values(formValues).filter((value) => {
      if (value === null) return false;
      if (typeof value === "string") return value.trim() !== "";
      return true;
    }).length;

    if (profileImage) filledFields++; // Now valid because filledFields is a 'let'

    return (filledFields / totalFields) * 100;
  };

  setpersonCompletion(calculateProgress())

  const completion = calculateProgress()

  const fetchPerson = async () => {
    try {
      const res = await fetch(`${api}/api/infograph/fetch/person`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ uuid: uuid }),
      });

      if(res.status == 401){
        setLogopen(true);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        showSnackbar(data.message, 'error');
        throw new Error(data.message);
      }

      if (data.person.length > 0) {
        const personData = data.person[0]; // Get the first object from the array

        setFormValues({
          firstname: personData.fullname || "",
          phonenumber: personData.phonenumber || "",
          age: personData.age || "",
          email: personData.email || "",
          linkedin: personData.linkedinurl || "",
          address: personData.address || "",
          shortdescription: personData.shortdescription || "",
          designation: personData.designation
            ? { label: personData.designation, value: personData.designation }
            : null,
          dob: personData.dob || "",
          hashtags: personData.hashtags || "",
          rating: personData.rating
            ? { label: personData.rating, value: personData.rating }
            : null,
          visitingcard: personData.visitingcard || null,
          projectLeader: personData.projectLeader || null,
          spoc: personData.spoc || null,
        });

        if (personData.profile) {
          setProfileImage(`${api}${personData.profile}`);
        }

        if (personData.visitingcard) {
          setVisitingCardPreview(`${api}${personData.visitingcard}`);
        }
      }
    } catch (error) {
      showSnackbar(error, 'error');
      console.error("Error fetching person data:", error);
    }
  };

  useEffect(() => {
    fetchPerson();
  }, []);

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => setPersonopen(false)}
        maxWidth="sm"
        fullWidth
      >
        <LinearProgress
          className="dialog-progress-bar"
          variant="determinate"
          value={calculateProgress()}
          sx={{ height: 10 }}
        />
        <DialogTitle className="dialog-title">Personal Information</DialogTitle>
        <DialogContent>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="input-group">
              <div>
                <label>First Name</label>
                <Input
                  name="firstname"
                  placeholder="First Name"
                  value={formValues.firstname}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </div>
            </div>
            <div className="profile-image-section">
              <label htmlFor="profile-upload" className="profile-upload-label">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile Preview"
                    className="profile-preview"
                  />
                ) : (
                  <div className="profile-placeholder">Upload Photo</div>
                )}
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="profile-upload-input"
              />
            </div>
          </div>
          <div className="input-group">
            <div>
              <label>Phone Number</label>
              <Input
                name="phonenumber"
                placeholder="Phone Number"
                value={formValues.phonenumber}
                onChange={handleChange}
                fullWidth
              />
            </div>
            <div>
              <label>Age</label>
              <Input
                name="age"
                placeholder="Age"
                type="number"
                value={formValues.age}
                onChange={handleChange}
                fullWidth
              />
            </div>
          </div>
          <div className="input-group">
            <div>
              <label>Email</label>
              <Input
                name="email"
                placeholder="Email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                fullWidth
              />
            </div>
            <div>
              <label>LinkedIn URL</label>
              <Input
                name="linkedin"
                placeholder="LinkedIn URL"
                value={formValues.linkedin}
                onChange={handleChange}
                fullWidth
              />
            </div>
          </div>
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <label>Designation</label>
            <Select
              value={formValues.designation}
              onChange={(option) => handleSelectChange("designation", option)}
              options={[{ label: "College", value: "College" }]} // Example options
            />
          </div>
          <div style={{ marginTop: "15px" }}>
            <label>Address</label>
            <Input
              name="address"
              placeholder="Address"
              value={formValues.address}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              className="address-input"
            />
          </div>
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <label htmlFor="">Rating</label>
            <Select
              value={formValues.rating}
              onChange={(option) => handleSelectChange("rating", option)}
              options={[{ label: "Recommended", value: "Recommended" }]} // Example options
            />
          </div>
          <div className="input-group">
            <div>
              <label>Date of Birth</label>
              <Input
                type="date"
                name="dob"
                value={formValues.dob}
                onChange={handleChange}
                fullWidth
              />
            </div>
          </div>
          <div style={{ marginTop: "15px" }}>
            <label>Visiting Card</label>
            <div className="visiting-card-upload">
              <label htmlFor="visiting-card-upload" className="upload-label">
                <CloudUploadOutlinedIcon fontSize="large" />
                <span>Upload Visiting Card</span>
              </label>
              {visitingCardPreview && (
                <div className="remove-button">
                  <button
                    onClick={() => {
                      setVisitingCardPreview(null);
                      setFormValues((prev) => ({ ...prev, visitingcard: null }));
                    }}
                  >
                    <DeleteOutlineOutlinedIcon />
                    Remove
                  </button>
                </div>
              )}
              <input
                id="visiting-card-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleVisitingCardUpload}
              />
            </div>
            {visitingCardPreview && (
              <div className="visiting-card-preview">
                <img
                  src={visitingCardPreview}
                  alt="Visiting Card Preview"
                  className="visiting-card-image"
                />
              </div>
            )}
          </div>
          <div style={{ marginTop: "15px" }}>
            <label>Short Description</label>
            <Input
              name="shortdescription"
              placeholder="Short Description"
              value={formValues.shortdescription}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              className="description-input"
            />
          </div>
          <div style={{ marginTop: "15px" }}>
            <label>Hashtags</label>
            <Input
              name="hashtags"
              placeholder="Hashtags"
              value={formValues.hashtags}
              onChange={handleChange}
              fullWidth
              className="description-input"
            />
          </div>
          {formValues.spoc === "no" && (
            <div style={{ marginTop: "15px" }}>
            <label>Spoc</label>
            <Spocdropdown formValues={formValues} setFormValues={setFormValues}/>
          </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPersonopen(false)} color="secondary">
            Discard
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
