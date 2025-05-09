import React, { useState } from "react";
import { Stepper, Step, StepLabel, Box as MuiBox } from "@mui/material";
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  Option,
  Typography,
  IconButton,
} from "@mui/joy";
import Select from "react-select";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import AddressDropdown from "../../../Dropdown/AddressDropdown";
import Domaindropdown from "../../../Dropdown/Domaindropdown";
import CompanyDropdown from "../../../Dropdown/CompanyDropdown";
import RoleDropdown from "../../../Dropdown/RoleDropdown";
import SkillsetDropdown from "../../../Dropdown/SkillsetDropdown";
import { decryptData } from "../../../Utils/crypto/cryptoHelper";
import CustomSnackbar from "../../../Utils/snackbar/CustomsnackBar";
import useStore from "../../../store/store";
import { useNavigate, useParams } from "react-router-dom";

const steps = [
  "Personal Info",
  "Professional Info",
  "Additional Info",
  "Spouse Details",
];

function ImageUpload({ preview, onFileSelect, onDelete }) {
  return (
    <MuiBox
      sx={{
        width: 120,
        height: 120,
        borderRadius: "50%",
        border: "2px dashed gray",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        cursor: "pointer",
        "&:hover .delete-icon": {
          display: "flex",
        },
      }}
      onClick={() => {
        if (!preview) {
          document.getElementById("profile-photo-input").click();
        }
      }}
    >
      {preview ? (
        <img
          src={preview}
          alt="Profile Preview"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <PhotoCameraIcon sx={{ fontSize: 40, color: "gray" }} />
      )}
      {preview && (
        <IconButton
          className="delete-icon"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          sx={{
            position: "absolute",
            top: 35,
            right: 40,
            backgroundColor: "rgba(63, 63, 63, 0.7)",
            display: "none",
          }}
        >
          <DeleteIcon fontSize="small" sx={{ color: "red" }} />
        </IconButton>
      )}
      <input
        id="profile-photo-input"
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => onFileSelect(e.target.files[0])}
      />
    </MuiBox>
  );
}

export default function AlumniForm() {
  const { email } = useParams();
  const { setLogopen } = useStore();
  const [activeStep, setActiveStep] = useState(0);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [visitingCardPreview, setVisitingCardPreview] = useState(null);
  const [profile, setProfile] = useState(null);
  const [visiting, setVisiting] = useState(null);
  const api = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const ratings = [
    { label: "Highly Recommended", value: "Highly Recommended" },
    { label: "Recommended", value: "Recommended" },
    { label: "Not Recommended", value: "Not Recommended" },
  ];
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };
  const [formData, setFormData] = useState({
    personalInfo: {
      useremail: email,
      name: "",
      email: "",
      role: null,
      address: "",
      shortDescription: "",
      age: "",
      dob: "",
      phone: "",
      profilePhoto: "",
    },
    professionalInfo: {
      domain: null,
      skillset: null,
      company: "",
      experience: "",
      location: null,
      visitingCard: "",
    },
    additionalInfo: {
      website: "",
      batch: "",
      graduatedYear: "",
      linkedin: "",
      rating: "",
      hashtags: "",
    },
    spouse: {
      name: "",
      occupation: "",
      company: "",
      phone: "",
      dob: "",
      email: "",
    },
  });

  const handleSubmit = async (e) => {
    if (
      !formData.personalInfo.name ||
      !formData.personalInfo.phone ||
      !formData.personalInfo.email
    ) {
      showSnackbar("Please provide Name, Email & Phone", "error");
      return;
    }

    if (formData.personalInfo.shortDescription) {
      // First check character length against database limits
      if (formData.personalInfo.shortDescription.length > 255) {
        // Adjust this number based on your DB column size
        showSnackbar(
          "Description exceeds the maximum character limit. Please shorten your text.",
          "error"
        );
        return;
      }

      // Also keep your word count validation if needed
      const wordCount = formData.personalInfo.shortDescription
        .trim()
        .split(/\s+/).length;
      if (wordCount > 250) {
        showSnackbar(
          "Description exceeds the 250-word limit. Please shorten your text.",
          "error"
        );
        return;
      }
    }

    e.preventDefault();

    try {
      // Step 1: Upload photos if available
      const fileUploadData = new FormData();
      if (profile) fileUploadData.append("profileImage", profile);
      if (visiting) fileUploadData.append("visitingcard", visiting);

      let filePaths = {};
      if (
        fileUploadData.has("profileImage") ||
        fileUploadData.has("visitingcard")
      ) {
        const uploadResponse = await fetch(`${api}/api/upload`, {
          method: "POST",
          body: fileUploadData,
        });

        if (uploadResponse.status === 401) {
          setLogopen(true);
          return;
        }

        if (!uploadResponse.ok) {
          showSnackbar("Photo upload failed", "error");
          throw new Error("Photo upload failed");
        }

        const uploadResponseText = await uploadResponse.text();
        // console.log("Raw Upload Response:", uploadResponseText);

        filePaths = JSON.parse(uploadResponseText) || {};
      }

      // console.log("File Paths Before Assigning:", filePaths);

      // Step 2: Send final data
      const finalData = {
        ...formData,
        personalInfo: {
          ...formData.personalInfo,
          profilePhoto: filePaths.profileImage,
        },
        professionalInfo: {
          ...formData.professionalInfo,
          visitingCard: filePaths.visitingcard,
        },
      };

      const res = await fetch(`${api}/api/add/alumni`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ finalData }),
      });

      const data = await res.json();

      if (res.status === 401) {
        setLogopen(true);
        return;
      }

      if (!res.ok) {
        showSnackbar(data.error, "error");
        throw new Error(data.error);
      }

      // Show success message with countdown
      showSnackbar(
        "Data submitted successfully! Redirecting in 3...",
        "success"
      );

      // Start countdown and redirect
      let countdown = 3;
      const redirectTimer = setInterval(() => {
        countdown--;

        if (countdown > 0) {
          // Update message with new countdown number
          showSnackbar(
            `Data submitted successfully! Redirecting in ${countdown}...`,
            "success"
          );
        } else {
          // Clear the interval and redirect when countdown reaches 0
          clearInterval(redirectTimer);
          navigate("/alumni/myconnections");
        }
      }, 1000);
    } catch (error) {
      showSnackbar(error.message, "warning");
      console.error("Error:", error.message);
    }
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const generateBatchYears = (startYear) => {
    const currentYear = new Date().getFullYear();
    let batchYears = [];

    for (let year = startYear; year <= currentYear; year++) {
      batchYears.push({
        value: `${year}-${year + 4}`,
        label: `${year}-${year + 4}`,
      });
    }

    return batchYears;
  };

  const generateGraduatedYears = (startYear) => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - startYear + 1 }, (_, i) => {
      const year = startYear + i;
      return { value: year, label: year.toString() };
    });
  };

  // Generate values from 1995
  const batchYears = generateBatchYears(1995);
  const graduatedYears = generateGraduatedYears(1995);

  const handleProfilePhotoChange = (file) => {
    handleChange("personalInfo", "profilePhoto", file);
    if (file) {
      setProfile(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleProfilePhotoDelete = () => {
    handleChange("personalInfo", "profilePhoto", null);
    setProfilePhotoPreview(null);
    setProfile(null);
  };

  const handleVisitingCardChange = (e) => {
    const file = e.target.files[0];
    handleChange("professionalInfo", "visitingCard", file);
    if (file) {
      setVisitingCardPreview(URL.createObjectURL(file));
      setVisiting(file);
    }
  };

  const handleVisitingCardDelete = () => {
    handleChange("professionalInfo", "visitingCard", null);
    setVisitingCardPreview(null);
    setVisiting(null);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <MuiBox sx={{ p: 3 }}>
            <Typography level="h6" textAlign="center" mb={2}>
              Personal Information
            </Typography>
            <MuiBox sx={{ mb: 2 }}>
              <ImageUpload
                preview={profilePhotoPreview}
                onFileSelect={handleProfilePhotoChange}
                onDelete={handleProfilePhotoDelete}
              />
            </MuiBox>
            <MuiBox sx={{ display: "grid", gap: 2 }}>
              <div style={{ display: "flex", flex: "1", gap: "10px" }}>
                <FormControl style={{ width: "100%" }}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    placeholder="Enter your name"
                    value={formData.personalInfo.name}
                    onChange={(e) =>
                      handleChange("personalInfo", "name", e.target.value)
                    }
                  />
                </FormControl>
                <FormControl style={{ width: "100%" }}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    placeholder="Enter your email"
                    value={formData.personalInfo.email}
                    type="email"
                    onChange={(e) =>
                      handleChange("personalInfo", "email", e.target.value)
                    }
                  />
                </FormControl>
              </div>
              <FormControl>
                <FormLabel>Role</FormLabel>
                <RoleDropdown
                  value={formData.personalInfo.role || null} // Ensure it doesn't throw an error if undefined
                  onChange={(newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, role: newValue },
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  placeholder="Enter your address"
                  onChange={(e) =>
                    handleChange("personalInfo", "address", e.target.value)
                  }
                  value={formData.personalInfo.address}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Short Description</FormLabel>
                <Input
                  placeholder="Enter a short description"
                  value={formData.personalInfo.shortDescription}
                  onChange={(e) =>
                    handleChange(
                      "personalInfo",
                      "shortDescription",
                      e.target.value
                    )
                  }
                />
              </FormControl>
              <div style={{ display: "flex", gap: "10px" }}>
                <FormControl style={{ width: "100%" }}>
                  <FormLabel>Age</FormLabel>
                  <Input
                    placeholder="Enter your age"
                    value={formData.personalInfo.age}
                    type="number"
                    onChange={(e) =>
                      handleChange("personalInfo", "age", e.target.value)
                    }
                  />
                </FormControl>
                <FormControl style={{ width: "100%" }}>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input
                    type="date"
                    value={formData.personalInfo.dob}
                    onChange={(e) =>
                      handleChange("personalInfo", "dob", e.target.value)
                    }
                  />
                </FormControl>
              </div>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  placeholder="Enter your phone number"
                  value={formData.personalInfo.phone}
                  type="number"
                  onChange={(e) =>
                    handleChange("personalInfo", "phone", e.target.value)
                  }
                />
              </FormControl>
            </MuiBox>
          </MuiBox>
        );
      case 1:
        return (
          <MuiBox sx={{ p: 3 }}>
            <Typography level="h6" mb={2}>
              Professional Information
            </Typography>
            <MuiBox sx={{ display: "grid", gap: 2 }}>
              <FormControl>
                <FormLabel>Domain</FormLabel>
                <Domaindropdown
                  value={formData.professionalInfo.domain || ""} // Default to an empty string
                  onChange={(newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      professionalInfo: {
                        ...prev.professionalInfo,
                        domain: newValue ? newValue.value : null, // Ensure it doesn't set `undefined`
                      },
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Skillset</FormLabel>
                <SkillsetDropdown
                  value={
                    formData.professionalInfo.skillset
                      ? formData.professionalInfo.skillset
                          .split(",")
                          .map((skill) => ({
                            value: skill,
                            label: skill, // Adjust based on your dropdown's expected format
                          }))
                      : []
                  }
                  onChange={(newValues) =>
                    setFormData((prev) => ({
                      ...prev,
                      professionalInfo: {
                        ...prev.professionalInfo,
                        skillset: newValues
                          .map((skill) => skill.value)
                          .join(","), // Extract values and join them as a string
                      },
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Company Name</FormLabel>
                <CompanyDropdown
                  value={formData.professionalInfo.company || null}
                  onChange={(newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      professionalInfo: {
                        ...prev.professionalInfo,
                        company: newValue,
                      },
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Experience (Years)</FormLabel>
                <Input
                  placeholder="Enter experience"
                  type="number"
                  value={formData.professionalInfo.experience}
                  onChange={(e) =>
                    handleChange(
                      "professionalInfo",
                      "experience",
                      e.target.value
                    )
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Location</FormLabel>
                <AddressDropdown
                  value={formData.professionalInfo.location || null}
                  onChange={(newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      professionalInfo: {
                        ...prev.professionalInfo,
                        location: newValue,
                      },
                    }))
                  }
                />
              </FormControl>

              <Button variant="outlined" component="label" fullWidth>
                Upload Visiting Card
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleVisitingCardChange}
                />
              </Button>
              {visitingCardPreview && (
                <MuiBox sx={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={visitingCardPreview}
                    alt="Visiting Card Preview"
                    style={{ maxWidth: "100%", maxHeight: 200 }}
                  />
                  <IconButton
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVisitingCardDelete();
                    }}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      backgroundColor: "rgba(63, 63, 63, 0.7)",
                      "&:hover": { backgroundColor: "rgba(63,63,63,0.9)" },
                    }}
                  >
                    <DeleteIcon fontSize="small" sx={{ color: "red" }} />
                  </IconButton>
                </MuiBox>
              )}
            </MuiBox>
          </MuiBox>
        );
      case 2:
        return (
          <MuiBox sx={{ p: 3 }}>
            <Typography level="h6" mb={2}>
              Additional Information
            </Typography>
            <MuiBox sx={{ display: "grid", gap: 2 }}>
              <FormControl>
                <FormLabel>Website URL</FormLabel>
                <Input
                  placeholder="Enter website URL"
                  value={formData.additionalInfo.website}
                  onChange={(e) =>
                    handleChange("additionalInfo", "website", e.target.value)
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Batch Year</FormLabel>
                <Select
                  placeholder="Select Batch Year"
                  value={
                    batchYears.find(
                      (option) => option.value === formData.additionalInfo.batch
                    ) || null
                  }
                  options={batchYears}
                  onChange={(newValue) => {
                    handleChange("additionalInfo", "batch", newValue?.value);
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Graduated Year</FormLabel>
                <Select
                  placeholder="Select Graduated Year"
                  value={
                    graduatedYears.find(
                      (option) =>
                        option.value === formData.additionalInfo.graduatedYear
                    ) || null
                  }
                  options={graduatedYears}
                  onChange={(newValue) => {
                    handleChange(
                      "additionalInfo",
                      "graduatedYear",
                      newValue?.value
                    );
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>LinkedIn Profile</FormLabel>
                <Input
                  placeholder="Enter LinkedIn URL"
                  value={formData.additionalInfo.linkedin}
                  onChange={(e) =>
                    handleChange("additionalInfo", "linkedin", e.target.value)
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Rating</FormLabel>
                <Select
                  placeholder="Select Rating"
                  value={
                    ratings.find(
                      (option) =>
                        option.value === formData.additionalInfo.rating
                    ) || null
                  } // ✅ Ensure correct value
                  onChange={
                    (newValue) =>
                      handleChange("additionalInfo", "rating", newValue?.value) // ✅ Store only the value
                  }
                  options={ratings}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Hashtags</FormLabel>
                <Input
                  placeholder="Enter hashtags"
                  value={formData.additionalInfo.hashtags}
                  onChange={(e) =>
                    handleChange("additionalInfo", "hashtags", e.target.value)
                  }
                />
              </FormControl>
            </MuiBox>
          </MuiBox>
        );
      case 3:
        return (
          <MuiBox sx={{ p: 3 }}>
            <Typography level="h6" mb={2}>
              Spouse Details
            </Typography>
            <MuiBox sx={{ display: "grid", gap: 2 }}>
              <FormControl>
                <FormLabel>Spouse Name</FormLabel>
                <Input
                  value={formData.spouse.name}
                  placeholder="Enter spouse name"
                  onChange={(e) =>
                    handleChange("spouse", "name", e.target.value)
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Spouse Occupation</FormLabel>
                <Input
                  value={formData.spouse.occupation}
                  placeholder="Enter spouse occupation"
                  onChange={(e) =>
                    handleChange("spouse", "occupation", e.target.value)
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Company Name</FormLabel>
                <CompanyDropdown
                  value={formData.spouse.company || null}
                  onChange={(newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      spouse: {
                        ...prev.spouse,
                        company: newValue,
                      },
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  placeholder="Enter phone number"
                  value={formData.spouse.phone}
                  onChange={(e) =>
                    handleChange("spouse", "phone", e.target.value)
                  }
                />
              </FormControl>
              <div style={{ display: "flex", gap: "10px" }}>
                <FormControl style={{ width: "100%" }}>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input
                    type="date"
                    value={formData.spouse.dob}
                    onChange={(e) =>
                      handleChange("spouse", "dob", e.target.value)
                    }
                  />
                </FormControl>
                <FormControl style={{ width: "100%" }}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    placeholder="Enter email"
                    value={formData.spouse.email}
                    onChange={(e) =>
                      handleChange("spouse", "email", e.target.value)
                    }
                  />
                </FormControl>
              </div>
            </MuiBox>
          </MuiBox>
        );
      default:
        return "Unknown Step";
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        height: "100%",
        width: "100%",
        overflowY: "scroll",
      }}
    >
      <MuiBox sx={{ width: "60%", margin: "auto", mt: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <MuiBox sx={{ mt: 3 }}>{getStepContent(activeStep)}</MuiBox>
        <MuiBox
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 0,
            pb: 2,
          }}
        >
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button variant="solid" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button variant="solid" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </MuiBox>
      </MuiBox>
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
}
