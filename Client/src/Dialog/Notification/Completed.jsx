import React from 'react'
import {
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
  } from "@mui/material";
  import { decryptData } from '../../Utils/crypto/cryptoHelper';

export default function Completed({completedopen, setCompletedopen, module, action, id, fetchNotification}) {
    const api = process.env.REACT_APP_API;

    const handleConfirm = async() =>{
        try {
            const res = await fetch(`${api}/api/notify/taskcompleted/history-minutes`,{
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
                  },
                body: JSON.stringify({ id: id, module: module, action: action})
            });

            const data = await res.json();
            if(!res.ok){
                throw new Error(data.message);
            }
            fetchNotification()
            setCompletedopen(false)
        } catch (error) {
            console.error(error)
            setCompletedopen(false)
        }
    }


  return (
    <Dialog open={completedopen} onClose={()=>setCompletedopen(false)}>
        <DialogTitle>Are you sure you want to mark as complete this {module} event?</DialogTitle>
        <DialogActions>
            <button className='notification-action-buttons' onClick={() => setCompletedopen(false)}>Discard</button>
            <button className='notification-action-buttons' onClick={handleConfirm}>Confirm</button>
        </DialogActions>
    </Dialog>
  )
}
