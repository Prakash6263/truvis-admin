"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (requireAuth && !isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  if (!requireAuth && isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
