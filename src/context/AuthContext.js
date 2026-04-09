"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authApi } from "../api/authApi"

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔄 On app load
  useEffect(() => {
    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token")

    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [])

  // 🔐 LOGIN
  const login = async (email, password, rememberMe = false) => {
    const result = await authApi.login(email, password)

    if (!result.success) {
      return result
    }

    const userData = {
      email,
      role: result.data.role || "user",
    }

    setToken(result.data.token)
    setUser(userData)

    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem("token", result.data.token)
    storage.setItem("user", JSON.stringify(userData))

    return { success: true }
  }

  // 🚪 LOGOUT
  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.clear()
    sessionStorage.clear()
  }

  // ✅ AUTH CHECK (Reliable)
  const isAuthenticated = () => {
    return (
      !!localStorage.getItem("token") ||
      !!sessionStorage.getItem("token")
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
