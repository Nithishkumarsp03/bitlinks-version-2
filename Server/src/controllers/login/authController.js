const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../../db/config"); // Assuming this is your database connection

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)

  try {
    const [rows] = await db.promise().query("SELECT * FROM login WHERE EMAIL = ?", [email]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.PASSWORD);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        updatedAt: user.updated_at, // Include updated_at in token
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    const userData = {
      name: user.NAME,
      email: user.EMAIL,
      role: user.ROLE,
    };

    res.status(200).json({ token, userData });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log(req.body)

  // Check if all required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  try {
    // Check if user already exists
    const [existingUser] = await db.promise().query("SELECT * FROM login WHERE EMAIL = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const result = await db.promise().query(
      "INSERT INTO login (NAME, EMAIL, PASSWORD, ROLE) VALUES (?, ?, ?, ?)", 
      [name, email, hashedPassword, role || 'user'] // Default role is 'user' if not provided
    );


    // Respond with the generated token and user data
    res.status(201).json({ message: "Registered Successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { login, register };
