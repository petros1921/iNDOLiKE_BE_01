import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"

const app = express()
const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// MongoDB Atlas Connection
console.log("Attempting to connect to MongoDB Atlas...")
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas successfully!")
    console.log("Database connection established and ready to use.")
  })
  .catch((err) => {
    console.error("❌ MongoDB Atlas connection error:", err)
    console.error("Please check your connection string and make sure your IP address is whitelisted.")
    console.error(
      "Connection string format should be: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/auth-system",
    )
  })

// User Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const User = mongoose.model("User", userSchema)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    environment: {
      nodeEnv: process.env.NODE_ENV || "not set",
      port: process.env.PORT || "3000",
      mongodbUri: process.env.MONGODB_URI ? "set (✓)" : "not set (✗)",
      jwtSecret: process.env.JWT_SECRET ? "set (✓)" : "not set (✗)",
    },
  })
})

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) return res.status(401).json({ message: "Access denied" })

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" })
    req.user = user
    next()
  })
}

// Routes
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    })

    await user.save()

    res.status(201).json({ message: "User created successfully" })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({
      message: "Server error during signup",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
})

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    // Create and assign token
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    })

    res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Protected route example
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 API endpoints available at http://localhost:${PORT}/api`)
  console.log(`🔍 Health check available at http://localhost:${PORT}/api/health`)
})

