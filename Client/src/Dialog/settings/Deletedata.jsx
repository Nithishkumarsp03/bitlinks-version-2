import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
} from "@mui/material";
import { decryptData } from "../../Utils/crypto/cryptoHelper";

export default function Deletedata({tab, open, setOpen, fetchData, id}) {

    const api = process.env.REACT_APP_API;

    const deleteData = async() => {
        try {
            const res = await fetch(`${api}/api/settings/${tab}/deletedata`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
                },
                body: JSON.stringify({id})
            });

            const data = await res.json()
            if(!res.ok){
                throw new Error(data.message)
            }
            fetchData();
            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Are you sure you want to delete the data?</DialogTitle>
        <DialogActions>
            <Button variant="contained" color="error" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={deleteData}>Yes, Confirm</Button>
        </DialogActions>
    </Dialog>
  )
}
