import React, { useEffect, useState } from "react";
import Profile from "../../Assets/user.jpg";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import useStore from "../../store/store";

export default function Spoc() {
  const api = process.env.REACT_APP_API;
  const { setLogopen } = useStore();
  const navigate = useNavigate();
  const [persondata, setPersondata] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [loading, setLoading] = useState(true); // Loader state

  const handleCardclick = (uuid) => {
    navigate(`/admin/${uuid}/person-details`);
  };

  const fetchPerson = async () => {
    setLoading(true); // Start loading
    try {
      const res = await fetch(`${api}/api/spoc/fetchdata`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
      });

      if (res.status == 401) {
        setLogopen(true);
        return;
      }

      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }

      const responseData = await res.json();

      if (Array.isArray(responseData.data)) {
        setPersondata(responseData.data);
        setFilteredData(responseData.data); // Set filtered data initially
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
      (person) =>
        person.fullname.toLowerCase().includes(query) ||
        person.phonenumber.includes(query) ||
        person.email.toLowerCase().includes(query)
    );

    setFilteredData(filtered);
  };

  return (
    <div style={{ height: "100%", width: "100%", padding: "4px" }}>
      <div className="search-container-middle">
        <div>Spoc</div>
        <hr />
        <input
          type="text"
          placeholder="Search Spoc"
          value={searchQuery}
          onChange={handleSearch} // Call handleSearch on input change
        />
      </div>
      <div className="person-contacts">
        {loading ? (
          <div className="loader-component">
            <SyncLoader color="#2867B2" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="no-data-error">No Spoc Data Found</div>
        ) : (
          filteredData.map((person, index) => (
            <div
              className="person-card"
              onClick={() => handleCardclick(person.uuid)}
              key={index}
            >
              <div
                className="plus-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/add-connection/${person.email}`);
                }}
              >
                <FaPlus />
              </div>
              <div className="image-details">
                <br />
                <div className="profile-container">
                  <img
                    src={`${api}${person.profile}` || Profile}
                    alt="Profile"
                  />
                  <img className="small-image" src="" alt="Small Image" />
                </div>
                <div className="details-container">
                  <div className="name">{person.fullname}</div>
                  <div className="role">SPOC</div>
                </div>
              </div>
              <div className="person-info">
                <div className="details-box">
                  <div>
                    <div>Inactive users by staff</div>
                    <div>{person.inactive_count}</div>
                  </div>
                  <div>
                    <div>Snoozed users by staff</div>
                    <div>{person.snooze_count}</div>
                  </div>
                </div>
                <div className="card-links" style={{ marginTop: "10px" }}>
                  <div>
                    <i className="fa-solid fa-phone"></i>
                    <div>{person.phonenumber}</div>
                  </div>
                  <div>
                    <i className="fa-brands fa-linkedin"></i>
                    <div>{person.linkedinurl || "Not Mentioned"}</div>
                  </div>
                  <div>
                    <i className="fa-solid fa-envelope"></i>
                    <div>{person.email}</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
