import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { encryptData, decryptData } from "../crypto/cryptoHelper";

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
        localStorage.setItem("token", encryptData(token), {expires: '1d'});
        localStorage.setItem("name", encryptData(NAME));
        localStorage.setItem("email", encryptData(EMAIL));
        localStorage.setItem("role", encryptData(ROLE));
        localStorage.setItem("isLoggedIn", encryptData(true));
        localStorage.setItem("picture", encryptData(PROFILE_PICTURE));

        // Retrieve and decrypt cookies
        const savedData = {
          token: decryptData(localStorage.getItem("token")),
          name: decryptData(localStorage.getItem("name")),
          email: decryptData(localStorage.getItem("email")),
          role: decryptData(localStorage.getItem("role")),
          picture: decryptData(localStorage.getItem("picture"))
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
