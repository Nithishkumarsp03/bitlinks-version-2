import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Call from "../../Assets/Call.svg";
import Minutes from "../../Assets/minutes.svg";
import File from "../../Assets/File.svg";
import Image from "../../Assets/Image.svg";
import Completed from "../../Assets/Completed.svg";
import Email from "../../Assets/Email.svg";
import Incomplete from "../../Assets/Incomplete.svg";
import Missedcall from "../../Assets/Missedcall.svg";
import MissedVisit from "../../Assets/MissedVisit.svg";
import Reschedule from "../../Assets/Reschedule.svg";
import RescheduledVisit from "../../Assets/RescheduledVisit.svg";
import Roundsms from "../../Assets/Roundsms.svg";
import Visited from "../../Assets/Visited.svg";
import InteractionDropdown from "../../Dropdown/Interactiondropdown";
import Projectdropdown from "../../Dropdown/Projectdropdown";
import { useParams } from "react-router-dom";

export default function AddHistory({ open, setAddhistory, showSnackbar, fetchHistory }) {
  const callTypes = [
    { label: "Call", icon: Call },
    { label: "Minutes", icon: Minutes },
    { label: "Visited", icon: Visited },
    { label: "Reschedule Visit", icon: RescheduledVisit },
    { label: "Reschedule Call", icon: Reschedule },
    { label: "Email", icon: Email },
    { label: "Message", icon: Roundsms },
    { label: "Missedcall", icon: Missedcall },
    { label: "Missed Visit", icon: MissedVisit },
    { label: "Incomplete", icon: Incomplete },
    { label: "Completed", icon: Completed },
  ];

  const api = process.env.REACT_APP_API;
  const {uuid} = useParams()
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');
  const [selectedType, setSelectedType] = useState("");
  const [note, setNote] = useState("");
  const [datetime, setDatetime] = useState("");
  const [rescheduleDatetime, setRescheduleDatetime] = useState("");
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [dueDate, setdueDate] = useState("");
  const [project, setProject] = useState("");
  const [minute, setMinute] = useState("");
  const [purpose, setPurpose] = useState("");
  

  const handleTypeSelect = (type) => {
    setSelectedType((prevType) => (prevType === type ? "" : type));
    if (type !== "Visited") {
      setImage1(null);
      setImage2(null);
    }
    if (!type.includes("Reschedule")) setRescheduleDatetime("");
  };

  const handleImageUpload = (e, imageSlot) => {
    const file = e.target.files[0]; // Only accept one file per input
    if (imageSlot === 1) setImage1(file);
    else if (imageSlot === 2) setImage2(file);
  };

  const handleRemoveImage = (imageSlot) => {
    if (imageSlot === 1) setImage1(null);
    else if (imageSlot === 2) setImage2(null);
  };

  const handleChange = (selectedOption) => {
    setPurpose(selectedOption ? selectedOption.value : null);
  };

  const handleSubmit = async () => {
    if (selectedType.includes("Visited") && (!image1 || !image2)) {
      showSnackbar("Please upload both images before submitting.", 'error');
      return;
    }
  
    const formData = new FormData();
    if (image1) formData.append("profileImage", image1);
    if (image2) formData.append("visitingcard", image2);
  
    try {
      // Upload images
      const uploadResponse = await fetch(`${api}/api/upload`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadResponse.json();
  
      if (!uploadResponse.ok) {
        showSnackbar(uploadData.error || "Image upload failed", 'error');
        throw new Error(uploadData.error || "Image upload failed");
      }
  
      const historyData = {
        uuid: uuid,
        name: name,
        email: email,
        type: selectedType,
        purpose: purpose,
        minute: minute,
        note,
        datetime: datetime.replace('T', ' '),
        rescheduleDatetime: selectedType.includes("Reschedule") 
          ? rescheduleDatetime.replace('T', ' ')
          : null,
        image1: uploadData?.profileImage || null,
        image2: uploadData?.visitingcard || null,
        ...(selectedType === "Minutes" && {
          project: project,
          dueDate: dueDate.replace('T', ' '),
        }),
      };      
  
      // console.log("Final History Data:", historyData);
  
      // Submit history data
      const res = await fetch(`${api}/api/history/adddata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({historyData}),
      });
  
      if (!res.ok) {
        setAddhistory(false);
        showSnackbar('Failed to submit history data', 'error');
        throw new Error("Failed to submit history data");
      }
  
      showSnackbar("History submitted successfully!", 'success');
      fetchHistory();
      setAddhistory(false);
    } catch (error) {
      console.error("Error:", error.message);
      showSnackbar("Something went wrong. Please try again.", 'error');
      setAddhistory(false);
    }
  };  

  return (
    <Dialog open={open} onClose={() => setAddhistory(false)}>
      <DialogTitle>Add History</DialogTitle>
      <DialogContent>
        {/* Call Type Selection */}
        <div className="calltype">
          <Stack direction="row" spacing={1} style={{ flexWrap: "nowrap" }}>
            {callTypes.map((type, index) => (
              <Chip
                key={index}
                label={type.label}
                onClick={() => handleTypeSelect(type.label)}
                color={selectedType === type.label ? "primary" : "default"}
                clickable
                avatar={
                  <img
                    src={type.icon}
                    alt={type.label}
                    style={{ width: "24px", height: "24px" }}
                  />
                }
              />
            ))}
          </Stack>
        </div>

        {selectedType === "Minutes" && (
          <TextField 
          label="Minute"
          variant="outlined"
          rows={2}
          fullWidth
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
          style={{ marginTop: "20px"}}
          />
        )}

        {/* Note Input */}
        <TextField
          label="Note"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ marginTop: "20px", marginBottom: "20px" }}
        />

        {/* Date-Time Input */}
        <TextField
          label="Date"
          type="date"
          fullWidth
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ marginBottom: "20px" }}
        />

        {selectedType === "Minutes" && (
          <div style={{width: "100%"}}>
            <TextField
            label="Due Date"
            type="date"
            fullWidth
            value={dueDate}
            onChange={(e) => setdueDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ marginBottom: "20px" }}
          />
          <div style={{marginBottom: '20px'}}>
              <Projectdropdown  project={project} setProject={setProject}/>
          </div>
          </div>
        )}

        {/* Reschedule Date-Time Input */}
        {selectedType.includes("Reschedule") && (
          <TextField
            label="Reschedule Date and Time"
            type="date"
            fullWidth
            value={rescheduleDatetime}
            onChange={(e) => setRescheduleDatetime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ marginBottom: "20px" }}
          />
        )}

        {/* Image Upload for Visited */}
        {selectedType === "Visited" && (
          <div style={{ marginBottom: "20px", width: "100%", display: "flex", justifyContent: "center", gap: "5%" }}>
            {/* Upload Image 1 */}
            <div style={{ marginBottom: "10px" }}>
              <Button variant="contained" component="label">
                Upload Image 1
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleImageUpload(e, 1)}
                />
              </Button>
              {image1 && (
                <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                  <img
                    src={URL.createObjectURL(image1)}
                    alt="Image 1 Preview"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      marginRight: "10px",
                      borderRadius: "5px",
                    }}
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(1)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              )}
            </div>

            {/* Upload Image 2 */}
            <div style={{ marginBottom: "10px" }}>
              <Button variant="contained" component="label">
                Upload Image 2
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleImageUpload(e, 2)}
                />
              </Button>
              {image2 && (
                <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                  <img
                    src={URL.createObjectURL(image2)}
                    alt="Image 2 Preview"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      marginRight: "10px",
                      borderRadius: "5px",
                    }}
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(2)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{marginBottom: '20px'}}>
            <InteractionDropdown  purpose={purpose} setPurpose={setPurpose} handleChange={handleChange}/>
        </div>

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={
            !selectedType ||
            !note ||
            !datetime ||
            !purpose ||
            (selectedType.includes("Reschedule") && !rescheduleDatetime) ||
            (selectedType.includes("Visited") && (!!image1 !== !!image2))
          }
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}