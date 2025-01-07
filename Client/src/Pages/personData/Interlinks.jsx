import React from "react";
import { Tree, TreeNode } from "react-organizational-chart";

const staticConnections = [
  {
    person_id: 1,
    fullname: "John Doe",
    address: "Software Engineer",
    rank: 0,
    profile: "/path/to/profile1.jpg",
    children: [
      {
        person_id: 2,
        fullname: "Jane Smith",
        address: "Data Scientist",
        rank: 1,
        profile: "/path/to/profile2.jpg",
        children: [
          {
            person_id: 3,
            fullname: "Bob Johnson",
            address: "Product Manager",
            rank: 2,
            profile: "/path/to/profile3.jpg",
          },
        ],
      },
      {
        person_id: 4,
        fullname: "Alice Brown",
        address: "UX Designer",
        rank: 1,
        profile: "/path/to/profile4.jpg",
      },
    ],
  },
];

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
      rectangleClass = "rectangle"; // Default class if no rank matches
      break;
  }

  return (
    <div className="node child">
      <div className={`rectangle ${rectangleClass}`}>
        <div className="line"></div>
        <div className="account-container">
          <img
            src={connection.profile}
            alt="Profile"
            className="account"
          />
          <div className="rank-details">
            <div className="text-item-name">{connection.fullname}</div>
            <div className="text-item-profession">{connection.address}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const renderRecursive = (connections) => {
  return connections.map((connection) => (
    <TreeNode
      key={connection.person_id}
      label={renderNode(connection)}
    >
      {connection.children && renderRecursive(connection.children)}
    </TreeNode>
  ));
};

export default function Interlinks() {
  return (
    <div style={{width :"100%", height: "100%", display: 'flex', justifyContent: "center"}}>
      <Tree
        lineColor="grey"
        lineStyle="dashed"
        lineWidth="2px"
        lineHeight="30px"
        label={renderNode(staticConnections[0])}
      >
        {staticConnections[0].children &&
          renderRecursive(staticConnections[0].children)}
      </Tree>
    </div>
  );
}
