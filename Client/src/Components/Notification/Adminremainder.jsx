import React, { useEffect, useState } from "react";
import MinutesImg from "../../Assets/minutes.svg";
import RescheduleCall from "../../Assets/minutes.svg"; // Replace with your Reschedule Call image if different
import RescheduleVisit from "../../Assets/RescheduledVisit.svg";
import Visited from "../../Assets/Visited.svg";
import Tick from "../../Assets/tickicon.png"
import Birthdaywishes from "../../Dialog/Notification/Birthdaywishes";
import Snooze from "../../Dialog/Notification/Snooze";
import Completed from "../../Dialog/Notification/Completed";
import Thanksgiving from "../../Dialog/Notification/Visited";
import { useNavigate } from "react-router-dom";
import CustomSnackbar from "../../Utils/snackbar/CustomsnackBar";
import NoDataFound from "../Nodatafound/Nodatafound";
import { Button, Popover } from "@mui/material";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import "../../Styles/notification.css";

export default function Adminremainder() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();
  const role = decryptData(localStorage.getItem("role")); // In admin mode, role should be "admin"
  const [apiResponse, setApiResponse] = useState({});
  
  // Remove snoozeVisible state and use Popover anchor and current item instead
  const [snoozeAnchor, setSnoozeAnchor] = useState(null);
  const [currentSnoozeItem, setCurrentSnoozeItem] = useState(null);

  const [snoozeDuration, setSnoozeDuration] = useState(0);
  const [birthdayopen, setBirthdayopen] = useState(false);
  const [birthdayEmail, setBirthdayEmail] = useState("");
  const [visitedopen, setVisitedopen] = useState(false);
  const [thanksgivingemail, setThanksgivingemail] = useState("");
  const [snoozeopen, setSnoozeopen] = useState(false);
  const [completedopen, setCompletedopen] = useState(false);
  const [module, setModule] = useState("");
  const [days, setDays] = useState(0);
  const [id, setId] = useState(0);
  const [action, setAction] = useState("");
  const api = process.env.REACT_APP_API;

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // Fetch notifications from the admin endpoint
  const fetchNotification = async () => {
    try {
      const res = await fetch(`${api}/api/notify/admin/fetchdata`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      // console.log(data);
      setApiResponse(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, []);


  const handleBirthdayWishes = (e, item) => {
    e.stopPropagation();
    // console.log("Birthday Wishes Clicked - Email Sent Status:", item.emailSent);
    if (item.emailSent === 1) return; // Prevent opening if wishes are already sent
    setBirthdayEmail(item.email);
    setBirthdayopen(true);
    setId(item.person_id);
  };
  
  

  // Define navigation when a notification card is clicked.
  const handleCardclick = (item) => {
    // History-related notifications (snoozed or overdue history)
    if (
      item.source === "snoozed_notifications" ||
      item.source === "overdue_history"
    ) {
      navigate(`/admin/${item.uuid}/person-details/info-graph`);
    }
    // Minutes-related notifications (overdue minutes, completed minutes, or recently updated status)
    else if (
      item.source === "overdue_minutes" ||
      item.source === "completed_minutes" ||
      item.source === "recently_updated_status"
    ) {
      // navigate(`/admin/${item.uuid}/person-details/minutes/${item.sha_id}`);
    }
    // else if (item.source === "birthdays_today") {
    //   setBirthdayopen(true);
    // } 
    else {
      navigate("/404");
    }
  };

  // Renders an icon or image based on the notification type
  const renderLogo = (item) => {
    if (item.type) {
      switch (item.type) {
        case "minutes":
          return <img src={MinutesImg} alt="Minutes" />;
        case "Reschedule Call":
          return <img src={RescheduleCall} alt="Reschedule Call" />;
        case "Reschedule Visit":
          return <img src={RescheduleVisit} alt="Reschedule Visit" />;
        case "Visited":
          return <img src={Visited} alt="Visited" />;
        default:
          return <div>No logo for this type</div>;
      }
    }
    if (item.dob) {
      return <i className="fa-solid fa-cake-candles"></i>;
    }
    if (item.topic) {
      return <img src={MinutesImg} alt="Minutes" />;
    }
    return <div>No logo available</div>;
  };

  // Opens the snooze popover and saves the current item
  const handleSnooze = (e, item) => {
    e.stopPropagation();
    setSnoozeAnchor(e.currentTarget);
    setCurrentSnoozeItem(item);
  };

  // Handles selection of a snooze duration and opens the snooze dialog
  const handleSnoozeSelection = (e, item, days, module) => {
    e.stopPropagation();
    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + days);
    // console.log(
    //   `Snooze task for ${module} ${item.id || item.history_id} for ${days} days to ${newDueDate}`
    // );
    setModule(module);
    if (module === "history") setId(item.history_id);
    else if (module === "minutes") setId(item.id);
    setDays(days);
    setSnoozeopen(true);
  };

  // Handles an action (e.g., marking as completed, approving or rejecting) and opens the corresponding dialog
  const handleAction = (e, item, action, module) => {
    e.stopPropagation();
    setCompletedopen(true);
    setAction(action);
    setModule(module);
    if (module === "history") {
      setId(item.history_id);
    } else if (module === "minutes") {
      setId(item.id);
    }
    // console.log(
    //   `Action: ${module} ${action} for item ID: ${item.id || item.history_id}`
    // );
  };

  // Handles sending a Thanksgiving note
  const handleThankgiving = (e, item) => {
    setThanksgivingemail(item.contact_email);
    e.stopPropagation();
    setVisitedopen(true);
    setId(item.history_id);
  };

  // Render action buttons based on the notification type/status
  const renderActionButtons = (item) => {
    if (item.source === "snoozed_notifications") {
      return <div className="snoozed-message">Snoozed {item.snooze} times</div>;
    }

    // For completed minutes, render Approve and Reject buttons.
    if (item.source === "completed_minutes" && item.status === "Completed") {
      return (
        <div>
          <button
            onClick={(e) => handleAction(e, item, "Approved", "minutes")}
            className="notification-action-buttons"
          >
            Approve
          </button>
          <button
            onClick={(e) => handleAction(e, item, "Rejected", "minutes")}
            className="notification-action-buttons"
          >
            Reject
          </button>
        </div>
      );
    }

    if (item.type === "Visited") {
      return (
        <button
          className="notification-action-buttons"
          onClick={(e) => handleThankgiving(e, item)}
        >
          Send Thanksgiving Note
        </button>
      );
    }

    if (item.dob) {
      if(item.emailSent === 0){
        return (
          <button
            onClick={(e) => handleBirthdayWishes(e, item)}
            className="notification-action-buttons"
          >
            Send Birthday Wishes
          </button>
        );
      }
      else{
        return (
          <button
            onClick={(e) => handleBirthdayWishes(e, item)}
            className="notification-action-buttons-sent"
          >
            <div>Birthday wishes sent</div> <img src={Tick} alt="" width={"25px"}/>
          </button>
        );
      }
    }

    if (item.status === "Approved") {
      return <div className="minutes-confirmation approved">Approved!</div>;
    }
    if (item.status === "Rejected") {
      return <div className="minutes-confirmation rejected">Rejected!</div>;
    }

    if (item.type === "Reschedule Call" || item.type === "Reschedule Visit") {
      return (
        <div>
          <button
            onClick={(e) => handleAction(e, item, "complete", "history")}
            className="notification-action-buttons"
          >
            Mark as Completed
          </button>
          <button
            onClick={(e) => handleSnooze(e, item)}
            className="notification-action-buttons"
          >
            Snooze
          </button>
        </div>
      );
    }

    if (item.status === "Pending") {
      return (
        <div>
          <button
            onClick={(e) => handleAction(e, item, "Completed", "minutes")}
            className="notification-action-buttons"
          >
            Mark as Completed
          </button>
          <button
            onClick={(e) => handleSnooze(e, item)}
            className="notification-action-buttons"
          >
            Snooze
          </button>
        </div>
      );
    }

    return null;
  };

  // Merge notifications from all sources and sort by updated_at (most recent first)
  const notifications = [
    ...(apiResponse.snoozed_notifications || []).map((item) => ({
      ...item,
      source: "snoozed_notifications",
    })),
    ...(apiResponse.overdue_minutes || []).map((item) => ({
      ...item,
      source: "overdue_minutes",
    })),
    ...(apiResponse.overdue_history || []).map((item) => ({
      ...item,
      source: "overdue_history",
    })),
    ...(apiResponse.birthdays_today || []).map((item) => ({
      ...item,
      source: "birthdays_today",
    })),
    ...(apiResponse.completed_minutes || []).map((item) => ({
      ...item,
      source: "completed_minutes",
    })),
    ...(apiResponse.recently_updated_status || []).map((item) => ({
      ...item,
      source: "recently_updated_status",
    })),
  ].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        padding: "0px 7px",
        paddingRight: "0",
      }}
    >
      <div className="notification-header">Scheduled Notifications</div>
      <div className="notification-container">
        {notifications.length === 0 ? (
          <div className="no-data-error">
            <NoDataFound />
          </div>
        ) : (
          notifications.map((item, index) => (
            <div
              className="card-notification"
              onClick={() => handleCardclick(item)}
              key={index}
              style={{
                backgroundColor:
                  item.status === "Pending" &&
                  item.due_date &&
                  new Date(item.due_date) < new Date()
                    ? "moccasin" // Highlight overdue Pending tasks
                    : item.type === "Reschedule Call" ||
                      (item.type === "Reschedule Visit" &&
                        item.scheduleddate &&
                        new Date(item.scheduleddate) < new Date())
                    ? "moccasin"
                    : "white",
              }}
            >
              <div className="image-name-role">
                <div
                  className="notification-img"
                  style={{
                    backgroundImage: `url(${item.profile})`,
                    backgroundSize: "cover",
                  }}
                >
                  {renderLogo(item)}
                </div>
                <div style={{ width: "75%" }}>
                  <div className="contact-name">{item.fullname}</div>
                  <div className="contact-role">{item.note || item.topic}</div>
                  {renderActionButtons(item)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Global Snooze Popover */}
      <Popover
        open={Boolean(snoozeAnchor)}
        anchorEl={snoozeAnchor}
        onClose={() => {
          setSnoozeAnchor(null);
          setCurrentSnoozeItem(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <Button
            onClick={(e) => {
              if (currentSnoozeItem) {
                handleSnoozeSelection(
                  e,
                  currentSnoozeItem,
                  15,
                  (currentSnoozeItem.type === "Reschedule Call" ||
                    currentSnoozeItem.type === "Reschedule Visit")
                    ? "history"
                    : "minutes"
                );
              }
              setSnoozeAnchor(null);
              setCurrentSnoozeItem(null);
            }}
          >
            Snooze for 15 Days
          </Button>
          <Button
            onClick={(e) => {
              if (currentSnoozeItem) {
                handleSnoozeSelection(
                  e,
                  currentSnoozeItem,
                  30,
                  (currentSnoozeItem.type === "Reschedule Call" ||
                    currentSnoozeItem.type === "Reschedule Visit")
                    ? "history"
                    : "minutes"
                );
              }
              setSnoozeAnchor(null);
              setCurrentSnoozeItem(null);
            }}
          >
            Snooze for 30 Days
          </Button>
          <Button
            onClick={(e) => {
              if (currentSnoozeItem) {
                handleSnoozeSelection(
                  e,
                  currentSnoozeItem,
                  45,
                  (currentSnoozeItem.type === "Reschedule Call" ||
                    currentSnoozeItem.type === "Reschedule Visit")
                    ? "history"
                    : "minutes"
                );
              }
              setSnoozeAnchor(null);
              setCurrentSnoozeItem(null);
            }}
          >
            Snooze for 45 Days
          </Button>
        </div>
      </Popover>

      {/* Dialogs */}
      <Birthdaywishes
        birthdayopen={birthdayopen}
        setBirthdayopen={setBirthdayopen}
        birthdayEmail={birthdayEmail}
        showSnackbar={showSnackbar}
        fetchNotification={fetchNotification}
        id={id}
      />
      <Snooze
        snoozeopen={snoozeopen}
        setSnoozeopen={setSnoozeopen}
        module={module}
        id={id}
        days={days}
        fetchNotification={fetchNotification}
      />
      <Completed
        completedopen={completedopen}
        setCompletedopen={setCompletedopen}
        module={module}
        action={action}
        id={id}
        fetchNotification={fetchNotification}
      />
      <Thanksgiving
        visitedopen={visitedopen}
        setVisitedopen={setVisitedopen}
        thanksgivingemail={thanksgivingemail}
        showSnackbar={showSnackbar}
        id={id}
        fetchNotification={fetchNotification}
      />
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
}
