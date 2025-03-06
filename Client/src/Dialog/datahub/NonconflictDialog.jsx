import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import Spocdropdown from "../../Dropdown/Spocdropdown";

export default function NonconflictDialog({
  nonConflictopen,
  setnonConflictopen,
  handleMergeComplete,
  formValues,
  setFormValues,
  fetchData, // Receive fetchData as a prop
  selectedContacts, // Receive selectedContacts as a prop
}) {
  const handleRankChange = (event) => {
    const isChecked = event.target.checked;
    // console.log("Switch toggled:", isChecked);
    setFormValues((prevData) => ({
      ...prevData,
      rank: isChecked ? -1 : 0,
    }));
  };

  useEffect(() => {
    console.log(formValues.rank);
  }, [formValues.rank]);

  return (
    <Dialog
      open={nonConflictopen}
      onClose={() => setnonConflictopen(false)}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Please select an Spoc and Rank!</DialogTitle>
      <DialogContent>
        <Spocdropdown formValues={formValues} setFormValues={setFormValues} />
        <div>
          <label>
            If you want to push to rank 0 please uncheck before creating a
            connection
          </label>
          <Switch
            checked={formValues.rank === -1}
            onChange={handleRankChange}
          />
          <label>Rank(0/-1)</label>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleMergeComplete(
              fetchData.filter((c) => selectedContacts.includes(c.temp_id)) // Pass selected contacts
            );
            setnonConflictopen(false); // Close dialog after merging
          }}
          disabled={!formValues.projectLeader}
        >
          Confirm Merge
        </Button>
      </DialogActions>
    </Dialog>
  );
}
