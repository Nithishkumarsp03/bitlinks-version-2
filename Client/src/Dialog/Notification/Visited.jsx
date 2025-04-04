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
import { Receipt } from "lucide-react";

export default function Thanksgiving({
  visitedopen,
  setVisitedopen,
  id,
  showSnackbar,
  thanksgivingemail,
  fetchNotification, recipient
}) {
  const {setLogopen} = useStore();
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Thank You for Visiting Bannari Amman institute of Technology");
  const [message, setMessage] = useState(
    `Dear ${recipient}

On behalf of Bannari Amman Institute of Technology, Sathyamangalam, Erode, we sincerely thank you for taking the time to visit us and share your valuable insights. Your presence and expertise have greatly enriched our students' learning experience.

Your words of wisdom and industry knowledge have inspired us all, and we truly appreciate your support in bridging the gap between academia and industry. We look forward to future collaborations and the opportunity to welcome you again.

Once again, thank you for your time and contribution.

Best regards,
Bannari amman institute of technology.`
  );
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setVisitedopen(false);
  };

  useEffect(() => {
    setEmail(thanksgivingemail);
  }, [thanksgivingemail]);

  useEffect(() => {
    if (recipient) {
      setMessage(
        `Dear ${recipient}
  
  On behalf of Bannari Amman Institute of Technology, Sathyamangalam, Erode, we sincerely thank you for taking the time to visit us and share your valuable insights. Your presence and expertise have greatly enriched our students' learning experience.
  
  Your words of wisdom and industry knowledge have inspired us all, and we truly appreciate your support in bridging the gap between academia and industry. We look forward to future collaborations and the opportunity to welcome you again.
  
  Once again, thank you for your time and contribution.
  
  Best regards,
  Bannari Amman Institute of Technology.`
      );
    }
  }, [recipient]); // Runs whenever recipient changes

  const handleSendEmail = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/notify/send-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
          },
          body: JSON.stringify({
            email,
            subject,
            message,
            id,
            module: "history"
          }),
        }
      );

      if(response.status == 401){
        setLogopen(true);
        return;
      }

      const result = await response.json();
      if (response.ok) {
        setLoading(false)
        showSnackbar("Thanks giving note sent successfully!", "success");
        setVisitedopen(false);
        fetchNotification();
      } else {
        setLoading(false)
        showSnackbar("Failed to send email", "error");
        // alert("Failed to send email: " + result.error);
      }
    } catch (error) {
      setLoading(false)
      console.error("Error sending email:", error);
      showSnackbar("An error occurred while sending the email.", "error");
    }
  };

  return (
    <Dialog open={visitedopen} setVisitedopen={setVisitedopen}>
      <DialogTitle>Send a ThanksGiving note!</DialogTitle>
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
        <Button onClick={handleSendEmail} color="primary" variant="contained" disabled={loading}>
          {loading? "Please wait": "Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
