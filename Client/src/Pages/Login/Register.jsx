import React, { useState } from "react";
import Img from "../../Assets/bitlinks-bg.png";
import "../../Styles/login.css";
import Input from "@mui/joy/Input";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const api = process.env.REACT_APP_API;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${api}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <img src={Img} alt="Bitlinks" className="login-image" />
        <h2>Welcome</h2>
        <p>Please fill all the details to create an Account</p>
        {error && <p className="error-message">{error}</p>}
        <form className="login-form" onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="Enter your fullname"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <br />
        <div className="action-buttons">
          <p onClick={()=>navigate('/login')} style={{cursor: "pointer"}}>Existing user?</p>
        </div>
      </div>
    </div>
  );
}
