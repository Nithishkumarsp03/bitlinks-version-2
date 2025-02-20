import CryptoJS from "crypto-js";

// Use an environment variable for the secret key
const secretKey = process.env.REACT_APP_SECRET_KEY || "default_secret_key";

export const encryptData = (data) => {
  // Convert data to a string and encrypt
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

export const decryptData = (ciphertext) => {
    if (!ciphertext) return null; // Return early if no data found
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedStr) return null; // Return null if decryption yields an empty string
    try {
      return JSON.parse(decryptedStr);
    } catch (error) {
      console.error("Error parsing decrypted data:", error);
      // Optionally, return the raw decrypted string if JSON parsing is not essential
      return decryptedStr;
    }
  };
  
