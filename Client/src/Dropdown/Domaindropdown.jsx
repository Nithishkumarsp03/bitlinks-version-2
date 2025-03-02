import React, { useEffect, useState } from "react";
import Select from "react-select";
import { decryptData } from "../Utils/crypto/cryptoHelper";

export default function Domaindropdown({ value, onChange }) {
  const api = process.env.REACT_APP_API;
  const [domain, setDomain] = useState([]);

  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const res = await fetch(`${api}/api/domain/fetchdata`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setDomain(data?.domain);
        } else {
          console.log("Error: ", data?.error || "Failed to fetch domain data");
        }
      } catch (error) {
        console.error("Fetch error: ", error);
      }
    };

    fetchDomain();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Select
        placeholder="Select Domain"
        options={domain.map((domain) => ({
          label: domain.domain_column,
          value: domain.domain_column,
        }))}
        name="domain"
        value={value ? { label: value, value: value } : null}
        onChange={onChange}
        isClearable
      />
    </div>
  );
}
