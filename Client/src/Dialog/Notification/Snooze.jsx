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
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import useStore from "../../store/store";

export default function Snooze({
  snoozeopen,
  setSnoozeopen,
  id,
  module,
  days,
  fetchNotification
}) {
  const {setLogopen} = useStore();
  const api = process.env.REACT_APP_API;

  const handleConfirm = async () => {
    try {
      const res = await fetch(`${api}/api/notify/snooze/history-minutes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ id: id, module: module, days: days }),
      });

      if(res.status == 401){
        setLogopen(true);
        return;
      }

      const data = await res.json();

      if(!res.ok){
        throw new Error(data.message);
      }
      setSnoozeopen(false);
      fetchNotification()
    } catch (error) {
        console.error(error);
        setSnoozeopen(false);
    }
  };

  return (
    <Dialog open={snoozeopen} onClose={() => setSnoozeopen(false)}>
      <DialogTitle>
        Are you sure you want to Snooze this {module} event for {days} days?
      </DialogTitle>
      <DialogActions>
        <button className="notification-action-buttons" onClick={() => setSnoozeopen(false)}>Discard</button>
        <button className="notification-action-buttons" onClick={handleConfirm}>
          Confirm
        </button>
      </DialogActions>
    </Dialog>
  );
}
