import React, { useState } from "react";
import Select from "react-select";
import CompanyDropdown from "../../Dropdown/CompanyDropdown";
import Spocdropdown from "../../Dropdown/Spocdropdown";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import { Button } from "@mui/material";
import ReportGenerator from "../Reportgenerator/ReportGenerator"; // Import Report Generator

export default function Report() {
  const api = process.env.REACT_APP_API;

  const [formValues, setFormValues] = useState({
    company: null,
    projectLeader: "",
    dateRange: "",
  });

  const [reportData, setReportData] = useState([]); // Store fetched report data

  const dateOptions = [
    { label: "Last 1 Week", value: 7 },
    { label: "Last 10 Days", value: 10 },
    { label: "Last 15 Days", value: 15 },
    { label: "Last 1 Month", value: 30 },
    { label: "Last 3 Months", value: 90 },
    { label: "Last 6 Months", value: 180 },
    { label: "Last 1 Year", value: 365 },
    { label: "Last 5 Years", value: 1825 },
  ];

  const handleGenerate = async () => {

    let queryParams = {};
    if (formValues.company) queryParams.company = formValues.company;
    if (formValues.projectLeader) queryParams.staffname = formValues.projectLeader;
    if (formValues.dateRange) queryParams.dateRange = formValues.dateRange.value;

    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${api}/api/settings/generatereport?${queryString}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
      });

      const data = await response.json();
      setReportData(data); // Store the fetched data in state
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  return (
    <div>
      <h2>Generate a Report</h2>
      <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
        {/* Company Dropdown */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "5px" }}>
          <label>
            Search for a Company <span style={{ color: "blue" }}>(optional)</span>
          </label>
          <CompanyDropdown
            value={formValues.company}
            onChange={(newvalue) => setFormValues((prev) => ({ ...prev, company: newvalue?.value }))}
          />
        </div>

        {/* Spoc Dropdown */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "5px" }}>
          <label>
            Search for Spoc <span style={{ color: "blue" }}>(optional)</span>
          </label>
          <Spocdropdown formValues={formValues} setFormValues={setFormValues} />
        </div>

        {/* Date Range Dropdown (react-select) */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "5px" }}>
          <label>
            Select a Date Range <span style={{ color: "blue" }}>(optional)</span>
          </label>
          <Select
            options={dateOptions}
            placeholder="Select Date Range"
            value={formValues.dateRange}
            onChange={(selectedOption) => setFormValues((prev) => ({ ...prev, dateRange: selectedOption }))}
          />
        </div>
      </div>

      {/* Generate Report Button */}
      <Button sx={{ width: "100%", mt: 2 }} variant="contained" onClick={handleGenerate}>
        Generate
      </Button>

      {reportData.length === 0 && <div style={{color: 'red', marginTop: '10px'}}>No Reports found for selected fields. Please try again!</div>}

      {/* Show ReportGenerator only if we have data */}
      {reportData.length > 0 && <ReportGenerator data={reportData} />}
    </div>
  );
}
