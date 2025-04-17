import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { decryptData } from "../Utils/crypto/cryptoHelper";
import { components } from 'react-select';
import SearchIcon from '@mui/icons-material/Search';
import useStore from "../store/store";

const DropdownIndicator = (props) => {
  return (
      <components.DropdownIndicator {...props}>
          <SearchIcon fontSize="small" />
      </components.DropdownIndicator>
  );
};

export default function Domaindropdown({ value, onChange }) {
  const { setLogopen } = useStore();
  const api = process.env.REACT_APP_API;
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(value);

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

        if (res.status === 401) {
          setLogopen(true);
          return;
        }

        const data = await res.json();

        if (res.ok) {
          const activeDomains = data.domain.filter(domain => domain.status === 1);
          const formatted = activeDomains.map((domain) => ({
            label: domain.domain_column,
            value: domain.domain_column,
          }));
          setOptions(formatted);
        } else {
          console.error("Error: ", data?.error || "Failed to fetch domain data");
        }
      } catch (error) {
        console.error("Fetch error: ", error);
      }
    };

    fetchDomain();
  }, []);

  useEffect(() => {
    if (typeof value === "string") {
      setSelectedOption({ value, label: value });
    } else {
      setSelectedOption(value);
    }
  }, [value]);

  const handleChange = (option) => {
    setSelectedOption(option);
    onChange(option);
  };

  const handleCreate = async (inputValue) => {
    const newDomain = { domain_column: inputValue };

    try {
      const response = await fetch(`${api}/api/dropdown/domaindata/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify(newDomain)
      });

      if (response.status === 401) {
        setLogopen(true);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to add new domain");
      }

      const result = await response.json();
      const createdOption = { label: inputValue, value: inputValue };
      setOptions(prev => [...prev, createdOption]);
      setSelectedOption(createdOption);
      onChange(createdOption);
    } catch (err) {
      console.error("Error adding new domain:", err);
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <CreatableSelect
        placeholder="Search for Domain"
        options={options}
        name="domain"
        value={selectedOption}
        onChange={handleChange}
        onCreateOption={handleCreate}
        components={{ DropdownIndicator }}
        isClearable
      />
    </div>
  );
}
