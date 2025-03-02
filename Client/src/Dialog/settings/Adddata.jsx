import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import { Input } from "@mui/joy";
import { decryptData } from "../../Utils/crypto/cryptoHelper";

export default function Adddata({ tab, open, setOpen, fetchData }) {
  const [value, setValue] = useState("");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [role, setrole] = useState("user");
  const api = process.env.REACT_APP_API;

  const Adddata = async () => {
    try {
      const payload = tab === "login" ? { name, email, role } : { value };
  
      const res = await fetch(`${api}/api/settings/${tab}/adddata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
      if(!res.ok){
        throw new Error(data.err);
      }
      fetchData();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };  

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Add data for {tab}</DialogTitle>
      {tab === "login" ? (
        <DialogContent style={{display: "flex", flexDirection: "column", gap: "10px"}}>
          <div>
            <label htmlFor="">Enter the name</label>
            <Input
              placeholder="Ex - John Doe"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="">Enter the email</label>
            <Input
              placeholder="bitlinks@bitsathy.ac.in"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
          </div>
          <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
            <label htmlFor="">choose the role</label>
            <label>
              <input
                type="radio"
                value="user"
                checked={role === "user"}
                onChange={(e) => setrole(e.target.value)}
                name="role"
              />
              User
            </label>
            <label>
              <input
                type="radio"
                value="guest"
                checked={role === "guest"}
                onChange={(e) => setrole(e.target.value)}
                name="role"
              />
              Guest
            </label>
          </div>
        </DialogContent>
      ) : (
        <DialogContent>
          <Input
            placeholder="Enter the data"
            name="data"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus={true}
            autoComplete="off"
          />
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Close</Button>
        <Button onClick={Adddata}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
