import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";

export default function Birthdaywishes({
  birthdayopen,
  setBirthdayopen,
  birthdayEmail,
  showSnackbar,
  fetchNotification,
  id
}) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Happy Birthday! 🎉");
  const [message, setMessage] = useState(
    "Wishing you a fantastic birthday filled with joy and success!"
  );
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setBirthdayopen(false);
  };

  useEffect(() => {
    setEmail(birthdayEmail);
  }, [birthdayEmail]);

  const handleSendEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/notify/send-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            email,
            subject,
            message,
            id,
            module: "dob"
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setLoading(false);
        showSnackbar("Birthday wishes sent successfully!", "success");
        setBirthdayopen(false);
        fetchNotification();
      } else {
        setLoading(false);
        showSnackbar("Failed to send email", "error");
        // alert("Failed to send email: " + result.error);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error sending email:", error);
      showSnackbar("An error occurred while sending the email.", "error");
    }
  };

  return (
    <Dialog open={birthdayopen} onClose={handleClose}>
      <DialogTitle>Send Happy Birthday Wishes!</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "100%" } }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Subject"
            variant="outlined"
            fullWidth
            margin="normal"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <TextField
            label="Message"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error" variant="contained">
          Cancel
        </Button>
        <Button
          onClick={handleSendEmail}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Please wait" : "Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
