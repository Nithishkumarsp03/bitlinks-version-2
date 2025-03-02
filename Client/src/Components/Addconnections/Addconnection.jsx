import React, { useEffect, useState } from "react";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Select from "react-select";
import Userprofile from "../../Assets/user.jpg";
import Switch from "@mui/material/Switch";
import CustomSnackbar from "../../Utils/snackbar/CustomsnackBar";
import { useNavigate, useParams } from "react-router-dom";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import "../../Styles/addconnection.css";

export default function Addconnection() {
  const api = process.env.REACT_APP_API;
  const role = decryptData(localStorage.getItem("role"));
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const {spocemail} = useParams();
  const [isNameAvailable, setIsNameAvailable] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [visitingCardPhoto, setVisitingCardPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [personData, setPersonData] = useState({
    fullname: "",
    phonenumber: "",
    email: "",
    age: "",
    dob: "",
    rating: "",
    designation: "",
    linkedinUrl: "",
    address: "",
    hashtags: "",
    shortdescription: "",
    spoc: "yes",
    rank: -1,
  });

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption, name) => {
    // console.log(selectedOption, name);
    setPersonData((prevData) => ({
      ...prevData,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSpocChange = (event) => {
    const isChecked = event.target.checked;
    console.log("Switch toggled:", isChecked); // Logs the switch action
    setPersonData((prevData) => ({
      ...prevData,
      spoc: isChecked ? "yes" : "no",
    }));
  };

  const handleRankChange = (event) => {
    const isChecked = event.target.checked;
    console.log("Switch toggled:", isChecked); // Logs the switch action
    setPersonData((prevData) => ({
      ...prevData,
      rank: isChecked ? -1 : 0,
    }));
  };

  useEffect(() => {
    // console.log(personData.rank);
  }, [personData.rank]);
  useEffect(() => {
    // console.log(personData.spoc);
  }, [personData.spoc]);

  const checkNameAvailability = async () => {
    if(!name){
      showSnackbar('Please Provide a valid name to check availability', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${api}/api/add/check-availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ name: name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        throw new Error(data.message || "Failed to check name availability");
      }

      setLoading(false);
      setIsNameAvailable(data.available); // Set state based on API response
    } catch (error) {
      setLoading(false);
      setIsNameAvailable(false); // Assume name is taken in case of an error
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
  };

  const handleVisitingCardPhotoChange = (e) => {
    const file = e.target.files[0];
    setVisitingCardPhoto(file);
  };

  const handleSubmit = async (e) => {
    if (!personData.fullname || !personData.phonenumber || !personData.email) {
      showSnackbar(
        "Please provide the basic information like Name, email & Contact details to proceed",
        "error"
      );
      return;
    }

    setLoading(true);
    e.preventDefault();
    try {
      // Step 1: Upload available photos
      const formData = new FormData();
      if (profilePhoto) {
        formData.append("profileImage", profilePhoto); // Add profile photo if available
      }
      if (visitingCardPhoto) {
        formData.append("visitingcard", visitingCardPhoto); // Add visiting card photo if available
      }

      let filePaths = [];
      if (formData.has("profileImage") || formData.has("visitingcard")) {
        // Only send request if there are photos to upload
        const uploadResponse = await fetch(`${api}/api/upload`, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          setLoading(false);
          showSnackbar("Photo upload failed", "error");
          throw new Error("Photo upload failed");
        }

        const uploadResult = await uploadResponse.json();
        filePaths = uploadResult || [];
        // console.log(uploadResult)
      }

      // console.log(filePaths)

      // Step 2: Send JSON data with photo paths (if available)
      const finalData = {
        ...personData,
        useremail: spocemail,
        profilePhoto: filePaths?.profileImage || null, // Use the first file path if available
        visitingCardPhoto: filePaths?.visitingcard || null, // Use the second file path if available
      };

      const jsonResponse = await fetch(`${api}/api/add/newconnection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ finalData }), // Only send the necessary JSON data
      });

      if (!jsonResponse.ok) {
        setLoading(false);
        showSnackbar("Data Submission failed", "error");
        throw new Error("Data submission failed");
      }

      setLoading(false);
      showSnackbar("Data submitted Successfully!", "success");
      if(role === "admin") navigate("/admin/myconnections");
      else if(role === "user") navigate("/myconnections");
      else{}
      const result = await jsonResponse.json();
      setPersonData({
        fullname: "",
        phonenumber: "",
        email: "",
        age: "",
        dob: "",
        rating: "",
        designation: "",
        linkedinUrl: "",
        address: "",
        hashtags: "",
        shortdescription: "",
        spoc: "yes",
        rank: -1,
      });
    } catch (error) {
      setLoading(false);
      showSnackbar(error.message, "error");
      console.error("Error:", error.message);
    }
  };

  const options = [
    { label: "Highly Recommended", value: "Highly Recommended" },
    { label: "Recommended", value: "Recommended" },
    { label: "Not Recommended", value: "Not Recommended" },
  ];

  const designation = [
    { label: "Industry", value: "Industry" },
    { label: "College", value: "College" },
    { label: "School", value: "School" },
    { label: "Student", value: "Student" },
    { label: "Company", value: "Company" },
    { label: "Startup", value: "Startup" },
    { label: "Job", value: "Job" },
  ];

  return (
    <div className="addconnection-container">
      {isNameAvailable === null && (
        <div className="name-not-available">
          <h2>Check Name Availability</h2>
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "50%", marginBottom: "15px" }}
          />
          <Button onClick={checkNameAvailability} variant="solid">
            {loading
              ? "Checking Availability...Please wait!"
              : "Check Availability"}
          </Button>
        </div>
      )}

      {isNameAvailable === false && (
        <div className="name-not-available">
          <h2>Name Not Available</h2>
          <p>The name "{name}" is already taken. Please try another name.</p>
          <Button onClick={() => setIsNameAvailable(null)} variant="solid">
            Try Again
          </Button>
        </div>
      )}

      {isNameAvailable === true && (
        <div className="add-connection-whole-container">
          {/* Left Section: Form Fields */}
          <div style={{ width: "70%", padding: "20px" }}>
            <h2>Add Connection</h2>
            <form style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
              <Input
                type="text"
                placeholder="Full Name"
                name="fullname"
                value={personData.fullname}
                onChange={handleChange}
                required
                style={{ flex: "1 1 calc(100% - 15px)" }}
              />
              <Input
                type="text"
                placeholder="PhoneNumber"
                name="phonenumber"
                value={personData.phonenumber}
                onChange={handleChange}
                required
                style={{ flex: "1 1 calc(50% - 15px)" }}
              />
              <Input
                type="email"
                placeholder="Email"
                name="email"
                value={personData.email}
                onChange={handleChange}
                required
                style={{ flex: "1 1 calc(50% - 15px)" }}
              />
              <Input
                type="text"
                placeholder="Age"
                name="age"
                value={personData.age}
                onChange={handleChange}
                // required
                style={{ flex: "1 1 calc(50% - 15px)" }}
              />
              <Input
                type="date"
                placeholder="D.O.B"
                name="dob"
                value={personData.dob}
                onChange={handleChange}
                // required
                style={{ flex: "1 1 calc(50% - 15px)" }}
              />
              <div style={{ display: "flex", gap: "15px", width: "100%" }}>
                <Select
                  options={options}
                  placeholder="Select Rating"
                  name="rating"
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "rating")
                  }
                  styles={{
                    container: (base) => ({ ...base, flex: 1 }),
                  }}
                />
                <Select
                  options={designation}
                  placeholder="Select Designation"
                  name="designation"
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "designation")
                  }
                  styles={{
                    container: (base) => ({ ...base, flex: 1 }),
                  }}
                />
              </div>

              <Input
                type="text"
                placeholder="Linkedinurl"
                name="linkedinUrl"
                value={personData.linkedinUrl}
                onChange={handleChange}
                // required
                style={{ flex: "1 1 calc(50% - 15px)" }}
              />
              <Input
                type="text"
                placeholder="Hashtags"
                name="hashtags"
                value={personData.hashtags}
                onChange={handleChange}
                // required
                style={{ flex: "1 1 calc(50% - 15px)" }}
              />
              <Input
                type="text"
                placeholder="Address"
                name="address"
                value={personData.address}
                onChange={handleChange}
                // required
                style={{ flex: "1 1 calc(100% - 15px)" }}
              />
              <Input
                type="text"
                placeholder="Short Description"
                name="shortdescription"
                value={personData.shortdescription}
                onChange={handleChange}
                // required
                style={{ flex: "1 1 calc(50% - 15px)", height: "20px" }}
              />
              <div>
                <label htmlFor="">
                  If this contact is not a spoc please uncheck before creating a
                  connection
                </label>
                <Switch
                  checked={personData.spoc === "yes"}
                  onChange={handleSpocChange}
                />
                <label htmlFor="">Spoc(no/yes)</label>
              </div>
              <div>
                <label htmlFor="">
                  If you want to push to rank 0 please uncheck before creating a
                  connection
                </label>
                <Switch
                  checked={personData.rank === -1}
                  onChange={handleRankChange}
                />
                <label htmlFor="">Rank(0/-1)</label>
              </div>
              <Button
                type="submit"
                variant="solid"
                style={{ width: "100%", marginBottom: "20px" }}
                onClick={handleSubmit}
              >
                {loading
                  ? "Creating connection... Do not refresh this page. "
                  : "Create Connection"}
              </Button>
            </form>
          </div>

          {/* Right Section: Profile Photo */}
          <div
            style={{
              width: "30%",
              height: "100%",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderLeft: "1px solid #ccc",
            }}
          >
            {/* Profile Photo Section */}
            <h3 style={{ marginBottom: "10px" }}>Profile Photo</h3>
            <div className="addconnection-photosection">
              {profilePhoto ? (
                <img
                  src={URL.createObjectURL(profilePhoto)}
                  alt="Profile Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <img
                  src={Userprofile}
                  alt="Profile Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Button variant="solid" component="label">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleProfilePhotoChange}
                />
              </Button>
              {profilePhoto ? (
                <Button
                  variant="soft"
                  component="label"
                  color="danger"
                  onClick={() => setProfilePhoto(null)}
                >
                  Remove image
                </Button>
              ) : null}
            </div>

            {/* Visiting Card Photo Section */}
            <h3 style={{ marginTop: "30px", marginBottom: "10px" }}>
              Visiting Card Photo
            </h3>
            <div
              className="addconnection-photosection"
              style={{ width: "80%", borderRadius: "10px" }}
            >
              {visitingCardPhoto ? (
                <img
                  src={URL.createObjectURL(visitingCardPhoto)}
                  alt="Visiting Card Preview"
                />
              ) : (
                <p style={{ textAlign: "center", color: "#ccc" }}>
                  No Image Selected
                </p>
              )}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Button variant="solid" component="label">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleVisitingCardPhotoChange}
                />
              </Button>
              {visitingCardPhoto ? (
                <Button
                  variant="soft"
                  component="label"
                  color="danger"
                  onClick={() => setVisitingCardPhoto(null)}
                >
                  Remove Image
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
}
