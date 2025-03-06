import React, { useState } from "react";
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
import { useParams } from "react-router-dom";
import { decryptData } from "../../Utils/crypto/cryptoHelper";

export default function AddMinutes({ addopen, setAddopen, fetchMinutes, showSnackbar }) {
  const api = process.env.REACT_APP_API;
  const { uuid, shaid } = useParams();
  const [formValues, setFormValues] = useState({
    topic: "",
    description: "",
    initialDate: "",
    dueDate: "",
    projectLeader: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setAddopen(false);
    setFormValues({
      topic: "",
      description: "",
      initialDate: "",
      dueDate: "",
      projectLeader: "",
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${api}/api/minutes/addminutes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({
          uuid: uuid,
          shaid: shaid,
          formValues,
        }),
      });

      if (!res.ok) {
        setAddopen(false);
        showSnackbar("Failed to submit minutes data", 'error');
        throw new Error("Failed to submit minutes data");
      }

      const data = await res.json();
      showSnackbar('Minutes added successfully', 'success');
      fetchMinutes();
      setAddopen(false)
      setFormValues({
        topic: "",
        description: "",
        initialDate: "",
        dueDate: "",
        projectLeader: "",
      });
    } catch (error) {
      showSnackbar(error, 'error');
      console.error(error);
      setAddopen(false);
    }
  };

  const isFormComplete = Object.values(formValues).every(
    (value) => value.trim() !== ""
  );

  return (
    <div>
      <Dialog open={addopen} onClose={() => setAddopen(false)} fullWidth>
        <DialogTitle>Add Minutes</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="Topic"
              name="topic"
              value={formValues.topic}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Description"
              name="description"
              value={formValues.description}
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
              value={formValues.initialDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="Due Date"
              name="dueDate"
              type="date"
              value={formValues.dueDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <div>
              <Spocdropdown formValues={formValues} setFormValues={setFormValues}/>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!isFormComplete}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
