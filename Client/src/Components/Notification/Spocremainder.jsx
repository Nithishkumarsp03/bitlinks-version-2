import React, { useEffect, useState } from "react";
import MinutesImg from "../../Assets/minutes.svg";
import RescheduleCall from "../../Assets/Reschedule.svg"; // Add history logo
import RescheduleVisit from "../../Assets/RescheduledVisit.svg"; // Add visited logo
import Visited from "../../Assets/Visited.svg";
import Tick from "../../Assets/tickicon.png";
import Birthdaywishes from "../../Dialog/Notification/Birthdaywishes";
import Snooze from "../../Dialog/Notification/Snooze";
import Completed from "../../Dialog/Notification/Completed";
import Thanksgiving from "../../Dialog/Notification/Visited";
import { useNavigate } from "react-router-dom";
import NoDataFound from "../Nodatafound/Nodatafound";
import CustomSnackbar from "../../Utils/snackbar/CustomsnackBar";
import { Button, Popover } from "@mui/material";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import useStore from "../../store/store";
import "../../Styles/notification.css";

export default function Spocremainder() {
  const { setLogopen } = useStore();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();
  const role = decryptData(localStorage.getItem("role"));
  const [apiResponse, setApiResponse] = useState({});
  const [snoozeVisible, setSnoozeVisible] = useState(null); // Track which item the snooze catalog is open for
  const [snoozeDuration, setSnoozeDuration] = useState(0); // Store snooze duration
  const [birthdayopen, setBirthdayopen] = useState(false);
  const [birthdayEmail, setBirthdayEmail] = useState("");
  const [recipient, setRecipient] = useState("")
  const [visitedopen, setVisitedopen] = useState(false);
  const [snoozeopen, setSnoozeopen] = useState(false);
  const [completedopen, setCompletedopen] = useState(false);
  const [module, setModule] = useState("");
  const [days, setDays] = useState(0);
  const [id, setId] = useState(0);
  const [thanksgivingemail, setThanksgivingemail] = useState("");
  const [action, setAction] = useState("");
  const api = process.env.REACT_APP_API;
  const email = decryptData(localStorage.getItem("email"));

  const [snoozeAnchor, setSnoozeAnchor] = useState(null);
  const [currentSnoozeItem, setCurrentSnoozeItem] = useState(null);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleBirthdayWishes = (e, item) => {
    e.stopPropagation();
    if (item.emailSent === 1) return; // Prevent opening if wishes are already sent
    setBirthdayEmail(item.email);
    setBirthdayopen(true);
    setId(item.person_id);
    setRecipient(item.fullname);
  };

  // Fetch notification data
  const fetchNotification = async () => {
    try {
      const res = await fetch(`${api}/api/notify/fetchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ email }),
      });

      if (res.status == 401) {
        setLogopen(true);
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setApiResponse(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, [email]);

  const handleCardclick = (item) => {
    if (item.source === "historyInfo") {
      if (
        item.type === "Reschedule Call" ||
        item.type === "Reschedule Visit" ||
        item.type === "Visited"
      ) {
        if (role === "admin") {
          navigate(`/admin/${item.uuid}/person-details/info-graph`);
        } else if (role === "user") {
          navigate(`/${item.uuid}/person-details/info-graph`);
        }
      }
    } else if (item.source === "minutesInfo") {
      if (
        item.status === "Approved" ||
        item.status === "Rejected" ||
        item.status === "Pending"
      ) {
        if (role === "admin") {
          navigate(`/admin/${item.uuid}/person-details/minutes/${item.sha_id}`);
        } else if (role === "user") {
          navigate(`/${item.uuid}/person-details/minutes/${item.sha_id}`);
        }
      }
    } else if (item.source === "dobInfo") {
    } else {
      navigate("/404");
    }
  };

  // Render action buttons dynamically
  const renderActionButtons = (item) => {
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
      if (item.emailSent === 0) {
        return (
          <button
            onClick={(e) => handleBirthdayWishes(e, item)}
            className="notification-action-buttons"
          >
            Send Birthday Wishes
          </button>
        );
      } else {
        return (
          <button
            onClick={(e) => handleBirthdayWishes(e, item)}
            className="notification-action-buttons-sent"
          >
            <div>Birthday wishes sent</div>{" "}
            <img src={Tick} alt="" width={"25px"} />
          </button>
        );
      }
    }

    if (item.type === "Reschedule Call" || item.type === "Reschedule Visit") {
      return (
        <div style={{display: "flex", gap: "5px"}}>
          <button
            onClick={(e) => handleAction(e, item, "Completed", "history")}
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

    if (item.status === "Approved") {
      return <div className="minutes-confirmation approved">Approved!</div>;
    }
    if (item.status === "Rejected") {
      return <div className="minutes-confirmation rejected">Rejected!</div>;
    }

    if (item.status === "Pending") {
      return (
        <div style={{display: "flex", gap: "5px"}}>
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

  const renderLogo = (item) => {
    if (item.type) {
      // Handle historyInfo where `type` is available
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

    // Handle dobInfo (default to birthday icon)
    if (item.dob) {
      return <i className="fa-solid fa-cake-candles"></i>;
    }

    // Handle minutesInfo (default to minutes icon)
    if (item.topic) {
      return <img src={MinutesImg} alt="Minutes" />;
    }

    // Fallback if nothing matches
    return <div>No logo available</div>;
  };

  const handleSnooze = (e, item) => {
    e.stopPropagation();
    const id = item.id || item.history_id;
    setSnoozeAnchor(e.currentTarget);
    setCurrentSnoozeItem(item);
  };

  const handleSnoozeSelection = (e, item, days, module) => {
    e.stopPropagation();
    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + days); // Calculate new due date
    // console.log(
    //   `Snooze task for ${module} ${
    //     item.id || item.history_id
    //   } for ${days} days to ${newDueDate}`
    // );
    setSnoozeVisible(null); // Close the dropdown after selection
    setModule(module);
    if (module === "history") setId(item.history_id);
    else if (module === "minutes") setId(item.id);
    else {
    }
    setDays(days);
    setSnoozeopen(true);
  };

  const handleAction = (e, item, action, module) => {
    e.stopPropagation();
    setCompletedopen(true);
    setModule(module);
    setAction(action);
    if (module === "history") {
      setId(item.history_id);
    } else if (module === "minutes") {
      setId(item.id);
    } else {
    }
    // console.log(
    //   `Action: ${module} ${action} for item ID: ${item.id || item.history_id}`
    // );
  };

  const handleThankgiving = (e, item) => {
    e.stopPropagation();
    setVisitedopen(true);
    setId(item.history_id);
    setThanksgivingemail(item.email);
    setRecipient(item.fullname);
  };

  // Combine and filter notifications
  const notifications = [
    ...(apiResponse.dobInfo || []).map((item) => ({
      ...item,
      source: "dobInfo",
    })),
    ...(apiResponse.historyInfo || []).map((item) => ({
      ...item,
      source: "historyInfo",
    })),
    ...(apiResponse.minutesInfo || []).map((item) => ({
      ...item,
      source: "minutesInfo",
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
                    ? "moccasin" // Mild red for overdue Pending tasks
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
                  currentSnoozeItem.type === "Reschedule Call" ||
                    currentSnoozeItem.type === "Reschedule Visit"
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
                  currentSnoozeItem.type === "Reschedule Call" ||
                    currentSnoozeItem.type === "Reschedule Visit"
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
                  currentSnoozeItem.type === "Reschedule Call" ||
                    currentSnoozeItem.type === "Reschedule Visit"
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

      <Birthdaywishes
        birthdayopen={birthdayopen}
        setBirthdayopen={setBirthdayopen}
        birthdayEmail={birthdayEmail}
        showSnackbar={showSnackbar}
        fetchNotification={fetchNotification}
        recipient={recipient}
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
        id={id}
        fetchNotification={fetchNotification}
        thanksgivingemail={thanksgivingemail}
        showSnackbar={showSnackbar}
        recipient={recipient}
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
