import React, { useEffect, useState, useRef } from "react";
import Profile from "../../Assets/user.jpg";
import { useNavigate } from "react-router-dom";
import NoDataFound from "../Nodatafound/Nodatafound";
import { FaFilter, FaPlus } from "react-icons/fa";
import FilterPopover from "../Filter/Filterpophover";
import { SyncLoader } from "react-spinners";

export default function Networks() {
  const api = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const [persondata, setPersondata] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState({});
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [loading, setLoading] = useState(true);
  const filterRef = useRef(null);

  const [visibleCount, setVisibleCount] = useState(20);
  const sentinelRef = useRef(null);

  const handleCardclick = (uuid) => {
    navigate(`/admin/${uuid}/person-details`);
  };

  const fetchPerson = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${api}/api/network/fetchdata`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error(`Error: ${res.status} - ${res.statusText}`);
      const responseData = await res.json();
      setPersondata(Array.isArray(responseData.data) ? responseData.data : []);
    } catch (error) {
      console.error("Error fetching person data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerson();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterPopover(false);
      }
    };
    if (showFilterPopover) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterPopover]);

  const handleApplyFilters = (criteria) => {
    setFilterCriteria(criteria);
  };

  const filteredData = persondata.filter((person) => {
    if (
      searchTerm &&
      !person.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 20, filteredData.length));
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }
    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [filteredData]);

  return (
    <div style={{ height: "100%", width: "100%", padding: "4px" }}>
      <div className="search-container-middle">
        <div>Networks</div>
        <hr />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <input
            type="text"
            placeholder="Search Connections"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div onClick={() => setShowFilterPopover(!showFilterPopover)}>
            <FaFilter style={{ cursor: "pointer" }} />
          </div>
        </div>
      </div>
      {showFilterPopover && (
        <div ref={filterRef}>
          <FilterPopover onApply={handleApplyFilters} onClose={() => setShowFilterPopover(false)} />
        </div>
      )}
      {loading ? (
        <div className="loader-component">
          <SyncLoader color="#2867B2" />
        </div>
      ) : filteredData.length === 0 ? (
        <div className="no-data-error">
            <NoDataFound />
          </div>
      ) : (
        <div className="person-contacts">
          {filteredData.slice(0, visibleCount).map((person, index) => (
            <div className="person-card" onClick={() => handleCardclick(person.uuid)} key={index}>
              <div className="plus-icon" onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/add-connection/${person.email}`);
              }}>
                <FaPlus />
              </div>
              <div className="image-details">
                <div className="profile-container">
                  <img src={person.profile ? `${api}${person.profile}` : Profile} alt="Profile" />
                </div>
                <div className="details-container">
                  <div className="name">{person.fullname}</div>
                  <div className="role">{person.role || ""}</div>
                </div>
              </div>
              <div className="person-info">
                <div className="card-links">
                  <div><i className="fa-solid fa-phone"></i><div>{person.phonenumber}</div></div>
                  <div><i className="fa-brands fa-linkedin"></i><div>{person.linkedinurl || "Not Mentioned"}</div></div>
                  <div><i className="fa-solid fa-envelope"></i><div>{person.email}</div></div>
                  <div>
                    <i className="fa-solid fa-user"></i>
                    <div>
                      <span style={{ fontWeight: "600", color: "grey" }}>Referred By</span>
                      <div>{person.sub_name}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={sentinelRef} style={{ height: "1px" }}></div>
        </div>
      )}
    </div>
  );
}
