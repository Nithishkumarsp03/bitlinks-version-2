import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NoDataFound from "../Nodatafound/Nodatafound";
import { SyncLoader } from "react-spinners";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import useStore from "../../store/store";
import "../../Styles/project.css";

export default function Projects() {
  const api = process.env.REACT_APP_API;
  const { setLogopen } = useStore();
  const navigate = useNavigate();
  const role = decryptData(localStorage.getItem("role"));

  const [projects, setProjects] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  const lastProjectRef = useCallback(node => {
    if (loading || isFetchingMore || !hasMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchProjects(page + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, isFetchingMore, hasMore, page]);

  const handleCardclick = (uuid, shaid) => {
    if (role === "admin")
      navigate(`/admin/${uuid}/person-details/minutes/${shaid}`);
    else if (role === "user")
      navigate(`/${uuid}/person-details/minutes/${shaid}`);
  };

  const fetchProjects = async (pageNum = 1) => {
    if (isFetchingMore) return;
    if (pageNum === 1) setLoading(true);
    else setIsFetchingMore(true);

    try {
      const res = await fetch(`${api}/api/project/fetchalldata?page=${pageNum}&limit=${limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
      });

      if (res.status === 401) {
        setLogopen(true);
        return;
      }

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const responseData = await res.json();
      const fetched = responseData.project || [];

      fetched.forEach(p => {
        p.status = parseFloat(p.approved_percentage) === 100.0 ? "Completed" : "Pending";
      });

      if (pageNum === 1) {
        setProjects(fetched);
        setFilteredData(fetched);
      } else {
        setProjects(prev => [...prev, ...fetched]);
        setFilteredData(prev => [...prev, ...fetched]);
        setPage(pageNum);
      }

      if (fetched.length < limit) setHasMore(false);

    } catch (error) {
      console.error("Error fetching project data:", error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchProjects(1);
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = projects.filter(
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
          onChange={handleSearch}
        />
      </div>

      <div className="project-card-container">
        {loading ? (
          <div className="loader-component">
            <SyncLoader color="#2867B2" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="no-data-error" style={{ height: "100%", margin: "0" }}>
            <NoDataFound />
          </div>
        ) : (
          filteredData.map((key, index) => {
            const isLast = index === filteredData.length - 1;
            return (
              <div
                key={index}
                ref={isLast ? lastProjectRef : null}
                className="project-card"
                onClick={() => handleCardclick(key.uuid, key.sha_id)}
              >
                <div className="status-bar">
                  <div style={{ backgroundColor: key.status === "Completed" ? "forestGreen" : "" }}>
                    {key.status}
                  </div>
                </div>
                <div className="project-details">
                  <div className="project-header">{key.title}</div>
                  <div className="project-date">
                    {key.initial_date} <span style={{ color: "black", fontWeight: "700" }}>-</span>{" "}
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
                    <div>{Math.round(key.approved_percentage)}%</div>
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
            );
          })
        )}
        {isFetchingMore && (
  <div
    style={{
      padding: "1rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "80px", // Add height to vertically center
      width: "100%",
    }}
  >
    <SyncLoader size={12} color="#2867B2" />
  </div>
)}
      </div>
    </div>
  );
}
