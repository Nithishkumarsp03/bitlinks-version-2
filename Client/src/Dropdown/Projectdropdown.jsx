import React, { useEffect, useState } from "react";
import Select from "react-select";
import { decryptData } from "../Utils/crypto/cryptoHelper";
import useStore from "../store/store";

export default function Projectdropdown({ project, setProject }) {
  const {setLogopen} = useStore();
  const api = process.env.REACT_APP_API;
  const [projectData, setProjectData] = useState([]);

  // Fetch Project Data
  const fetchProject = async () => {
    try {
      const res = await fetch(`${api}/api/dropdown/projectname`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
      });

      if(res.status == 401){
        setLogopen(true);
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setProjectData(data?.data || []);
      } else {
        console.error("Error: ", data?.message || "Failed to fetch project data");
      }
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  // Handle Selection
  const handleProjects = (selectedOption) => {
    setProject(selectedOption ? selectedOption.value : "");
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Select
        placeholder="Select Project"
        options={projectData.map((proj) => ({
          label: proj.title,
          value: proj.title,
        }))}
        value={
          project
            ? { label: project, value: project }
            : null
        }
        onChange={handleProjects}
        isClearable
      />
    </div>
  );
}
