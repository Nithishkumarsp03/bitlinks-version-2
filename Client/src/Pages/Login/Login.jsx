import React, { useState } from "react";
import Img from "../../Assets/bitlinks-bg.png";
import "../../Styles/login.css";
import Input from "@mui/joy/Input";
import { useNavigate } from "react-router-dom";
import CustomSnackbar from "../../Utils/snackbar/CustomsnackBar";

export default function Login() {
  const api = process.env.REACT_APP_API;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  
  const generateSecureCsrfToken = (length = 32) => {
    // return generateRandomString(length);
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      result += charset[values[i] % charset.length];
    }
    return result;
  };

  const handleGooglesignin = () => {
    const csrfToken = generateSecureCsrfToken(); // Generate your CSRF token
    localStorage.setItem('csrf_token', csrfToken);
    window.location.href = `${api}/api/auth/google?csrf_token=${csrfToken}`;
  };

  const handleLogin = async (e) => {
    console.log(email, password, api);
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Email and password are required");
      showSnackbar("Email and password are required!", "error");
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
        // showSnackbar("Login Successfull!", "success")
        setLoading(false);
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.userData.name);
        localStorage.setItem("email", data.userData.email);
        localStorage.setItem("role", data.userData.role);
        localStorage.setItem("isLoggedIn", "true");

        if (data.userData.role === "admin") {
          navigate("/admin/myconnections");
        } else if (data.userData.role === "user") {
          navigate("/myconnections");
        } else if (data.userData.role === "guest") {
          navigate("/secure-data-hub");
        } else {
          navigate("/404");
        }
      } else {
        setLoading(false);
        showSnackbar(data.message, "error");
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setLoading(false);
      showSnackbar("Something went wrong!", "error");
      setError("An error occurred. Please try again.");
    }
    // finally {
    //   showSnackbar("Something went wrong!", "error")
    //   setLoading(false);
    // }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <img src={Img} alt="Bitlinks" className="login-image" />
        <h2>Welcome Back!</h2>
        <p>Please log in to continue</p>
        {/* {error && <p className="error-message">{error}</p>} */}
        <form className="login-form" onSubmit={handleLogin}>
          <div>
            <label className="label-login">Email</label>
            <Input
              type="email"
              placeholder="bitlinks@bitsathy.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label-login">Password</label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          {/* <button
            type="button"
            className="login-button"
            onClick={handleGooglesignin}
          >
            Google-Signin
          </button> */}
          <button
            type="button"
            className="google-signin-button"
            onClick={handleGooglesignin}
          >
            <div className="google-logo-wrapper">
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google logo"
              />
            </div>
            <span className="google-signin-text">Sign in with Google</span>
          </button>
        </form>
        <br />
        <div className="action-buttons">
          <p
            onClick={() => navigate("/register")}
            style={{ cursor: "pointer" }}
          >
            New user?
          </p>
        </div>
      </div>
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
}
