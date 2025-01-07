import React, { useState } from "react";
import Img from "../../Assets/bitlinks-bg.png";
import "../../Styles/login.css";
import Input from "@mui/joy/Input";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const api = process.env.REACT_APP_API;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    console.log(email, password, api)
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${api}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.userData.name);
        localStorage.setItem("email", data.userData.email);
        localStorage.setItem("role", data.userData.role);
        if(data.userData.role === 'admin'){
          navigate('/admin/myconnections')
        }
        else if(data.userData.role === 'user'){
          navigate('/')
        }
        else{
          navigate('/404')
        }
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
        <h2>Welcome Back!</h2>
        <p>Please log in to continue</p>
        {error && <p className="error-message">{error}</p>}
        <form className="login-form" onSubmit={handleLogin}>
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <br />
        <div className="action-buttons">
          <p onClick={() => navigate('/register')} style={{cursor: "pointer"}}>New user?</p>
        </div>
      </div>
    </div>
  );
}
