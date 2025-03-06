import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Typography,
} from "@mui/material";
import Spocdropdown from "../../Dropdown/Spocdropdown";
import Switch from "@mui/material/Switch";

export default function ConflictResolutionDialog({
  open,
  conflicts,
  multiSelectFields,
  resolutions,
  onResolutionChange,
  onMultiSelectResolutionChange,
  onCancel,
  onConfirm,
  formValues,
  setFormValues,
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
    <Dialog open={open} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle>Resolve Merge Conflicts</DialogTitle>
      <DialogContent dividers>
        {conflicts.map(({ field, options }) => (
          <div key={field} style={{ marginBottom: "20px" }}>
            <Typography variant="subtitle1" gutterBottom>
              {field.replace(/_/g, " ").toUpperCase()}
            </Typography>
            {multiSelectFields.includes(field) ? (
              // For multi-select fields, use checkboxes.
              options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  control={
                    <Checkbox
                      checked={
                        resolutions[field]
                          ? resolutions[field].includes(option.id)
                          : false
                      }
                      onChange={() =>
                        onMultiSelectResolutionChange(field, option.id)
                      }
                    />
                  }
                  label={option.value || "N/A"}
                />
              ))
            ) : (
              // For other fields (including profile and visitingcard), use a radio group.
              <RadioGroup
                value={resolutions[field] || ""}
                onChange={(e) => onResolutionChange(field, e.target.value)}
              >
                {options.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    value={option.id}
                    control={<Radio />}
                    label={
                      field === "profile" || field === "visitingcard" ? (
                        <img
                          src={`${process.env.REACT_APP_API}${option.value}`}
                          alt={field}
                          style={{ maxWidth: "100px", maxHeight: "100px" }}
                        />
                      ) : (
                        option.value || "N/A"
                      )
                    }
                  />
                ))}
              </RadioGroup>
            )}
          </div>
        ))}
        <Spocdropdown formValues={formValues} setFormValues={setFormValues} />
        <div>
          <label>If you want to push to rank 0 please uncheck before creating a connection</label>
          <Switch checked={formValues.rank === -1} onChange={handleRankChange} />
          <label>Rank(0/-1)</label>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} color="primary">
          Confirm Merge
        </Button>
      </DialogActions>
    </Dialog>
  );
}
