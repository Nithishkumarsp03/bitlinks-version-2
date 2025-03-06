import React from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import Spocdropdown from "../../Dropdown/Spocdropdown";
import { decryptData } from "../../Utils/crypto/cryptoHelper";

export default function Editminutes({ editopen, setEditopen, formValues, setFormValues, fetchMinutes, showSnackbar }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setEditopen(false);
  };

  const handleSubmit = async () => {
    try {
      // Update API Call
      const api = process.env.REACT_APP_API;
      const res = await fetch(`${api}/api/minutes/updateminutes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({formValues}),
      });

      if (!res.ok) {
        showSnackbar('Minutes updation failed', 'error');
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      showSnackbar('Minutes updated Successfully!', 'success');
      fetchMinutes();
      setEditopen(false);
    } catch (error) {
      showSnackbar('Failed to update minutes', 'success');
      console.error(error);
      // alert("Failed to update minutes.");
    }
  };

  const handleDelete = async() => {
    try {
      const api = process.env.REACT_APP_API;
      const res = await fetch(`${api}/api/minutes/deleteminutes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({id: formValues.id}),
      });

      if (!res.ok) {
        showSnackbar('Minutes Deletion failed', 'error');
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      showSnackbar('Minutes Deleted Successfully!', 'success');
      fetchMinutes();
      setEditopen(false);
    } catch (error) {
      showSnackbar('Failed to update minutes', 'error');
      console.error(error);
      // alert("Failed to update minutes.");
    }
  }

  // console.log(formValues)

  return (
    <Dialog open={editopen} onClose={handleCancel} fullWidth>
      <DialogTitle>Edit Minutes</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Topic"
            name="topic"
            value={formValues.topic || ""}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={formValues.description || ""}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            required
          />
          <TextField
            label="Initial Date"
            name="initialDate"
            type="date"
            value={formValues.initialDate || ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
          <TextField
            label="Due Date"
            name="dueDate"
            type="date"
            value={formValues.dueDate || ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
          <Spocdropdown formValues={formValues} setFormValues={setFormValues}/>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleDelete} variant="contained" color="error">
          Delete
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
