import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import { Home, Users, Network, Folder, UserPlus, Database, BellDot, CircleX } from "lucide-react";
import useStore from "../../store/store";
import rankminus from "../../Assets/ranks/rankminus.svg";
import rank1 from "../../Assets/ranks/rank1.svg";
import rank2 from "../../Assets/ranks/rank2.svg";
import rank3 from "../../Assets/ranks/rank3.svg";
import rank4 from "../../Assets/ranks/rank4.svg";
import inactive from "../../Assets/ranks/inactive.svg";

export default function Leftside({ role }) {
  const {rank, setRank, setLogopen } = useStore();
  const navigate = useNavigate();
  const api = process.env.REACT_APP_API;
  const location = useLocation();
  const email = decryptData(localStorage.getItem("email"));
  const [active, setActive] = useState("myconnections");
  const [rankData, setRankData] = useState({
    rank_minus: "",
    rank_zero: "",
    rank_one: "",
    rank_two: "",
    rank_three: "",
    inactive: "",
  });

  useEffect(() => {
    if (
      location.pathname === "/admin/projects" ||
      location.pathname === "/projects" ||
      location.pathname === "/alumni/projects"
    ) {
      setActive("projects");
    } else if (
      location.pathname.startsWith("/admin/add-connection/") ||
      location.pathname.startsWith("/add-connection/") ||
      location.pathname.startsWith("/alumni/add-connection/")
    ) {
      setActive("addConnection");
    } else if (location.pathname === "/admin/network") {
      setActive("networks");
    } else if (location.pathname === "/admin/spoc") {
      setActive("spoc");
    } else if (location.pathname === "/admin/data-hub") {
      setActive("merge");
    } else {
      setActive("myconnections");
    }
  }, [location.pathname]);

  const handleActive = (navbar) => {
    setActive(navbar);
  };

  const routes = {
    admin: {
      myconnections: "/admin/myconnections",
      networks: "/admin/network",
      projects: "/admin/projects",
      spoc: "/admin/spoc",
      merge: "/admin/data-hub",
      addConnection: `/admin/add-connection/${email}`,
    },
    user: {
      myconnections: "/myconnections",
      projects: "/projects",
      spoc: "/spoc",
      addConnection: `/add-connection/${email}`,
    },
    alumni: {
      myconnections: "/alumni/myconnections",
      projects: "/alumni/projects",
      addConnection: `/alumni/add-connection/${email}`,
    },
  };

  const buttons = {
    admin: [
      { name: "My connections", key: "myconnections", icon: <Users size={20}/> },
      { name: "Networks", key: "networks", icon: <Network size={20}/> },
      { name: "Projects", key: "projects", icon: <Folder size={20}/> },
      { name: "SPOC", key: "spoc", icon: <UserPlus size={20}/> },
      { name: "Data Hub", key: "merge", icon: <Database size={20}/> },
      { name: "Add connections", key: "addConnection", icon: <Home size={20}/> },
    ],
    user: [
      { name: "My connections", key: "myconnections", icon: <Users size={20}/> },
      { name: "Projects", key: "projects", icon: <Folder size={20}/> },
      { name: "SPOC", key: "spoc", icon: <UserPlus size={20}/> },
      { name: "Add connections", key: "addConnection", icon: <Home size={20}/> },
    ],
    alumni: [
      { name: "My connections", key: "myconnections", icon: <Users size={20}/> },
      { name: "Projects", key: "projects", icon: <Folder size={20}/> },
      { name: "Add connections", key: "addConnection", icon: <UserPlus size={20}/> },
    ],
  };

  const fetchRanks = async (type) => {
    try {
  
      let endpoint = "";
      let options = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
      };

  
      if (type === "myconnections") {
        endpoint = `${api}/api/person/fetchRanks/connections`;
        options.method = "POST";
        options.body = JSON.stringify({ email });
      } else if (type === "networks") {
        endpoint = `${api}/api/person/fetchRanks/networks`;
        options.method = "GET";
      }
  
      if (!endpoint.startsWith("http")) {
        throw new Error("Invalid API URL - Check REACT_APP_API in .env file");
      }
  
      const res = await fetch(endpoint, options);
  
      if(res.status == 401){
        setLogopen(true);
        return;
      }
      const text = await res.text();
      const data = JSON.parse(text);
  
      setRankData({
        rank_minus: data.rank_minus || "0",
        rank_zero: data.rank_zero || "0",
        rank_one: data.rank_one || "0",
        rank_two: data.rank_two || "0",
        rank_three: data.rank_three || "0",
        inactive: data.inactive || "0",
      });
    } catch (error) {
      console.error("Error fetching ranks:", error);
    }
  };  

  useEffect(() => {
    fetchRanks(active);
  }, [email, active]);

  return (
    <div style={{ height: "100%", width: "100%", paddingTop: "5px" }}>
      <div className="navigation-buttons">
        {buttons[role]?.map((button) => (
          <div
            key={button.key}
            onClick={() => {
              navigate(routes[role][button.key]);
              handleActive(button.key);
            }}
            className={`buttons-myconnection ${
              active === button.key ? "open" : ""
            }`}
          >
            {button.icon}
            {button.name}
          </div>
        ))}
      </div>
      {(active === "myconnections" || active === "networks") && (
        <div className="rank-containers">
          <div className="ranks" onClick={() => setRank("inactive")}>
            <div>
              <img src={inactive} alt="" />
              <div>Inactive</div>
            </div>
            <div>{rankData.inactive} Networks</div>
          </div>
          <div className="ranks" onClick={() => setRank(-1)}>
            <div>
              <img src={rankminus} alt="" />
              <div>Rank -1</div>
            </div>
            <div>{rankData.rank_minus} Networks</div>
          </div>
          <div className="ranks" onClick={() => setRank(0)}>
            <div>
              <img src={rank4} alt="" />
              <div>Rank 0</div>
            </div>
            <div>{rankData.rank_zero} Networks</div>
          </div>
          <div className="ranks" onClick={() => setRank(1)}>
            <div>
              <img src={rank3} alt="" />
              <div>Rank 1</div>
            </div>
            <div>{rankData.rank_one} Networks</div>
          </div>
          <div className="ranks" onClick={() => setRank(2)}>
            <div>
              <img src={rank2} alt="" />
              <div>Rank 2</div>
            </div>
            <div>{rankData.rank_two} Networks</div>
          </div>
          <div className="ranks" onClick={() => setRank(3)}>
            <div>
              <img src={rank1} alt="" />
              <div>Rank 3</div>
            </div>
            <div>{rankData.rank_three} Networks</div>
          </div>
        </div>
      )}
    </div>
  );
}
