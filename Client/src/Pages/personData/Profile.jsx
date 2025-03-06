import React, { useEffect, useState } from "react";
import "../../Styles/profile.css";
import ProfileImg from "../../Assets/user.jpg";
import { useParams } from "react-router-dom";
import Graph from "../../Components/Graph/Graph";
import { decryptData } from "../../Utils/crypto/cryptoHelper";

export default function Profile() {
  const api = process.env.REACT_APP_API;
  const { uuid } = useParams();
  // console.log(uuid)
  const [persondata, setPersondata] = useState([]);

  const fetchPersonData = async () => {
    try {
      const res = await fetch(`${api}/api/person/fetchpersondata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ uuid: uuid }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setPersondata(data.data[0]);
      // console.log(data);
    } catch (error) {
      console.error("Error fetching person data:", error);
    }
  };

  useEffect(() => {
    fetchPersonData();
  }, [uuid]);

  return (
    <div className="profile-data">
      <div className="profile-content">
        <div className="persondata-leftside">
          <div className="persondata-info">
            <div className="persondata-info-img">
              <img src={`${api}${persondata.profile}` || ProfileImg} alt="Profile" />
            </div>
            <div className="persondata-info-details">
              <div className="name">{persondata.fullname}</div>
              <div className="role">{persondata.role || "---"}</div>
              <div className="location">{persondata.address || "---"}</div>
            </div>
            <div className="persondata-info-connections">
              <div className="connection-header">My Connections</div>
              <div className="connection-count">
                {persondata.connection_count}
              </div>
            </div>
          </div>
          <div className="person-description">
            <div className="description-header">Short Description</div>
            <div className="description-body">
              {persondata.shortdescription || "---"}
            </div>
          </div>
          <div className="person-graph">
            <Graph />
          </div>
        </div>
        <div className="persondata-rightside">
          <div className="person-basicinfo">
            <div className="basicinfo-header">Basic Info</div>
            <div className="basicinfo-body">
              <div className="basicinfo-header-content">
                <div>Age: </div>
                <div>{persondata.age || "---"}</div>
              </div>
              <div className="basicinfo-header-content">
                <div>D.O.B: </div>
                <div>{persondata.dob || "---"}</div>
              </div>
            </div>
          </div>
          <div className="person-proffesionalinfo">
            <div className="proffesionalinfo-header">Professional Info</div>
            <div className="proffesionalinfo-body">
              <div className="proffesionalinfo-body-content">
                <div>Domain: </div>
                <div>{persondata.domain || "---"}</div>
              </div>
              <div
                className="proffesionalinfo-body-content"
                style={{ flexDirection: "column" }}
              >
                <div>Skillset: </div>
                <div className="skill-lists">
                  {persondata.skillset
                    ? persondata.skillset.split(",").map((skill, index) => (
                        <div key={index} className="skill">
                          {skill.trim()}
                        </div>
                      ))
                    : "---"}
                </div>
              </div>
            </div>
          </div>
          <div className="person-companyinfo">
            <div className="proffesionalinfo-header">Company</div>
            <div className="proffesionalinfo-body">
              <table class="company-info-table">
                <tr>
                  <td class="label-cell">Company Name:</td>
                  <td class="value-cell">{persondata.companyname || "---"}</td>
                </tr>
                <tr>
                  <td class="label-cell">Role:</td>
                  <td class="value-cell">{persondata.role || "---"}</td>
                </tr>
                <tr>
                  <td class="label-cell">Experience:</td>
                  <td class="value-cell">{persondata.experience || "---"}</td>
                </tr>
                <tr>
                  <td class="label-cell">Address:</td>
                  <td class="value-cell">
                    {persondata.companyaddress || "---"}
                  </td>
                </tr>
                <tr>
                  <td class="label-cell">Website:</td>
                  <td class="value-cell">{persondata.websiteurl || "---"}</td>
                </tr>
              </table>
            </div>
          </div>
          <div className="person-contactinfo">
            <div className="proffesionalinfo-header">Contact Information</div>
            <div className="proffesionalinfo-body">
              <table class="company-info-table">
                <tr>
                  <td class="label-cell">Phone:</td>
                  <td class="value-cell">{persondata.phonenumber || "---"}</td>
                </tr>
                <tr>
                  <td class="label-cell">Address:</td>
                  <td class="value-cell">{persondata.address || "---"}</td>
                </tr>
                <tr>
                  <td class="label-cell">Email:</td>
                  <td class="value-cell">{persondata.email || "---"}</td>
                </tr>
                <tr>
                  <td class="label-cell">Linkedin:</td>
                  <td class="value-cell">
                    {persondata.linkedinurl ? (
                      <a
                        href={
                          persondata.linkedinurl.startsWith("http")
                            ? persondata.linkedinurl
                            : `https://${persondata.linkedinurl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Linkedin <i class="fa-solid fa-link"></i>
                      </a>
                    ) : (
                      "----"
                    )}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
