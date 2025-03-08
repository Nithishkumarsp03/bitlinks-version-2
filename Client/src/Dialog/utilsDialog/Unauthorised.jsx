import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { IoWarningOutline } from "react-icons/io5"; // React Icons
import useStore from "../../store/store";

export default function UnauthorizedDialog({ open }) {
  const { setLogopen } = useStore();
  const logout = () => {
    setLogopen(false);
    localStorage.clear();
    window.location.href = "/login"; // Redirect to login page
  };
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <IoWarningOutline size={28} color="orange" />
          Session Expired
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography>Your session has expired. Please log in again.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={logout} variant="contained" color="primary" fullWidth>
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
}
