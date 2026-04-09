"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Swal from "sweetalert2"

const Login = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard", { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(
      formData.email,
      formData.password,
      formData.rememberMe
    )

    if (result.success) {
      await Swal.fire({
        title: "Success!",
        text: "Login successful",
        icon: "success",
        confirmButtonColor: "#19c5b9",
        confirmButtonText: "Continue",
      })
      navigate("/dashboard", { replace: true })
    } else {
      await Swal.fire({
        title: "Error!",
        text: result.message || "Login failed",
        icon: "error",
        confirmButtonColor: "#19c5b9",
        confirmButtonText: "Try Again",
      })
    }

    setLoading(false)
  }

  return (
    <main className="main">
      <div className="login-container mb-3">
        {/* Form Side */}
        <div className="form-side">
          <div className="form-box">
            <h2 className="mb-3">Welcome Back</h2>
            <p className="text-muted mb-4">
              Enter your email and password to sign in
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3 d-flex align-items-center gap-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label>Remember me</label>
              </div>

              <button
                type="submit"
                className="btn btn-login"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>

        {/* Graphic Side */}
        <div className="graphic-side">
          <img src="assets/img/login.png" alt="Truvis Logo" />
        </div>
      </div>
    </main>
  )
}

export default Login
