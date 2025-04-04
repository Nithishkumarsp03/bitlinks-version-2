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
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import useStore from "../../store/store";

export default function Birthdaywishes({
  birthdayopen,
  setBirthdayopen,
  birthdayEmail,
  showSnackbar,
  fetchNotification,
  id,
  recipient,
}) {
  const { setLogopen } = useStore();
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(
    "Wishing You a Very Happy Birthday! 🎉"
  );
  const [message, setMessage] = useState(
    `
Dear ${recipient}
    
On behalf of Bannari Amman Institute of Technology, Sathyamangalam, Erode, we extend our warmest wishes on your special day! 🎂✨

Your contributions to the industry have been truly inspiring, and we deeply appreciate your dedication and expertise. May this year bring you happiness, success, and good health.

We look forward to continued collaboration and learning from your invaluable insights. Have a fantastic birthday celebration!

Best Regards,
Bannari Amman Institute of Technology.
`
  );
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setBirthdayopen(false);
  };

  useEffect(() => {
    setEmail(birthdayEmail);
  }, [birthdayEmail]);

  useEffect(() => {
  }, [id]);

  useEffect(() => {
    if (recipient) {
      setMessage(
        `Dear ${recipient}
    
On behalf of Bannari Amman Institute of Technology, Sathyamangalam, Erode, we extend our warmest wishes on your special day! 🎂✨

Your contributions to the industry have been truly inspiring, and we deeply appreciate your dedication and expertise. May this year bring you happiness, success, and good health.

We look forward to continued collaboration and learning from your invaluable insights. Have a fantastic birthday celebration!

Best Regards,
Bannari Amman Institute of Technology.
`
      );
    }
  }, [recipient]); // Runs whenever recipient changes

  const handleSendEmail = async () => {
    setLoading(true);
    const token = decryptData(localStorage.getItem("token"));
    const requestBody = {
        email,
        subject,
        message,
        id,
        module: "dob", // This is different from "history"
    };

    console.log("Sending request with body:", requestBody);
    console.log("API URL:", `${process.env.REACT_APP_API}/api/notify/send-email`);
    console.log("Authorization Token:", token);

    try {
        const response = await fetch(
            `${process.env.REACT_APP_API}/api/notify/send-email`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            }
        );

        const result = await response.json();
        console.log("Response Status:", response.status);
        console.log("Response Body:", result);

        if (response.status === 401) {
            setLogopen(true);
            return;
        }

        if (response.ok) {
            setLoading(false);
            showSnackbar("Birthday wishes sent successfully!", "success");
            setBirthdayopen(false);
            fetchNotification();
        } else {
            setLoading(false);
            showSnackbar(`Failed to send email: ${result.error || "Unknown error"}`, "error");
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
