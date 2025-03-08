import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, LinearProgress } from "@mui/material";
import Domaindropdown from "../../Dropdown/Domaindropdown";
import Input from "@mui/joy/Input";
import Select from "react-select";
import "../../Styles/dialog.css";
import { useParams } from "react-router-dom";
import SkillsetDropdown from "../../Dropdown/SkillsetDropdown";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import useStore from "../../store/store";

const Expertise = ({ open, setExpertiseopen, setexpertiseCompletion, showSnackbar }) => {
  const {setLogopen} = useStore();
  const api = process.env.REACT_APP_API;
  const {uuid} = useParams()
  const [expertiseInfo, setExpertiseInfo] = useState({
    domain: "",
    specialistskills: "",
    skillset: [],
  });

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setExpertiseInfo({ ...expertiseInfo, [name]: value });
  };

  const handleSkillSetChange = (selectedOption) => {
    setExpertiseInfo({ ...expertiseInfo, skillset: selectedOption });
  };

  const handleDomainChange = (selectedOption) => {
    setExpertiseInfo({
      ...expertiseInfo,
      domain: selectedOption ? selectedOption.value : "",
    });
  };

  const calculateProgress = () => {
    const totalFields = Object.keys(expertiseInfo).length;
    const filledFields = Object.values(expertiseInfo).filter((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      } else {
        return typeof value === "string" && value.trim() !== "";
      }
    }).length;
    return (filledFields / totalFields) * 100;
  };

  setexpertiseCompletion(calculateProgress())

  const fetchExpertise = async () => {
    try {
      const res = await fetch(`${api}/api/infograph/fetch/expertise`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ uuid: uuid }), // Send UUID
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
  
      if (data.expertise.length > 0) {
        const fetchedData = data.expertise[0]; // Extract first item from the array
        setExpertiseInfo({
          domain: fetchedData.domain || "",
          specialistskills: fetchedData.specialistskills || "",
          skillset: fetchedData.skillset
            ? fetchedData.skillset.split(",").map((skill) => ({
                value: skill,
                label: skill,
              }))
            : [], // Convert skillset string to array for react-select
        });
      }
    } catch (error) {
      console.log("Fetch Expertise Error:", error);
    }
  };
  
  // Call fetchExpertise only when uuid changes
  useEffect(() => {
    if (uuid) {
      fetchExpertise();
    }
  }, [uuid]);

  const completion = calculateProgress();


  const handleSaveChanges = async(event) => {
    event.preventDefault();
    const skillSetString = expertiseInfo.skillset.map((skill) => skill.value).join(",");

    const expertiseData = {
      uuid: uuid,
      domain: expertiseInfo.domain,
      specialistskills: expertiseInfo.specialistskills,
      skillset: skillSetString,
      completion: completion,
    }

    try {
      const res = await fetch(`${api}/api/infograph/update/expertise`,{
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
          body: JSON.stringify(expertiseData),
      });

      if(res.status == 401){
        setLogopen(true);
        return;
      }

      const data = await res.json();
      if(!res.ok){
        showSnackbar(data.message, 'error');
        throw new Error(data.message || 'Failed to update expertise info')
      }
      showSnackbar('Expertise info updated successfully', 'success');
      setExpertiseopen(false);
    } catch (error) {
      showSnackbar(error, 'error')
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={() => setExpertiseopen(false)} maxWidth="sm" fullWidth>
      <LinearProgress variant="determinate" value={calculateProgress()} sx={{ height: 10 }} />
      <DialogTitle className="dialog-title">Expertise Details</DialogTitle>
      <DialogContent>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", width: "100%", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "50%" }}>
              <Domaindropdown value={expertiseInfo.domain} onChange={handleDomainChange} />
            </div>
            <div style={{ width: "50%" }}>
            <SkillsetDropdown value={expertiseInfo.skillset} onChange={handleSkillSetChange} />
            </div>
          </div>
          <div className="input-group">
            <Input
              placeholder="Specialist Skills"
              name="specialistskills"
              value={expertiseInfo.specialistskills}
              onChange={handleDetailsChange}
              fullWidth
              required
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setExpertiseopen(false)} color="secondary">
          Discard
        </Button>
        <Button onClick={handleSaveChanges} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Expertise;
