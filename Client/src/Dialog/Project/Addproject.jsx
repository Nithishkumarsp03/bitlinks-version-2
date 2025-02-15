import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { Input } from '@mui/joy';
import { useParams } from 'react-router-dom';
import Domaindropdown from '../../Dropdown/Domaindropdown';
import Spocdropdown from '../../Dropdown/Spocdropdown';

export default function AddProject({open, setAddopen, fetchPerson, showSnackbar}) {
    const api = process.env.REACT_APP_API;
    const {uuid} = useParams();
  const [formValues, setFormValues] = useState({
    projectTitle: '',
    initialDate: '',
    dueDate: '',
    domain: '',
    projectLeader: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleDomainChange = (selectedOption) => {
    setFormValues({
      ...formValues,
      domain: selectedOption ? selectedOption.value : "",
    });
  };

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

  const handleSubmit = async() => {
    try{
    const res = await fetch(`${api}/api/project/adddata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({uuid, formValues}),
      });
  
      if (!res.ok) {
        showSnackbar("Failed to submit history data", 'error')
        throw new Error("Failed to submit history data");
      }
      
      if(res.ok){
        setAddopen(false);
        setFormValues({
          projectTitle: '',
          initialDate: '',
          dueDate: '',
          domain: '',
          projectLeader: '',
        })
        fetchPerson();
        showSnackbar('Project added Successfully!', 'success');
      }
  
    //   alert("History submitted successfully!");
    } catch (error) {
      console.error("Error:", error.message);
      showSnackbar("Something went wrong. Please try again.", 'error');
    }
  };  

  const isFormComplete = Object.values(formValues).every((value) => value.trim() !== '');

  return (
    <div>
      <Dialog open={open} onClose={()=>setAddopen(false)} fullWidth>
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <label htmlFor="">ProjectTitle</label>
            <Input
              name="projectTitle"
              placeholder="Project Title"
              value={formValues.projectTitle}
              onChange={handleChange}
              fullWidth
            />
            <label htmlFor="">Initial Date</label>
            <Input
              name="initialDate"
              placeholder="Initial Date"
              type="date"
              value={formValues.initialDate}
              onChange={handleChange}
              fullWidth
            />
            <label htmlFor="">Due Date</label>
            <Input
              name="dueDate"
              placeholder="Due Date"
              type="date"
              value={formValues.dueDate}
              onChange={handleChange}
              fullWidth
            />
            <label htmlFor="">Domain</label>
            <Domaindropdown value={formValues.domain} onChange={handleDomainChange}/>
            
            <label htmlFor="">Leader</label>
            <div>
              <Spocdropdown formValues={formValues} setFormValues={setFormValues}/>
            </div>
            {/* <Input
              name="projectLeader"
              placeholder="Ex - John Doe..,"
              value={formValues.projectLeader}
              onChange={handleChange}
              fullWidth
            /> */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setAddopen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}  disabled={!isFormComplete}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
