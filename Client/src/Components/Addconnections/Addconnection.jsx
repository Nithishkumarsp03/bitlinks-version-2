import React, { useState } from "react";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Select from "react-select";
import Userprofile from "../../Assets/user.jpg";
import "../../Styles/addconnection.css"

export default function Addconnection() {
  const [name, setName] = useState("");
  const [isNameAvailable, setIsNameAvailable] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [visitingCardPhoto, setVisitingCardPhoto] = useState(null);

  const checkNameAvailability = () => {
    const unavailableNames = ["John", "Jane", "Alice"];
    setIsNameAvailable(!unavailableNames.includes(name.trim()));
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVisitingCardPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setVisitingCardPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="addconnection-container">
      {isNameAvailable === null && (
        <div className="name-not-available" >
          <h2>Check Name Availability</h2>
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "50%", marginBottom: "15px" }}
          />
          <Button onClick={checkNameAvailability} variant="solid">
            Check Availability
          </Button>
        </div>
      )}

      {isNameAvailable === false && (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2>Name Not Available</h2>
          <p>The name "{name}" is already taken. Please try another name.</p>
          <Button onClick={() => setIsNameAvailable(null)} variant="solid">
            Try Again
          </Button>
        </div>
      )}

      {isNameAvailable === true && (
        <div style={{ width: "100%", height: "100%", display: "flex" }}>
          {/* Left Section: Form Fields */}
          <div style={{ width: "70%", padding: "20px" }}>
            <h2>Add Connection</h2>
            <form style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
              <Input
                type="text"
                placeholder="Full Name"
                required
                style={{ flex: "1 1 calc(100% - 15px)" }}
              />
              <Input
                type="text"
                placeholder="PhoneNumber"
                required
                style={{ flex: "1 1 calc(50% - 15px)" }}
              />
              <Input
                type="email"
                placeholder="Email"
                required
                style={{ flex: "1 1 calc(50% - 15px)" }}
              />
              <Input
                type="text"
                placeholder="Age"
                required
                style={{ flex: "1 1 calc(50% - 15px)" }}
              />
              <Input
                type="date"
                placeholder="D.O.B"
                required
                style={{ flex: "1 1 calc(50% - 15px)" }}
              />
              <div style={{ display: "flex", gap: "15px", width: "100%" }}>
                <Select
                  options={[
                    { value: "1", label: "Rating 1" },
                    { value: "2", label: "Rating 2" },
                  ]}
                  placeholder="Select Rating"
                  styles={{
                    container: (base) => ({ ...base, flex: 1 }),
                  }}
                />
                <Select
                  options={[
                    { value: "manager", label: "Manager" },
                    { value: "developer", label: "Developer" },
                  ]}
                  placeholder="Select Designation"
                  styles={{
                    container: (base) => ({ ...base, flex: 1 }),
                  }}
                />
              </div>

              <Input
                type="text"
                placeholder="Linkedinurl"
                required
                style={{ flex: "1 1 calc(50% - 15px)" }}
              />
              <Input
                type="text"
                placeholder="Address"
                required
                style={{ flex: "1 1 calc(50% - 15px)" }}
              />
              <Input
                type="text"
                placeholder="Hashtags"
                required
                style={{ flex: "1 1 calc(50% - 15px)" }}
              />
              <Input
                type="date"
                placeholder="Date of Birth"
                required
                style={{ flex: "1 1 calc(50% - 15px)" }}
              />
              <Input
                type="text"
                placeholder="Short Description"
                required
                style={{ flex: "1 1 calc(50% - 15px)", height: "20px" }}
              />
              <Button type="submit" variant="solid" style={{ width: "100%" }}>
                Submit
              </Button>
            </form>
          </div>

          {/* Right Section: Profile Photo */}
          <div
            style={{
              width: "30%",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderLeft: "1px solid #ccc",
            }}
          >
            {/* Profile Photo Section */}
            <h3 style={{marginBottom: "10px"}}>Profile Photo</h3>
            <div
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                border: "2px dashed #ccc",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "15px",
                backgroundColor: "#f9f9f9",
                overflow: "hidden",
              }}
            >
              {profilePhoto ? (
                <img
                  src={profilePhoto}
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
            <div style={{display: 'flex', gap: "10px"}}>
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
                    <Button variant="soft" component="label" color="danger" onClick={()=>setProfilePhoto(null)}>
                    Remove image
                  </Button>
                ): (null)}
            </div>

            {/* Visiting Card Photo Section */}
            <h3 style={{ marginTop: "30px", marginBottom: "10px" }}>Visiting Card Photo</h3>
            <div
              style={{
                width: "80%",
                height: "150px",
                borderRadius: "10px",
                border: "2px dashed #ccc",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "15px",
                backgroundColor: "#f9f9f9",
                overflow: "hidden",
              }}
            >
              {visitingCardPhoto ? (
                <img
                  src={visitingCardPhoto}
                  alt="Visiting Card Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <p style={{ textAlign: "center", color: "#ccc" }}>
                  No Image Selected
                </p>
              )}
            </div>
            <div style={{display: "flex", gap: "10px"}}>
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
                    <Button variant="soft" component="label" color="danger" onClick={()=>setVisitingCardPhoto(null)}>
                    Remove Image
                  </Button>
                ): (null)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
