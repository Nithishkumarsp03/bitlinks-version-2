import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import Select from "react-select";
import Input from "@mui/joy/Input";
import AddressDropdown from "../../Dropdown/AddressDropdown";
import CompanyDropdown from "../../Dropdown/CompanyDropdown";
import RoleDropdown from "../../Dropdown/RoleDropdown";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import useStore from "../../store/store";
import "../../Styles/dialog.css";

const CompanyDialog = ({ open, setCompanyopen, setcompanyCompletion, showSnackbar }) => {
  const {setLogopen} = useStore();
  const api = process.env.REACT_APP_API;
  const { uuid } = useParams();
  const [companyInfo, setCompanyInfo] = useState({
    companyname: null,
    position: "",
    experience: "",
    role: null,
    companyaddress: null,
    websiteurl: "",
    scale: null,
    payscale: null,
  });

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

  const handleRoleUpdate = (newValue) => {
    // If newValue is an object (from dropdown), extract the value
    const roleValue = newValue?.value || newValue;

    setCompanyInfo((prevDetails) => ({
      ...prevDetails,
      role: roleValue,
    }));
  };

  const handlecompanyChange = (newValue) => {
    setCompanyInfo((prev) => ({ ...prev, companyname: newValue }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo({ ...companyInfo, [name]: value });
  };

  const handleSelectChange = (name, selectedOption) => {
    setCompanyInfo({ ...companyInfo, [name]: selectedOption });
  };

  const calculateProgress = () => {
    const totalFields = Object.keys(companyInfo).length;
    const filledFields = Object.values(companyInfo).filter((value) => {
      if (value === null) return false; // For select fields
      if (typeof value === "string") return value.trim() !== "";
      return true;
    }).length;
    return (filledFields / totalFields) * 100;
  };

  setcompanyCompletion(calculateProgress())

  const completion = calculateProgress();

  const handleSaveChanges = async (event) => {
    event.preventDefault();

    const updateData = {
      uuid,
      companyInfo,
      completion,
    };
    try {
      const res = await fetch(`${api}/api/infograph/update/company`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify(updateData),
      });
      if(res.status == 401){
        setLogopen(true);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        showSnackbar(data.message, 'error')
        throw new Error(data.message);
      }

      showSnackbar('Company info updated Successfully!', 'success');
      setCompanyopen(false);
    } catch (error) {
      showSnackbar(error, 'error');
      console.error(error);
    }
  };

  const fetchCompany = async () => {
    try {
      const res = await fetch(`${api}/api/infograph/fetch/company`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ uuid }),
      });
      if(res.status == 401){
        setLogopen(true);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        showSnackbar(data.message, 'error')
        throw new Error(data.message);
      }

      // console.log("Fetched Data:", data.company);

      if (data.company && data.company.length > 0) {
        const company = data.company[0];

        setCompanyInfo({
          companyname: company.companyname
          ? { value: company.companyname, label: company.companyname }
          : null,
          position: company.position || "",
          experience: company.experience || "",
          role: company.role
            ? { value: company.role, label: company.role }
            : null,
          companyaddress: company.companyaddress
            ? { value: company.companyaddress, label: company.companyaddress }
            : null,
          websiteurl: company.websiteurl || "",
          scale:
            scales.find((option) => option.value === company.scale) || null,
          payscale:
            payScales.find((option) => option.value === company.payscale) ||
            null,
        });
      }
    } catch (error) {
      showSnackbar(error, 'error');
      console.error("Error fetching company details:", error);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  return (
    <Dialog
      open={open}
      onClose={() => setCompanyopen(false)}
      maxWidth="sm"
      fullWidth
    >
      <LinearProgress
        variant="determinate"
        value={calculateProgress()}
        sx={{ height: 10 }}
      />
      <DialogTitle className="dialog-title">Company Details</DialogTitle>
      <DialogContent>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <CompanyDropdown value={companyInfo.companyname} onChange={handlecompanyChange}/>
          <div className="input-group" style={{ marginTop: "0" }}>
            <div>
              <Input
                placeholder="Position"
                name="position"
                value={companyInfo.position}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </div>
          </div>
          <div className="input-group" style={{ marginTop: "0px" }}>
            <div>
              <Input
                placeholder="Experience (in years)"
                name="experience"
                type="number"
                value={companyInfo.experience}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </div>
          </div>
          <div>
            <RoleDropdown
              value={companyInfo.role}
              onChange={(newValue) =>
                setCompanyInfo({ ...companyInfo, role: newValue })
              }
            />
          </div>
          <Box>
            <AddressDropdown
              value={companyInfo.companyaddress}
              onChange={(newValue) =>
                setCompanyInfo({ ...companyInfo, companyaddress: newValue })
              }
            />
          </Box>
          <div>
            <Input
              placeholder="Website URL"
              name="websiteurl"
              value={companyInfo.websiteurl}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </div>
          {/* <div className="input-group"> */}
          <div>
            <Select
              placeholder="Scale"
              options={scales}
              value={companyInfo.scale}
              onChange={(selectedOption) =>
                handleSelectChange("scale", selectedOption)
              }
              isClearable
            />
          </div>
          <div>
            <Select
              placeholder="Pay Scale"
              options={payScales}
              value={companyInfo.payscale}
              onChange={(selectedOption) =>
                handleSelectChange("payscale", selectedOption)
              }
              isClearable
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setCompanyopen(false)} color="secondary">
          Discard
        </Button>
        <Button onClick={handleSaveChanges} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyDialog;
