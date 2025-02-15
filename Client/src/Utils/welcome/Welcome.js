import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const Welcome = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();


  useEffect(() => {
    const dataParam = searchParams.get("data");

    if (dataParam) {
      try {
        const data = JSON.parse(decodeURIComponent(dataParam));
        const { token, NAME, ROLE, ID, EMAIL, PROFILE_PICTURE } = data;

        // console.log("Data fields:", { token, NAME, ROLE, ID, EMAIL, PROFILE_PICTURE });

        // Set cookies with encrypted values
        localStorage.setItem("token", token, { expires: '1d' });
        localStorage.setItem("name", NAME);
        localStorage.setItem("role", ROLE);
        localStorage.setItem("email", EMAIL);
        localStorage.setItem("picture", PROFILE_PICTURE);
        localStorage.setItem("isLoggedIn", "true");

        // Retrieve and decrypt cookies
        const savedData = {
          token: localStorage.getItem("token"),
          name: localStorage.getItem("name"),
          email: localStorage.getItem("email"),
          role: localStorage.getItem("role"),
          picture: localStorage.getItem("picture")
        };

        // console.log("Saved JSON data:", savedData);
        if(!savedData.email){
          navigate("/login");
        }

        if (savedData.role === 'admin') {
          navigate("/admin/myconnections");
        } 
        else if(savedData.role === 'user'){
            navigate("/myconnections");
        }
        else if(savedData.role === 'guest'){
            navigate("/secure-data-hub");
        }
        else {}
      } catch (error) {
        console.error("Error processing data:", error);
      }
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100%', width: '100%' }}></div>
  );
};

export default Welcome;
