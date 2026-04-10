import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Plans from "./pages/Plans"
import Users from "./pages/Users"
import UserDetails from "./pages/UserDetails"
import Preloader from "./components/Preloader"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Preloader />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plans"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Plans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-details/:userId"
              element={
                <ProtectedRoute requireAuth={true}>
                  <UserDetails />
                </ProtectedRoute>
              }
            />
          </Routes>

          {/* Scroll to top button */}
          <a href="#" id="scroll-top">
            <i className="far fa-arrow-up"></i>
          </a>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
