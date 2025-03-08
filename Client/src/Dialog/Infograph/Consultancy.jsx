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

const ConsultancyDialog = ({open, setConsultancyopen, setconsultancyCompletion, showSnackbar}) => {
  const {setLogopen} = useStore();
  const api = process.env.REACT_APP_API;
  const {uuid} = useParams();
  const [consultancyInfo, setConsultancyInfo] = useState({
    consultancy: null,
    role: null,
    domain: null,
    skillset: [],
    eligibility: '',
    projectType: '',
  });

  const projectTypes = [
    { value: 'short-term', label: 'Short Term' },
    { value: 'long-term', label: 'Long Term' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConsultancyInfo({ ...consultancyInfo, [name]: value });
  };

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setConsultancyInfo({
      ...consultancyInfo,
      consultancy: value === "yes" ? true : false,
      ...(value === "no" && { role: null, domain: null, skillset: [], eligibility: '', projectType: '' }),
    });
  };

  const handleSkillSetChange = (selectedOption) => {
    setConsultancyInfo({ ...consultancyInfo, skillset: selectedOption });
  };

  const handleDomainChange = (selectedOption) => {
    setConsultancyInfo({
      ...consultancyInfo,
      domain: selectedOption ? selectedOption.value : "",
    });
  };

  const handleSelectChange = (name, selectedOption) => {
    setConsultancyInfo({ ...consultancyInfo, [name]: selectedOption });
  };

  const calculateProgress = () => {
    const totalFields = consultancyInfo.consultancy ? 5 : 1; // If "Yes" is selected, count all fields
    const filledFields = Object.values(consultancyInfo).filter((value) => {
      if (value === null || value === false) return false; // Skip null or false values
      if (typeof value === 'object' && value?.value) return true; // Check for selected options in dropdown
      if (typeof value === 'string' && value.trim() !== '') return true; // Check for non-empty strings
      return false;
    }).length;
    return (filledFields / totalFields) * 100;
  };

  setconsultancyCompletion(calculateProgress());

  const fetchConsultancy = async () => {
    try {
      const res = await fetch(`${api}/api/infograph/fetch/consultancy`, {
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
        showSnackbar(data.message, 'error')
        throw new Error(data.message);
      }
  
      if (data.consultancy.length > 0) {
        const fetchedData = data.consultancy[0]; // Extract first object
  
        setConsultancyInfo({
          consultancy: fetchedData.ifconsultancy === "yes", // Convert "yes" -> true
          role: fetchedData.role
          ? { value: fetchedData.role, label: fetchedData.role }
          : null,
          domain: fetchedData.domain || "",
          skillset: fetchedData.skillset
            ? fetchedData.skillset.split(",").map((skill) => ({
                value: skill.trim(),
                label: skill.trim(),
              }))
            : [],
          eligibility: fetchedData.eligibility || "",
          projectType: fetchedData.projecttype || "", // Match API field
        });
      }
    } catch (error) {
      console.error("Fetch Consultancy Error:", error);
    }
  };
  
  // Fetch only when `uuid` changes
  useEffect(() => {
    if (uuid) {
      fetchConsultancy();
    }
  }, [uuid]); // ✅ Fix infinite loop  
  
  const completion = calculateProgress()

  const handleSaveChanges = async(event) => {
    const skillSetString = consultancyInfo.skillset
      .map((skill) => skill.value)
      .join(",");
    event.preventDefault();
    const consultancyUpdate = {
      consultancy: consultancyInfo.consultancy ? "yes": "no",
      role: consultancyInfo.role,
      domain: consultancyInfo.domain,
      skillset: skillSetString,
      eligibility: consultancyInfo.eligibility,
      projectType: consultancyInfo.projectType,
      uuid: uuid,
      completion: completion,
    }
    // console.log('Saved Consultancy Info:', consultancyInfo);
    try {
      const res = await fetch(`${api}/api/infograph/update/consultancy`,{
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({consultancyUpdate})
      });

      if(res.status == 401){
        setLogopen(true);
        return;
      }

      const data = await res.json();
      if(!res.ok){
        showSnackbar(data.message, 'error');
        throw new Error(data.message);
      }

      showSnackbar('Consultancy info updated succesfully!', 'success');
      setConsultancyopen(false);
    } catch (error) {
      showSnackbar(error, 'error');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={()=>setConsultancyopen(false)} maxWidth="sm" fullWidth>
      <LinearProgress variant="determinate" value={calculateProgress()} sx={{ height: 10 }} />
      <DialogTitle className="dialog-title">Consultancy Details</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <FormControl>
            <FormLabel>Is it a Consultancy?</FormLabel>
            <RadioGroup row value={consultancyInfo.consultancy ? 'yes' : 'no'} onChange={handleRadioChange}>
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <div
            style={{
              maxHeight: consultancyInfo.consultancy ? '1000px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.5s ease-in-out',
            }}
          >
            {consultancyInfo.consultancy && (
              <>
                <div style={{marginBottom: "10px"}}>
                  <RoleDropdown
                      value={consultancyInfo.role}
                      onChange={(newValue) => setConsultancyInfo({ ...consultancyInfo, role: newValue })}
                  />
                </div>
                <div style={{marginBottom: '10px'}}>
                  <Domaindropdown value={consultancyInfo.domain} onChange={handleDomainChange} />
                </div>
                <div style={{marginBottom: '10px'}}>
                  <SkillsetDropdown value={consultancyInfo.skillset} onChange={handleSkillSetChange} />
                </div>
                    <Input
                      placeholder="Eligibility"
                      name="eligibility"
                      value={consultancyInfo.eligibility}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      style={{ marginBottom: '10px' }}
                    />
                <Input
                  placeholder="Project Type"
                  name='projectType'
                  value={consultancyInfo.projectType}
                  onChange={handleInputChange}
                  fullWidth
                />
              </>
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>setConsultancyopen(false)} color="secondary">
          Discard
        </Button>
        <Button onClick={handleSaveChanges} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsultancyDialog;
