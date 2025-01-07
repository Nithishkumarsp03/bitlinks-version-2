import React, { useDeferredValue, useEffect, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Agent from "../../Assets/Agent.svg";
import Call from "../../Assets/Call.svg";
import File from "../../Assets/File.svg";
import Image from "../../Assets/Image.svg";
import Completed from "../../Assets/Completed.svg";
import Email from "../../Assets/Email.svg";
import Incomplete from "../../Assets/Incomplete.svg";
import Missedcall from "../../Assets/Missedcall.svg";
import MissedVisit from "../../Assets/MissedVisit.svg";
import Reschedule from "../../Assets/Reschedule.svg";
import RescheduledVisit from "../../Assets/RescheduledVisit.svg";
import Roundsms from "../../Assets/Roundsms.svg";
import Visited from "../../Assets/Visited.svg";
import Addhistory from "../../Dialog/Addhistory";
import "../../Styles/history.css";
import { useParams } from "react-router-dom";

const steps = [
  {
    type: "Call",
    timestamp: "2025-01-01 10:00 AM",
    agent: "USERNAME",
    description: "This is the first history log description.  ",
    purpose: "Sample purpose for log 1",
    image: Call, // Add image for each step
  },
  {
    type: "Visited",
    timestamp: "2025-01-02 02:30 PM",
    agent: "USERNAME",
    description: "This is the second history log description.",
    purpose: "Sample purpose for log 2",
    image: Email, // Add image for each step
  },
  {
    type: "Log 3",
    timestamp: "2025-01-03 05:45 PM",
    agent: "USERNAME",
    description: "This is the third history log description.",
    purpose: "Sample purpose for log 3",
    image: File, // Add image for each step
  },
  {
    type: "Log 4",
    timestamp: "2025-01-04 06:00 PM",
    agent: "USERNAME",
    description: "This is the fourth history log description.",
    purpose: "Sample purpose for log 4",
    image: Visited, // Add image for each step
  },
];

// Custom StepIcon to add image
const CustomStepIcon = ({ active, completed, icon, image }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "30px",
        height: "30px",
        borderRadius: "50%",
      }}
    >
      <img
        src={image}
        alt="step-icon"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
        }}
      />
    </div>
  );
};

export default function History() {
  const api = process.env.REACT_APP_API;
  const { uuid } = useParams();
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [addhistory, setAddhistory] = useState(false);
  const [historydata, setHistorydata] = useState([]);

  const handleOpen = (step) => {
    setDetails(step);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDetails(null);
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${api}/api/history/fetchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uuid }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }

      const responseData = await res.json();
      console.log(responseData);

      if (Array.isArray(responseData.history)) {
        // Map the history data to match the steps structure
        const mappedHistory = responseData.history.map((item) => ({
          type: item.type, // Type of the history log (e.g., 'Call', 'Visited')
          timestamp: item.datetime || item.scheduleddate, // Use 'datetime' or 'scheduleddate'
          agent: item.agent,
          description: item.note, // History note or description
          purpose: item.purpose,
          image: getImageByType(item.type), // A function to get the image based on the type
        }));

        setHistorydata(mappedHistory); // Update state with the mapped history data
      } else {
        setHistorydata([]); // Fallback if data is not an array
      }
    } catch (error) {
      console.error("Error fetching history data:", error);
    }
  };

  // Function to get the image for each type
  const getImageByType = (type) => {
    switch (type) {
      case "Call":
        return Call;
      case "Visited":
        return Visited;
      case "Missed Call":
        return Missedcall;
      case "Reschedule Call":
        return Reschedule;
      case "Rescheduled Visit":
        return RescheduledVisit;
      case "Log 3":
        return File;
      case "Log 4":
        return Incomplete;
      default:
        return Agent; // Default image for undefined types
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div
      style={{ height: "100%", width: "100%", overflowY: "scroll" }}
      className="history-data"
    >
      <div className="history-header">
        <div>History({steps.length})</div>
        <button onClick={() => setAddhistory(true)}>Add</button>
      </div>
      <div className="history-body">
        <Stepper orientation="vertical" activeStep={historydata.length}>
          {historydata.map((step, index) => (
            <Step key={index}>
              <StepLabel
                StepIconComponent={(props) => (
                  <CustomStepIcon
                    {...props}
                    image={step.image} // Pass the step's image here
                  />
                )}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Typography variant="h6">{step.type}</Typography>
                    <Typography variant="caption" style={{ color: "gray" }}>
                      {step.timestamp}
                    </Typography>
                  </div>
                  <Button
                    onClick={() => handleOpen(step)}
                    style={{ minWidth: "auto" }}
                  >
                    <ArrowForwardIosIcon />
                  </Button>
                </div>
              </StepLabel>
              <div style={{ padding: "0px 10px" }}>
                <Typography variant="body2" style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", gap: "2%" }}>
                    <img src={File} alt="" /> <div>{step.description}</div>
                  </div>
                </Typography>
                <Typography variant="body2">
                  <div
                    style={{ display: "flex", gap: "2%", marginBottom: "10px" }}
                  >
                    <img src={Agent} alt="" /> <div>{step.agent}</div>
                  </div>
                </Typography>
                {step.type === "Visited" ? (
                  <Typography variant="body2" style={{ marginBottom: "10px" }}>
                    <div style={{ display: "flex", gap: "2%" }}>
                      <img src={Image} alt="" />
                      <div>Image1</div>
                      <div>Image2</div>
                    </div>
                  </Typography>
                ) : null}
              </div>
            </Step>
          ))}
        </Stepper>
      </div>

      {/* Dialog for full details */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Log Details</DialogTitle>
        <DialogContent>
          {details && (
            <div>
              <Typography variant="h6">{details.label}</Typography>
              <Typography
                variant="body2"
                style={{ color: "gray", marginBottom: "10px" }}
              >
                {details.timestamp}
              </Typography>
              <Typography variant="body2">
                <strong>Agent:</strong> {details.agent}
              </Typography>
              <Typography variant="body2">
                <strong>Description:</strong> {details.description}
              </Typography>
              <Typography variant="body2">
                <strong>Purpose:</strong> {details.purpose}
              </Typography>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {addhistory ? (
        <Addhistory open={addhistory} setAddhistory={setAddhistory} />
      ) : null}
    </div>
  );
}
