"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rememberMe: true,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle signup logic here
    navigate("/dashboard")
  }

  return (
    <main className="main">
      {/* Header Section */}
      <div className="header-bg">
        <h2 className="text-white">Welcome!</h2>
        <p className="text-white">Use these awesome forms to login or create a free account to your project</p>
      </div>

      {/* Signup Box */}
      <div className="signup-box mb-5">
        <img src="assets/img/logo/logo.png" alt="Logo" />
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3 text-start">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3 text-start">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3 form-check text-start">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Remember me
            </label>
          </div>
          <button type="submit" className="btn btn-signup">
            SIGN UP
          </button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>
    </main>
  )
}

export default Signup
