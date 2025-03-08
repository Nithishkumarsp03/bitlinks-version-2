const jwt = require("jsonwebtoken");
const db = require("../db/config");

const authenticateToken = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:", decoded); 
    
    // Fetch the updated_at field from the database
    const [rows] = await db.promise().query("SELECT updatedAt FROM login WHERE ID = ?", [decoded.ID]);
    // console.log("DB query result:", rows);
    
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare the updated_at values
    if (new Date(decoded.updatedAt).getTime() !== new Date(user.updatedAt).getTime()) {
      return res.status(401).json({ message: "Token is invalid (password changed)" });
    }

    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { authenticateToken };
