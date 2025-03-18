document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const tabBtns = document.querySelectorAll(".tab-btn")
    const formContainers = document.querySelectorAll(".form-container")
    const loginForm = document.getElementById("login")
    const signupForm = document.getElementById("signup")
    const authForms = document.getElementById("auth-forms")
    const userProfile = document.getElementById("user-profile")
    const usernameElement = document.getElementById("username")
    const userEmailElement = document.getElementById("user-email")
    const logoutBtn = document.getElementById("logout-btn")
    const messageElement = document.getElementById("message")
    const togglePasswordBtns = document.querySelectorAll(".toggle-password")
    const passwordInput = document.getElementById("signup-password")
    const strengthSegments = document.querySelectorAll(".strength-segment")
    const strengthText = document.querySelector(".strength-text")
  
    // API URL - Change this to your server URL in production
    const API_URL = window.location.hostname === "localhost" ? "http://localhost:3000/api" : "/api"
  
    // Check if user is already logged in
    checkAuthStatus()
  
    // Tab switching
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove active class from all tabs and forms
        tabBtns.forEach((b) => b.classList.remove("active"))
        formContainers.forEach((f) => f.classList.remove("active"))
  
        // Add active class to clicked tab and corresponding form
        btn.classList.add("active")
        const tabId = btn.getAttribute("data-tab")
        document.getElementById(`${tabId}-form`).classList.add("active")
  
        // Clear message
        showMessage("")
      })
    })
  
    // Password visibility toggle
    togglePasswordBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const passwordField = btn.parentElement.querySelector("input")
        const icon = btn.querySelector("i")
  
        // Toggle password visibility
        if (passwordField.type === "password") {
          passwordField.type = "text"
          icon.classList.remove("fa-eye")
          icon.classList.add("fa-eye-slash")
        } else {
          passwordField.type = "password"
          icon.classList.remove("fa-eye-slash")
          icon.classList.add("fa-eye")
        }
      })
    })
  
    // Password strength meter
    if (passwordInput) {
      passwordInput.addEventListener("input", () => {
        const password = passwordInput.value
        const strength = checkPasswordStrength(password)
  
        // Reset all segments
        strengthSegments.forEach((segment) => {
          segment.className = "strength-segment"
        })
  
        // Update segments based on strength
        if (password.length > 0) {
          if (strength === "weak") {
            strengthSegments[0].classList.add("weak")
            strengthText.textContent = "Weak password"
          } else if (strength === "medium") {
            strengthSegments[0].classList.add("medium")
            strengthSegments[1].classList.add("medium")
            strengthText.textContent = "Medium password"
          } else if (strength === "strong") {
            strengthSegments[0].classList.add("strong")
            strengthSegments[1].classList.add("strong")
            strengthSegments[2].classList.add("strong")
            strengthText.textContent = "Strong password"
          } else if (strength === "very-strong") {
            strengthSegments.forEach((segment) => {
              segment.classList.add("strong")
            })
            strengthText.textContent = "Very strong password"
          }
        } else {
          strengthText.textContent = "Password strength"
        }
      })
    }
  
    // Login form submission
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()
  
      const email = document.getElementById("login-email").value
      const password = document.getElementById("login-password").value
  
      try {
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })
  
        const data = await response.json()
  
        if (!response.ok) {
          throw new Error(data.message || "Login failed")
        }
  
        // Save token and user data
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
  
        // Show success message and update UI
        showMessage("Login successful! Redirecting to your dashboard...", "success")
  
        // Simulate loading
        setTimeout(() => {
          updateUIAfterAuth()
        }, 1000)
      } catch (error) {
        showMessage(error.message, "error")
      }
    })
  
    // Signup form submission
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault()
  
      const username = document.getElementById("signup-username").value
      const email = document.getElementById("signup-email").value
      const password = document.getElementById("signup-password").value
  
      // Basic validation
      if (password.length < 6) {
        showMessage("Password must be at least 6 characters long", "error")
        return
      }
  
      try {
        showMessage("Creating your account...", "success")
  
        const response = await fetch(`${API_URL}/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        })
  
        const data = await response.json()
  
        if (!response.ok) {
          throw new Error(data.message || "Signup failed")
        }
  
        // Show success message
        showMessage("Account created successfully! You can now login.", "success")
  
        // Switch to login tab after a short delay
        setTimeout(() => {
          tabBtns[0].click()
  
          // Pre-fill login form
          document.getElementById("login-email").value = email
        }, 1500)
      } catch (error) {
        console.error("Signup error:", error)
        showMessage(`Signup failed: ${error.message}`, "error")
      }
    })
  
    // Logout button
    logoutBtn.addEventListener("click", () => {
      // Clear local storage
      localStorage.removeItem("token")
      localStorage.removeItem("user")
  
      // Update UI
      authForms.classList.remove("hidden")
      userProfile.classList.add("hidden")
  
      // Show message
      showMessage("Logged out successfully!", "success")
  
      // Reset forms
      loginForm.reset()
      signupForm.reset()
  
      // Switch to login tab
      tabBtns[0].click()
    })
  
    // Helper Functions
    function showMessage(message, type = "") {
      messageElement.textContent = message
      messageElement.className = "message"
  
      if (type) {
        messageElement.classList.add(type)
      }
  
      // Make message visible
      if (message) {
        messageElement.classList.add("visible")
      } else {
        messageElement.classList.remove("visible")
      }
  
      // Auto-hide success messages after 5 seconds
      if (type === "success" && message) {
        setTimeout(() => {
          messageElement.classList.remove("visible")
        }, 5000)
      }
    }
  
    function updateUIAfterAuth() {
      const user = JSON.parse(localStorage.getItem("user"))
  
      if (user) {
        // Update profile info
        usernameElement.textContent = user.username
        userEmailElement.textContent = user.email
  
        // Set account date (this would normally come from the server)
        document.getElementById("account-date").textContent = new Date().toLocaleDateString()
  
        // Show profile, hide forms
        authForms.classList.add("hidden")
        userProfile.classList.remove("hidden")
      }
    }
  
    function checkPasswordStrength(password) {
      // Basic password strength check
      if (password.length < 6) {
        return "weak"
      }
  
      const hasLowerCase = /[a-z]/.test(password)
      const hasUpperCase = /[A-Z]/.test(password)
      const hasNumbers = /\d/.test(password)
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
      const strength = (hasLowerCase ? 1 : 0) + (hasUpperCase ? 1 : 0) + (hasNumbers ? 1 : 0) + (hasSpecialChars ? 1 : 0)
  
      if (password.length >= 8 && strength >= 4) {
        return "very-strong"
      } else if (password.length >= 8 && strength >= 3) {
        return "strong"
      } else if (password.length >= 6 && strength >= 2) {
        return "medium"
      } else {
        return "weak"
      }
    }
  
    async function checkAuthStatus() {
      const token = localStorage.getItem("token")
  
      if (!token) {
        return
      }
  
      try {
        // Verify token by making a request to a protected route
        const response = await fetch(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
  
        if (!response.ok) {
          throw new Error("Invalid token")
        }
  
        // Token is valid, update UI
        updateUIAfterAuth()
      } catch (error) {
        // Token is invalid, clear storage
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
  
    // Add a function to check server connection
    async function checkServerConnection() {
      try {
        const response = await fetch(`${API_URL}/health`, { method: "GET" })
        if (response.ok) {
          console.log("Server connection successful")
        } else {
          console.error("Server connection issue:", await response.text())
        }
      } catch (error) {
        console.error("Cannot connect to server:", error)
        showMessage("Cannot connect to server. Please check if the server is running.", "error")
      }
    }
  
    // Check server connection
    checkServerConnection()
  })
  
  