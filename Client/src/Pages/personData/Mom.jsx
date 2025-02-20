import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddProject from "../../Dialog/Project/Addproject";
import CustomSnackbar from "../../Utils/snackbar/CustomsnackBar";
import NoDataFound from "../../Components/Nodatafound/Nodatafound";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import "../../Styles/mom.css";

export default function Mom() {
  const { uuid } = useParams();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const api = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const role = decryptData(localStorage.getItem("role"));
  const [addopen, setAddopen] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCardclick = (shaid) => {
    if (role === "admin") navigate(`/admin/${uuid}/person-details/minutes/${shaid}`);
    else if (role === "user") navigate(`/${uuid}/person-details/minutes/${shaid}`);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchPerson = async () => {
    try {
      const res = await fetch(`${api}/api/project/fetchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ uuid }),
      });

      if (!res.ok) {
        showSnackbar(`Error: ${res.status} - ${res.statusText}`, "error");
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }

      const responseData = await res.json();
      responseData.projectRows.forEach((project) => {
        project.status = project.approved_percentage === 100.0 ? "Completed" : "Pending";
      });

      setProjectData(responseData.projectRows);
      setFilteredProjects(responseData.projectRows);
    } catch (error) {
      showSnackbar("Error fetching person data", "error");
      console.error("Error fetching person data:", error);
    }
  };

  useEffect(() => {
    fetchPerson();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = projectData.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        project.domain.toLowerCase().includes(query) ||
        project.project_leader.toLowerCase().includes(query)
    );
    setFilteredProjects(filtered);
  };

  return (
    <div style={{ height: "100%", width: "100%", backgroundColor: "#edf3f7" }}>
      <div className="search-container-middle">
        <div className="projects-header-mom">
          <div>Projects</div>
          <button onClick={() => setAddopen(true)}>
            <i className="fa-solid fa-plus"></i> <div>Add</div>
          </button>
        </div>
        <hr />
        <input
          type="text"
          placeholder="Search Projects"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="project-card-container">
        {filteredProjects.length === 0 ? (
          <div className="no-data-error" style={{ height: "100%", margin: "0" }}>
            <NoDataFound />
          </div>
        ) : (
          filteredProjects.map((key, index) => (
            <div key={index} className="project-card" onClick={() => handleCardclick(key.sha_id)}>
              <div className="status-bar">
                <div style={{ backgroundColor: key.status === "Completed" ? "forestGreen" : "" }}>
                  {key.status}
                </div>
              </div>
              <div className="project-details">
                <div className="project-header">{key.title}</div>
                <div className="project-date">
                  {key.initial_date} <span style={{ color: "black", fontWeight: "700" }}>-</span> {key.due_date}
                </div>
              </div>
              <div className="project-domain">
                <div>Domain</div>
                <div>{key.domain}</div>
              </div>
              <hr />
              <div className="project-progress">
                <div className="progress-bar-value">
                  <div>Project Progress</div>
                  <div>{Math.round(key.approved_percentage)}%</div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: key.approved_percentage > 0 ? `${Math.round(key.approved_percentage)}%` : "0%" }}
                  ></div>
                </div>
                <div>
                  {key.approved_minutes}/{key.total_minutes}
                </div>
              </div>
              <div className="project-lead">
                <div>Project Leader</div>
                <div>
                  <i className="fa-solid fa-user"></i>
                  <div>{key.project_leader}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <AddProject open={addopen} setAddopen={setAddopen} fetchPerson={fetchPerson} showSnackbar={showSnackbar} />
      <CustomSnackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} />
    </div>
  );
}
