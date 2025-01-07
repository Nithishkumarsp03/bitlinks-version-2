import React, { useEffect, useState } from "react";
import Profile from "../../Assets/user.jpg";
import { useNavigate } from "react-router-dom";

export default function Networks() {

  const api = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const [persondata, setPersondata] = useState([]);
  const handleCardclick = (uuid) => {
    navigate(`/admin/${uuid}/person-details`)
  }

  const fetchPerson = async () => {
    try {
      const res = await fetch(`${api}/api/network/fetchdata`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }
  
      const responseData = await res.json();
      // console.log(responseData);
  
      if (Array.isArray(responseData.data)) {
        setPersondata(responseData.data); // Update state with the array
      } else {
        setPersondata([]); // Fallback if data is not an array
      }
    } catch (error) {
      console.error("Error fetching person data:", error);
    }
  };  
  
  useEffect(() => {
    fetchPerson();
  },[])

  return (
    <div style={{ height: "100%", width: "100%", padding: "4px" }}>
      <div className="search-container-middle">
        <div>Networks</div>
        <hr />
        <input type="text" placeholder="Search Networks" />
      </div>
      <div className="person-contacts" >
        {persondata.map((person, index) => (
          <div className="person-card" onClick={() => handleCardclick(person.uuid)} key={index}>
          <div className="image-details">
            <br />
            <div className="profile-container">
              {/* <img src={`http://localhost:8000/${person.profile}`} alt="Profile" /> */}
              <img src={Profile} alt="Profile" />
              <img className="small-image" src="" alt="Small Image" />
            </div>
            <div className="details-container">
              <div className="name">{person.fullname}</div>
              <div className="role">{person.role || null}</div>
            </div>
          </div>
          <div className="person-info">
            <div className="card-links">
              <div>
                <i className="fa-solid fa-phone"></i>
                <div>{person.phonenumber}</div>
              </div>
              <div>
                <i className="fa-brands fa-linkedin"></i>
                <div>
                  {person.linkedinurl || "Not Mentioned"}
                </div>
              </div>
              <div>
                <i className="fa-solid fa-envelope"></i>
                <div>{person.email}</div>
              </div>
              <div>
                <i className="fa-solid fa-user"></i>
                <div style={{display: "flex", flexDirection: "column", alignItems: "start"}}>
                  <span style={{fontWeight: "600", color: "grey"}}>Reffered By </span>
                  <div>{person.sub_name}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        ))}
        {/* <div className="person-card"></div>
        <div className="person-card"></div>
        <div className="person-card"></div> */}
      </div>
    </div>
  );
}
