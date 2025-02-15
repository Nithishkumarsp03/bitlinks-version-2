import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Input from "@mui/joy/Input";
import { useParams } from "react-router-dom";
import AddressDropdown from "../../Dropdown/AddressDropdown";
import RoleDropdown from "../../Dropdown/RoleDropdown";
import CompanyDropdown from "../../Dropdown/CompanyDropdown";
import "../../Styles/dialog.css";

const ExperienceDialog = ({ open, setExperienceopen, setexperienceCompletion, showSnackbar }) => {
  const api = process.env.REACT_APP_API;
  const { uuid } = useParams();
  const [experienceInfo, setExperienceInfo] = useState({
    ifexperience: null,
    role: null,
    companyname: null,
    position: "",
    experience: "",
    companyaddress: null,
  });

  // Fetch experience information when the component loads
  const fetchExperience = async () => {
    try {
      const res = await fetch(`${api}/api/infograph/fetch/experience`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ uuid }),
      });

      const data = await res.json();
      if (!res.ok) {
        showSnackbar(data.message, 'error');
        throw new Error(data.message);
      }

      if (data.experience && data.experience.length > 0) {
        const experience = data.experience[0];
        setExperienceInfo({
          ifexperience: experience.ifexperience === 'yes'? true: false,
          role: experience.role
            ? { value: experience.role, label: experience.role }
            : null,
          companyname: experience.companyname
          ? { value: experience.companyname, label: experience.companyname }
          : null,
          position: experience.position,
          experience: experience.experience,
          companyaddress: experience.companyaddress
            ? {
                value: experience.companyaddress,
                label: experience.companyaddress,
              }
            : null,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
      fetchExperience();
  }, []);

  // Handle form field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExperienceInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle radio button change
  const handleRadioChange = (e) => {
    const { value } = e.target;
    setExperienceInfo((prev) => ({
      ...prev,
      ifexperience: value === "yes",
      ...(value === "no" && {
        role: null,
        companyname: null,
        position: "",
        experience: "",
        companyaddress: null,
      }),
    }));
  };

  // Handle RoleDropdown and AddressDropdown updates properly
  const handlecompanyChange = (newValue) => {
    setExperienceInfo((prev) => ({ ...prev, companyname: newValue }));
  };

  const handleRoleChange = (newValue) => {
    setExperienceInfo((prev) => ({ ...prev, role: newValue }));
  };

  const handleAddressChange = (newValue) => {
    setExperienceInfo((prev) => ({ ...prev, companyaddress: newValue }));
  };

  // Calculate progress bar value
  const calculateProgress = () => {
    const totalFields = experienceInfo.ifexperience ? 6 : 1;
    const filledFields = Object.values(experienceInfo).filter(
      (value) => value !== null && value !== ""
    ).length;
    return (filledFields / totalFields) * 100;
  };

  setexperienceCompletion(calculateProgress());

  // Handle save changes
  const handleSaveChanges = async (event) => {
    event.preventDefault();
    const completion = calculateProgress();

    const dataToUpdate = {
      uuid,
      experienceInfo,
      completion,
    };

    try {
      const res = await fetch(`${api}/api/infograph/update/experience`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(dataToUpdate),
      });
      const result = await res.json();
      if (!res.ok) {
        showSnackbar(result.message, 'error');
        throw new Error(result.message);
      }
      showSnackbar('Experience info updated Successfully!', 'success');
      setExperienceopen(false);
    } catch (error) {
      showSnackbar(error, 'error');
      console.error(error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setExperienceopen(false)}
      maxWidth="sm"
      fullWidth
    >
      <LinearProgress
        variant="determinate"
        value={calculateProgress()}
        sx={{ height: 10 }}
      />
      <DialogTitle className="dialog-title">Previous Experience</DialogTitle>
      <DialogContent>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <FormControl>
            <FormLabel>Do you have any previous Experience?</FormLabel>
            <RadioGroup
              row
              value={experienceInfo.ifexperience ? "yes" : "no"}
              onChange={handleRadioChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          {experienceInfo.ifexperience && (
            <div style={{ display: experienceInfo.ifexperience ? "block" : "none" }}>
              <CompanyDropdown value={experienceInfo.companyname} onChange={handlecompanyChange}/>
              <div style={{ marginTop: '10px' }}>
                <Input
                  placeholder="Position"
                  name="position"
                  value={experienceInfo.position}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  style={{ marginBottom: "10px" }}
                />
              </div>
              <RoleDropdown value={experienceInfo.role} onChange={handleRoleChange} />
              <div style={{ marginTop: "10px" }}>
                <Input
                  placeholder="Experience (in years)"
                  name="experience"
                  value={experienceInfo.experience}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  style={{ marginBottom: "10px" }}
                />
              </div>
              <AddressDropdown value={experienceInfo.companyaddress} onChange={handleAddressChange} />
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setExperienceopen(false)} color="secondary">
          Discard
        </Button>
        <Button onClick={handleSaveChanges} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExperienceDialog;
