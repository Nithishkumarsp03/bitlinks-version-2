import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import Persontab from "../../Components/Tabs/Persontab";
import "../../Styles/persondata.css";
import User from "../../Assets/user.jpg";
import { Outlet, useParams } from "react-router-dom";
import History from "./History";
import Profile from "./Profile";

export default function Persondata() {
  const api = process.env.REACT_APP_API;
  const [activeTab, setActiveTab] = useState("Profile");
  const [persondata, setPersondata] = useState([]);
  const { uuid } = useParams();

  const isFullWidth = activeTab === "M.O.M";

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${api}/api/person/fetchdata/uuid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uuid: uuid }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (Array.isArray(data.data)) {
        setPersondata(data.data); // Update state with the array
      } else {
        setPersondata([]); // Fallback if data is not an array
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", }}>
      <div className="header">
        <Header />
      </div>
      <div className="admin-body">
        <div className="tabs">
          <Persontab
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            uuid={uuid}
          />
        </div>
        {activeTab === "Profile" ? (
          <div className="profile-content" style={{width: "100%", height: "90%"}}>
            <Profile />
          </div>
        ) : (
          <div className="tab-content" style={{ display: "flex" }}>
            <div className="left-data" style={{ padding: "0px 10px" }}>
              {persondata.map((person, index) => (
                <div
                  className="person-card"
                  key={index}
                  style={{ border: "2px solid blue" }}
                >
                  <div className="image-details">
                    <br />
                    <div className="profile-container">
                      <img src={User} alt="Profile" />
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
                        <div>{person.linkedinurl || "Not Mentioned"}</div>
                      </div>
                      <div>
                        <i className="fa-solid fa-envelope"></i>
                        <div>{person.email}</div>
                      </div>
                      <div>
                        <i className="fa-solid fa-user"></i>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                          }}
                        >
                          <span style={{ fontWeight: "600", color: "grey" }}>
                            Referred By
                          </span>
                          <div>{person.sub_name}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="outcome-data">
                <div>Outcome:</div>
              </div>
            </div>
            <div
              className="middle-data"
              style={{
                flex: isFullWidth ? 1 : 2,
                display: isFullWidth ? "block" : "flex",
              }}
            >
              <Outlet />
            </div>
            {!isFullWidth && (
              <div className="right-data">
                <History />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
