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
import Minutes from "../../Assets/minutes.svg";
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
import Addhistory from "../../Dialog/History/Addhistory";
import "../../Styles/history.css";
import { useParams } from "react-router-dom";
import NoDataFound from "../../Components/Nodatafound/Nodatafound";
import CustomSnackbar from "../../Utils/snackbar/CustomsnackBar";
import { decryptData } from "../../Utils/crypto/cryptoHelper";

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
  const [imageOpen, setImageopen] = useState(false);
  const [details, setDetails] = useState(null);
  const [addhistory, setAddhistory] = useState(false);
  const [historydata, setHistorydata] = useState([]);
  const [visitedImage, setVisitedimage] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (step) => {
    setDetails(step);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDetails(null);
  };

  const handleImageclick = (imagepath) => {
    // console.log(imagepath);
    setImageopen(true);
    setVisitedimage(imagepath);
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${api}/api/history/fetchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ uuid }),
      });

      if (!res.ok) {
        showSnackbar(
          `History - Error: ${res.status} - ${res.statusText}`,
          `error`
        );
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }

      const responseData = await res.json();
      // console.log(responseData);

      if (Array.isArray(responseData.history)) {
        // Map the history data to match the steps structure
        const mappedHistory = responseData.history.map((item) => ({
          type: item.type, // Type of the history log (e.g., 'Call', 'Visited')
          timestamp: item.datetime || item.scheduleddate, // Use 'datetime' or 'scheduleddate'
          agent: item.agent,
          description: item.note, // History note or description
          purpose: item.purpose,
          visited1: item.visited1,
          visited2: item.visited2,
          image: getImageByType(item.type), // A function to get the image based on the type
        }));

        setHistorydata(mappedHistory);
      } else {
        setHistorydata([]); // Fallback if data is not an array
      }
    } catch (error) {
      showSnackbar(error.message, "error");
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
      case "Minutes":
        return Minutes;
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
        <div>History</div>
        <button onClick={() => setAddhistory(true)}>Add</button>
      </div>
      <div className="history-body">
        <Stepper orientation="vertical" activeStep={historydata.length}>
          {historydata.length === 0 ? (
            <div className="no-data-error">
              <NoDataFound />
            </div>
          ) : (
            historydata.map((step, index) => (
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
                      style={{
                        display: "flex",
                        gap: "2%",
                        marginBottom: "10px",
                      }}
                    >
                      <img src={Agent} alt="" /> <div>{step.agent}</div>
                    </div>
                  </Typography>
                  {step.type === "Visited" ? (
                    <Typography
                      variant="body2"
                      style={{ marginBottom: "10px" }}
                    >
                      <div style={{ display: "flex", gap: "3%" }}>
                        <img src={Image} alt="" />
                        <div
                          onClick={() => handleImageclick(step.visited1)}
                          className="image-bar"
                        >
                          Image1
                        </div>
                        <div
                          onClick={() => handleImageclick(step.visited2)}
                          className="image-bar"
                        >
                          Image2
                        </div>
                      </div>
                    </Typography>
                  ) : null}
                </div>
              </Step>
            ))
          )}
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

      <Dialog open={imageOpen} onClose={() => setImageopen(false)} fullWidth>
        {/* <p>{`${api}${visitedImage}`}</p> */}
        <img src={`${api}${visitedImage}`} alt="" className="visited-image" />
      </Dialog>

      {addhistory ? (
        <Addhistory
          open={addhistory}
          setAddhistory={setAddhistory}
          showSnackbar={showSnackbar}
          fetchHistory={fetchHistory}
        />
      ) : null}

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
}
