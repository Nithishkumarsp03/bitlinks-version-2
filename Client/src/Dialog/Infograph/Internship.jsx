import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, LinearProgress, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Input from '@mui/joy/Input';
import Select from 'react-select';
import RoleDropdown from "../../Dropdown/RoleDropdown";
import Domaindropdown from "../../Dropdown/Domaindropdown";
import SkillsetDropdown from "../../Dropdown/SkillsetDropdown";
import { decryptData } from '../../Utils/crypto/cryptoHelper';
import "../../Styles/dialog.css"; // Add your styles here
import { useParams } from 'react-router-dom';
import useStore from '../../store/store';

const InternshipDialog = ({open, setInternshipopen, setinternshipCompletion, showSnackbar}) => {
  const {setLogopen} = useStore();
  const api = process.env.REACT_APP_API;
  const {uuid} = useParams();
  const [internshipInfo, setInternshipInfo] = useState({
    internship: null,
    role: null,
    domain: null,
    skillset: [],
    eligibility: '',
    projecttype: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInternshipInfo({ ...internshipInfo, [name]: value });
  };

  const handleSkillSetChange = (selectedOption) => {
    setInternshipInfo({ ...internshipInfo, skillset: selectedOption });
  };

  const handleDomainChange = (selectedOption) => {
    setInternshipInfo({
      ...internshipInfo,
      domain: selectedOption ? selectedOption.value : "",
    });
  };

  const handleRadioChange = (e) => {
    const { value } = e.target;
    // if(value === 'yes') fetchInternship();
    setInternshipInfo({
      ...internshipInfo,
      internship: value === "yes" ? true : false,
      ...(value === "no" && { role: null, domain: null, skillset: [], eligibility: '', projecttype: '' }),
    });
  };

  const calculateProgress = () => {
    const totalFields = internshipInfo.internship ? 5 : 1; // If "Yes" is selected, count all fields
    const filledFields = Object.values(internshipInfo).filter((value) => {
      if (value === null || value === false) return false; // Skip null or false values
      if (typeof value === 'object' && value?.value) return true; // Check for selected options in dropdown
      if (typeof value === 'string' && value.trim() !== '') return true; // Check for non-empty strings
      return false;
    }).length;
    return (filledFields / totalFields) * 100;
  };

  setinternshipCompletion(calculateProgress())
  
  const fetchInternship = async () => {
    try {
      const res = await fetch(`${api}/api/infograph/fetch/internship`, {
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
  
      if (data.internship.length > 0) {
        const fetchedData = data.internship[0]; // Extract first object
  
        setInternshipInfo({
          internship: fetchedData.ifinternship === "yes", // Convert "yes" -> true
          role: fetchedData.role
          ? { value: fetchedData.role, label: fetchedData.role }
          : null,
          domain: fetchedData.domain || "",
          skillset: fetchedData.skillset
          ? fetchedData.skillset.split(",").map((skill) => ({
              value: skill,
              label: skill,
            }))
          : [],
          eligibility: fetchedData.eligibility || "",
          projecttype: fetchedData.projecttype || "", // Match API field
        });
      }
    } catch (error) {
      showSnackbar(error, 'error');
      console.error("Fetch Internship Error:", error);
    }
  };
  
  useEffect(() => {
    if (uuid) {
      fetchInternship();
    }
  }, [uuid]);  

  const completion = calculateProgress()

  const handleSaveChanges = async(event) => {
    event.preventDefault();
    const skillSetString = Array.isArray(internshipInfo.skillset)
  ? internshipInfo.skillset.map((skill) => skill.value).join(",")
  : "";

    const updateInternship = {
      uuid: uuid,
      internship: internshipInfo.internship? "yes": "no",
      role: internshipInfo.role,
      domain: internshipInfo.domain,
      skillset: skillSetString,
      eligibility: internshipInfo.eligibility,
      projecttype: internshipInfo.projecttype,
      uuid: uuid,
      completion: completion
    }

    try {
      const res = await fetch(`${api}/api/infograph/update/internship`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({updateInternship})
      });

      if(res.status == 401){
        setLogopen(true);
        return;
      }

      const data = await res.json();
      showSnackbar('Internship info updated Succesfully!', 'success');
      if(!res.ok){
        showSnackbar(data.message, 'error');
        throw new Error(data.message);
      }

      setInternshipopen(false);
    } catch (error) {
      showSnackbar(error, 'error');
      console.error(error);
    }
    // console.log('Saved internship Info:', internshipInfo);
  };

  return (
    <Dialog open={open} onClose={()=>setInternshipopen(false)} maxWidth="sm" fullWidth>
      <LinearProgress variant="determinate" value={calculateProgress()} sx={{ height: 10 }} />
      <DialogTitle className="dialog-title">Internship Details</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <FormControl>
            <FormLabel>Is it a Internsip?</FormLabel>
            <RadioGroup row value={internshipInfo.internship ? 'yes' : 'no'} onChange={handleRadioChange}>
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <div
            style={{
              maxHeight: internshipInfo.internship ? '1000px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.5s ease-in-out',
            }}
          >
            {internshipInfo.internship && (
              <>
              <div style={{marginBottom: "10px"}}>
              <RoleDropdown
                    value={internshipInfo.role}
                    onChange={(newValue) =>
                      setInternshipInfo({ ...internshipInfo, role: newValue })
                    }
                  />
              </div>
              <div style={{marginBottom: "10px"}}>
              <Domaindropdown
                    value={internshipInfo.domain}
                    onChange={handleDomainChange}
                  />
              </div>
              <div style={{marginBottom: "10px"}}>
              <SkillsetDropdown value={internshipInfo.skillset} onChange={handleSkillSetChange} />
              </div>
                    <Input
                      placeholder="Eligibility"
                      name="eligibility"
                      value={internshipInfo.eligibility}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      style={{ marginBottom: '10px' }}
                    />
                <Input
                  placeholder="Project Type"
                  name='projecttype'
                  value={internshipInfo.projecttype}
                  onChange={handleInputChange}
                  fullWidth
                />
              </>
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setInternshipopen(false)} color="secondary">
          Discard
        </Button>
        <Button onClick={handleSaveChanges} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InternshipDialog;
