import React, { useEffect, useState } from "react";
import Select from "react-select";
import { decryptData } from "../Utils/crypto/cryptoHelper";

export default function Spocdropdown({ formValues, setFormValues }) {
  const api = process.env.REACT_APP_API;
  const [spoc, setSpoc] = useState([]);

  // Fetch Spoc Data
  const fetchSpoc = async () => {
    try {
      const res = await fetch(`${api}/api/spoc/fetchspoc`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setSpoc(data?.spoc || []);
      } else {
        console.log("Error: ", data?.error || "Failed to fetch SPOC data");
      }
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  // Handle Change
  const handleProjectLeaderChange = (selectedOption) => {
    setFormValues({
      ...formValues,
      projectLeader: selectedOption ? selectedOption.value : "",
    });
  };

  useEffect(() => {
    fetchSpoc();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Select
  placeholder="Search Spoc"
  options={spoc.map((spoc) => ({
    label: spoc.fullname,
    value: spoc.fullname,
  }))}
  name="projectLeader"
  value={
    formValues.projectLeader
      ? { label: formValues.projectLeader, value: formValues.projectLeader }
      : null
  }
  onChange={handleProjectLeaderChange}
  isClearable
/>
    </div>
  );
}
