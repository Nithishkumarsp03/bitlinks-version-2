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
import Select from "react-select";
import RoleDropdown from "../../Dropdown/RoleDropdown";
import Domaindropdown from "../../Dropdown/Domaindropdown";
import SkillsetDropdown from "../../Dropdown/SkillsetDropdown";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import "../../Styles/dialog.css"; // Add your styles here
import { useParams } from "react-router-dom";
import useStore from "../../store/store";

const PlacementDialog = ({ open, setPlacementopen, setplacementCompletion, showSnackbar }) => {
  const {setLogopen} = useStore();
  const api = process.env.REACT_APP_API;
  const { uuid } = useParams();
  const [placementInfo, setPlacementInfo] = useState({
    placement: null,
    role: null,
    domain: null,
    skillset: [],
    eligibility: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlacementInfo({ ...placementInfo, [name]: value });
  };

  const handleSkillSetChange = (selectedOption) => {
    setPlacementInfo({ ...placementInfo, skillset: selectedOption });
  };

  const handleDomainChange = (selectedOption) => {
    setPlacementInfo({
      ...placementInfo,
      domain: selectedOption ? selectedOption.value : "",
    });
  };

  const handleRadioChange = (e) => {
    const { value } = e.target;
    if (value === "yes") fetchPlacement();
    setPlacementInfo({
      ...placementInfo,
      placement: value === "yes" ? true : false,
      ...(value === "no" && {
        role: null,
        domain: null,
        skillset: [],
        eligibility: "",
      }),
    });
  };

  const calculateProgress = () => {
    const totalFields = placementInfo.placement ? 5 : 1; // If "Yes" is selected, count all fields
    const filledFields = Object.values(placementInfo).filter((value) => {
      if (value === null || value === false) return false; // Skip null or false values
      if (typeof value === "object" && value?.value) return true; // Check for selected options in dropdown
      if (typeof value === "string" && value.trim() !== "") return true; // Check for non-empty strings
      return false;
    }).length;
    return (filledFields / totalFields) * 100;
  };

  setplacementCompletion(calculateProgress());

  const fetchPlacement = async () => {
    try {
      const res = await fetch(`${api}/api/infograph/fetch/placement`, {
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

      if (data.placement.length > 0) {
        const fetchedData = data.placement[0]; // Extract first item from array

        setPlacementInfo({
          placement: fetchedData.ifplacement === "yes", // Convert "yes" -> true
          role: fetchedData.role || null, // Store as string
          domain: fetchedData.domain || "", // Store as string
          skillset: fetchedData.skillset
            ? fetchedData.skillset.split(",").map((skill) => ({
                value: skill,
                label: skill,
              }))
            : [], // Convert skillset string to array
          eligibility: fetchedData.eligibility || "",
          projecttype: fetchedData.projecttype || "",
        });
      }
    } catch (error) {
      showSnackbar(error);
      console.error("Fetch Placement Error:", error);
    }
  };

  useEffect(() => {
    if (uuid) {
      fetchPlacement();
    }
  }, [uuid]);

  const completion = calculateProgress();

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    const skillSetString = placementInfo.skillset
      .map((skill) => skill.value)
      .join(",");
    const updatedPlacementInfo = {
      uuid: uuid,
      placement: placementInfo.placement ? "yes" : "no",
      role: placementInfo.role || "", // Store as plain string
      domain: placementInfo.domain || "", // Store as plain string
      skillset: skillSetString,
      eligibility: placementInfo.eligibility || "",
      completion,
    };

    // console.log(updatedPlacementInfo)

    try {
      const res = await fetch(`${api}/api/infograph/update/placement`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({updatedPlacementInfo}), // Send plain string
      });

      if(res.status == 401){
        setLogopen(true);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        showSnackbar(data.message, 'error');
        throw new Error(data.message || "Failed to update placement info");
      }

      showSnackbar('Placement info updated Successfully!', 'success');
      setPlacementopen(false);
    } catch (error) {
      showSnackbar(error, 'error');
      console.error(error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setPlacementopen(false)}
      maxWidth="sm"
      fullWidth
    >
      <LinearProgress
        variant="determinate"
        value={calculateProgress()}
        sx={{ height: 10 }}
      />
      <DialogTitle className="dialog-title">Placement Details</DialogTitle>
      <DialogContent>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <FormControl>
            <FormLabel>Is it a Placement?</FormLabel>
            <RadioGroup
              row
              value={placementInfo.placement ? "yes" : "no"}
              onChange={handleRadioChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <div
            style={{
              maxHeight: placementInfo.placement ? "1000px" : "0",
              overflow: "hidden",
              transition: "max-height 0.5s ease-in-out",
            }}
          >
            {placementInfo.placement && (
              <>
                <div style={{ marginBottom: "10px" }}>
                  <RoleDropdown
                    value={placementInfo.role}
                    onChange={
                      (newValue) =>
                        setPlacementInfo({ ...placementInfo, role: newValue }) // Store as string
                    }
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <Domaindropdown
                    value={placementInfo.domain}
                    onChange={handleDomainChange}
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <SkillsetDropdown
                    value={placementInfo.skillset}
                    onChange={handleSkillSetChange}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Eligibility"
                    name="eligibility"
                    value={placementInfo.eligibility}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    style={{ marginBottom: "10px" }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setPlacementopen(false)} color="secondary">
          Discard
        </Button>
        <Button onClick={handleSaveChanges} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlacementDialog;
