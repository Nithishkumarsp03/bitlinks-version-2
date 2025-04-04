import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoDataFound from "../../Components/Nodatafound/Nodatafound";
import { SyncLoader } from "react-spinners";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import useStore from "../../store/store";
import "../../Styles/project.css";

export default function UserProjects() {
  const api = process.env.REACT_APP_API;
  const { setLogopen } = useStore();
  const navigate = useNavigate();
  const role = decryptData(localStorage.getItem("role"));
  const name = decryptData(localStorage.getItem("name"));

  const [persondata, setPersondata] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [loading, setLoading] = useState(true); // Loader state

  const handleCardclick = (uuid, shaid) => {
    if (role === "admin")
      navigate(`/admin/${uuid}/person-details/minutes/${shaid}`);
    else if (role === "user" || role === "intern")
      navigate(`/${uuid}/person-details/minutes/${shaid}`);
  };

  const fetchPerson = async () => {
    setLoading(true); // Start loading
    try {
      const res = await fetch(`${api}/api/project/fetchuserdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({name})
      });

      if (res.status == 401) {
        setLogopen(true);
        return;
      }

      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }

      const responseData = await res.json();

      responseData.project.forEach((project) => {
        project.status =
          project.approved_percentage !== null &&
          parseFloat(project.approved_percentage) === 100.0
            ? "Completed"
            : "Pending";
      });

      if (Array.isArray(responseData.project)) {
        setPersondata(responseData.project);
        setFilteredData(responseData.project); // Set filtered data initially
      } else {
        setPersondata([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching person data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPerson();
  }, []);

  // Handle search functionality
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = persondata.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        project.domain.toLowerCase().includes(query) ||
        project.project_leader.toLowerCase().includes(query)
    );

    setFilteredData(filtered);
  };

  return (
    <div style={{ height: "100%", width: "100%", padding: "4px" }}>
      <div className="search-container-middle">
        <div>Projects</div>
        <hr />
        <input
          type="text"
          placeholder="Search Projects"
          value={searchQuery}
          onChange={handleSearch} // Call handleSearch on input change
        />
      </div>
      <div className="project-card-container">
        {loading ? (
          <div className="loader-component">
            <SyncLoader color="#2867B2" />
          </div>
        ) : filteredData.length === 0 ? (
          <div
            className="no-data-error"
            style={{ height: "100%", margin: "0" }}
          >
            <NoDataFound />
          </div>
        ) : (
          filteredData.map((key, index) => (
            <div
              key={index}
              className="project-card"
              onClick={() => handleCardclick(key.uuid, key.sha_id)}
            >
              <div className="status-bar">
                <div
                  style={{
                    backgroundColor:
                      key.status === "Completed" ? "forestGreen" : "",
                  }}
                >
                  {key.status}
                </div>
              </div>
              <div className="project-details">
                <div className="project-header">{key.title}</div>
                <div className="project-date">
                  {key.initial_date}{" "}
                  <span style={{ color: "black", fontWeight: "700" }}>-</span>{" "}
                  {key.due_date}
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
                  <div>{Math.round(key.approved_percentage)}%</div>{" "}
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width:
                        key.approved_percentage > 0
                          ? `${Math.round(key.approved_percentage)}%`
                          : "0%",
                    }}
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
    </div>
  );
}
