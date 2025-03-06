import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddMinutes from "../../Dialog/Minutes/Addminutes";
import Editminutes from "../../Dialog/Minutes/Editminutes";
import NoDataFound from "../../Components/Nodatafound/Nodatafound";
import CustomSnackbar from "../../Utils/snackbar/CustomsnackBar";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import "../../Styles/minutes.css";

export default function Minutes() {
  const { shaid, uuid } = useParams();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [minutes, setMinutes] = useState([]);
  const [projectTitle, setProjecttitle] = useState("");
  const [addopen, setAddopen] = useState(false);
  const [editopen, setEditopen] = useState(false);
  const [formValues, setFormValues] = useState([]);
  const role = decryptData(localStorage.getItem("role"));
  const api = process.env.REACT_APP_API;

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchMinutes = async () => {
    try {
      const res = await fetch(`${api}/api/minutes/fetchminutes/uuid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ uuid: uuid, shaid: shaid }),
      });

      if (!res.ok) {
        showSnackbar(`HTTP error! status: ${res.status}`, "error");
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      // console.log(data);
      if (data.minutes) setMinutes(data?.minutes);
      // setMinutes(data?.minutes)
      setProjecttitle(data?.title);
    } catch (error) {
      showSnackbar(error, "error");
      console.error(error);
    }
  };

  const getColorstatus = (status) => {
    switch (status) {
      case "Pending":
        return { bg: "#fff2c5", color: "#E7A23A" };
      case "Completed":
      case "Approved":
      case "Rejected":
        return { bg: "#c8ffde", color: "#0E7C3A" };
      case "Rejected":
        return { bg: "#ef5555", color: "red" };
      default:
        return { bg: "gray", color: "gray" }; // Default color for undefined statuses
    }
  };

  const handleEdit = (minute) => {
    setFormValues({
      ...minute,
      initialDate: minute.initial_date, // Map to field names in your API response
      dueDate: minute.due_date,
      projectLeader: minute.handler,
    });
    setEditopen(true);
  };

  const handleButtonclick = async (minute, status) => {
    // console.log(minute.id, status);
    try {
      const res = await fetch(`${api}/api/minutes/updatestatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ id: minute.id, status: status }),
      });

      if (!res.ok) {
        showSnackbar(`HTTP error! status: ${res.status}`, "error");
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      showSnackbar("Minutes Updation done Successfully!", "success");
      const data = await res.json();
      fetchMinutes();
    } catch (error) {
      showSnackbar(error, "error");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMinutes();
  }, []);

  return (
    <div style={{ height: "100%", width: "100%", backgroundColor: "edf3f7" }}>
      <div className="search-container-middle">
        <div className="projects-header-mom">
          <div>Minutes of Project - {projectTitle}</div>
          <button onClick={() => setAddopen(true)}>
            <i class="fa-solid fa-plus"></i> <div>Add</div>
          </button>
        </div>
        <hr />
        <input type="text" placeholder="Search Projects" />
      </div>
      <div className="project-card-container">
        {minutes.length === 0 ? (
          <div className="no-data-error">
            <NoDataFound />
          </div>
        ) : (
          minutes.map((key, index) => (
            <div className="minute-card" key={index}>
              <div className="minutes-header">
                <div>
                  {key.status === "Pending" && (
                    <div
                      className="minutes-status"
                      style={{
                        backgroundColor: `${getColorstatus(key.status).bg}`,
                        color: `${getColorstatus(key.status).color}`,
                      }}
                    >
                      <div>
                        <i class="fa-solid fa-circle-exclamation"></i>
                      </div>
                      <div>Pending</div>
                    </div>
                  )}
                  {key.status === "Completed" && (
                    <div
                      className="minutes-status"
                      style={{
                        backgroundColor: `${getColorstatus(key.status).bg}`,
                        color: `${getColorstatus(key.status).color}`,
                      }}
                    >
                      <div>Completed</div>
                    </div>
                  )}
                  {key.status === "Approved" && (
                    <div
                      className="minutes-status"
                      style={{
                        backgroundColor: `${getColorstatus(key.status).bg}`,
                        color: `${getColorstatus(key.status).color}`,
                      }}
                    >
                      <div>Completed</div>
                    </div>
                  )}
                  {key.status === "Rejected" && (
                    <div
                      className="minutes-status"
                      style={{
                        backgroundColor: `${getColorstatus(key.status).bg}`,
                        color: `${getColorstatus(key.status).color}`,
                      }}
                    >
                      <div>Completed</div>
                    </div>
                  )}
                </div>
                <div>
                  Dues <span>{key.due_date}</span>
                </div>
              </div>
              <div className="minutes-action">
                <div className="topic">{key.topic}</div>
                <div className="topic-description">{key.description}</div>

                <div className="action-buttons">
                  {key.status === "Completed" && role === "admin" ? (
                    <div>
                      <button
                        onClick={() => handleButtonclick(key, "Approved")}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleButtonclick(key, "Rejected")}
                      >
                        Reject
                      </button>
                      <div onClick={() => handleEdit(key)}>
                        <i class="fa-solid fa-pen-to-square"></i>
                      </div>
                    </div>
                  ) : key.status === "Approved" ? (
                    <div style={{ color: "forestgreen" }}>Approved!</div>
                  ) : key.status === "Rejected" ? (
                    <div style={{ color: "red" }}>Rejected!</div>
                  ) : key.status === "Pending" ? (
                    <div>
                      <button
                        onClick={() => handleButtonclick(key, "Completed")}
                      >
                        Mark as Completed
                      </button>
                      <div onClick={() => handleEdit(key)}>
                        <i class="fa-solid fa-pen-to-square"></i>
                      </div>
                    </div>
                  ) : null}

                  {/* <div>
                    <button>Mark as complete</button>
                    <button>Abandon</button>
                  </div> */}
                </div>
                <div className="assigned-faculty">
                  <div>Assigned for</div>
                  <div>
                    <i className="fa-solid fa-user"></i>
                    <div>{key.handler}</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <AddMinutes
        addopen={addopen}
        setAddopen={setAddopen}
        fetchMinutes={fetchMinutes}
        showSnackbar={showSnackbar}
      />
      <Editminutes
        editopen={editopen}
        setEditopen={setEditopen}
        formValues={formValues}
        setFormValues={setFormValues}
        fetchMinutes={fetchMinutes}
        showSnackbar={showSnackbar}
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
