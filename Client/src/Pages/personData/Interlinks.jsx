import React, { useState, useEffect } from "react";
import Profile from "../../Assets/user.jpg";
import { Tree, TreeNode } from "react-organizational-chart";
import "../../Styles/interlinks.css";
import { useParams } from "react-router-dom";
import { decryptData } from "../../Utils/crypto/cryptoHelper";

const api = process.env.REACT_APP_API;

const renderNode = (connection) => {
  let rectangleClass = "";
  switch (connection.rank) {
    case 0:
      rectangleClass = "rectangle1";
      break;
    case 1:
      rectangleClass = "rectangle2";
      break;
    case 2:
      rectangleClass = "rectangle3";
      break;
    case 3:
      rectangleClass = "rectangle4";
      break;
    default:
      rectangleClass = "rectangle";
      break;
  }
  
  return (
    <div className="node child" style={{ display: "flex", justifyContent: "center"}}>
      <div className={`rectangle ${rectangleClass}`}>
        <div className="line"></div>
        <div className="account-container">
          <img src={Profile} alt="profile" className="account" />
          <div className="rank-details">
            <div className="text-item-name">{connection.fullname || "Name"}</div>
            <div className="text-item-profession">{connection.address || "Profession"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Interlinks() {
  const [mainPerson, setMainPerson] = useState(null);
  const [subConnections, setSubConnections] = useState([]);
  const { uuid } = useParams();

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        const res = await fetch(`${api}/api/person/fetchpersonconnections`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
          },
          body: JSON.stringify({ uuid }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setMainPerson(data.mainPerson);
        setSubConnections(data.subConnections);
      } catch (error) {
        console.error("Error fetching person data:", error);
      }
    };

    fetchPersonData();
  }, [uuid]);

  if (!mainPerson) {
    return <div>Loading...</div>;
  }

  return (
    <div className="interlinks-container">
      <Tree
        lineColor="grey"
        lineStyle="dotted" 
        lineWidth="2px"
        lineHeight="30px"
        label={renderNode(mainPerson)}
      >
        <TreeNode
          label={
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                justifyContent: "center",
                paddingTop: "10px",
              }}
            >
              {subConnections.map((child) => (
                <div key={child.person_id}>
                  {renderNode(child)}
                </div>
              ))}
            </div>
          }
        />
      </Tree>
    </div>
  );
}
