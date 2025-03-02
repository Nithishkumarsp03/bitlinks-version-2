import React, { useState, useEffect } from "react";
import Domaindropdown from "../../Dropdown/Domaindropdown";
import SkillsetDropdown from "../../Dropdown/SkillsetDropdown";
import AddressDropdown from "../../Dropdown/AddressDropdown"; // Updated for searching locations
import CompanyDropdown from "../../Dropdown/CompanyDropdown";
import Select from 'react-select'

const scales = [
  { value: "Startup", label: "Startup" },
  { value: "Small", label: "Small" },
  { value: "Medium", label: "Medium" },
  { value: "Large", label: "Large" },
];

const payScales = [
  { value: "Below 3 Lakhs", label: "Below 3 Lakhs" },
  { value: "3 to 5 Lakhs", label: "3 to 5 Lakhs" },
  { value: "5-7 Lakhs", label: "5-7 Lakhs" },
  { value: "7-15 Lakhs", label: "7-15 Lakhs" },
  { value: "Above 15 Lakhs", label: "Above 15 Lakhs" },
];

const designationOptions = [
  { label: "Industry", value: "Industry" },
  { label: "College", value: "College" },
  { label: "School", value: "School" },
  { label: "Student", value: "Student" },
  { label: "Company", value: "Company" },
  { label: "Startup", value: "Startup" },
  { label: "Job", value: "Job" },
];

export default function FilterPopover({ onApply, onClose }) {
  const [selectedRanks, setSelectedRanks] = useState([]);
  const [domain, setDomain] = useState(null);
  const [skillsets, setSkillsets] = useState("");
  const [location, setLocation] = useState(null);
  const [scale, setScale] = useState("");
  const [payScale, setPayScale] = useState("");
  const [companyName, setCompanyName] = useState(null);
  const [designation, setDesignation] = useState("");
  const [popoverStyle, setPopoverStyle] = useState({
    position: "absolute",
    top: "50px",
    right: "40%",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "20px",
    zIndex: 1000,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    width: "300px",
  });

  useEffect(() => {
    const updateStyles = () => {
      if (window.innerWidth <= 768) {
        setPopoverStyle((prev) => ({
          ...prev,
          right: "20px",
          width: "90%",
          top: "30%"
        }));
      } else {
        setPopoverStyle((prev) => ({
          ...prev,
          right: "26%",
          width: "300px",
        }));
      }
    };

    window.addEventListener("resize", updateStyles);
    updateStyles();

    return () => window.removeEventListener("resize", updateStyles);
  }, []);

  const handleRankChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setSelectedRanks((prev) =>
      e.target.checked ? [...prev, value] : prev.filter((rank) => rank !== value)
    );
  };

  const handleChange = (setter) => (newValue) => {
    if (typeof newValue === "string") {
      setter(newValue);
    } else if (newValue?.value) {
      setter(newValue.value);
    } else {
      setter("");
    }
  };

  const handleApply = () => {
    const criteria = {
      ranks: selectedRanks,
      domain,
      location,
      scale,
      payScale,
      companyName,
      designation,
    };
    onApply(criteria);
    onClose();
  };

  return (
    <div className="filter-popover" style={popoverStyle}>
      <h3 style={headerStyle}>Filter Connections</h3>
      {/* <div className="filter-section" style={sectionStyle}>
        <label style={labelStyle}>Level (Rank):</label>
        <div>
          {[-1, 0, 1, 2, 3].map((level) => (
            <label key={level} style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                value={level}
                onChange={handleRankChange}
                checked={selectedRanks.includes(level)}
              />
              {level}
            </label>
          ))}
        </div>
      </div> */}
      <div className="filter-section" style={sectionStyle}>
        <label style={labelStyle}>Companyname:</label>
        <CompanyDropdown value={companyName} onChange={handleChange(setCompanyName)} />
      </div>
      <div className="filter-section" style={sectionStyle}>
        <label style={labelStyle}>Domain:</label>
        <Domaindropdown value={domain} onChange={handleChange(setDomain)} />
      </div>
      <div className="filter-section" style={sectionStyle}>
        <label style={labelStyle}>Location:</label>
        <AddressDropdown value={location} onChange={handleChange(setLocation)} />
      </div>
      <div className="filter-section" style={sectionStyle}>
        <label style={labelStyle}>Scale:</label>
        <Select value={scale} onChange={(e) => setScale(e.target.value)} style={selectStyle}>
          <option value="">Select Scale</option>
          {scales.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="filter-section" style={sectionStyle}>
        <label style={labelStyle}>PayScale:</label>
        <Select value={payScale} onChange={(e) => setPayScale(e.target.value)} style={selectStyle}>
          <option value="">Select PayScale</option>
          {payScales.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </div>
      <div style={{ marginTop: "15px", textAlign: "right" }}>
        <button style={buttonStyle} onClick={handleApply}>Apply</button>
      </div>
    </div>
  );
}

const headerStyle = { margin: "0 0 15px 0", textAlign: "center", color: "#333" };
const sectionStyle = { marginBottom: "15px" };
const labelStyle = { display: "block", marginBottom: "5px", fontWeight: "600", color: "#555" };
const selectStyle = { width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" };
const buttonStyle = { padding: "8px 16px", background: "#007BFF", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" };
