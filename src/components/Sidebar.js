"use client"
import { useAuth } from "../context/AuthContext"
import { useLocation, Link } from "react-router-dom"

const Sidebar = ({ isCollapsed }) => {
  const { logout } = useAuth()
  const location = useLocation()

  const handleLogout = () => {
    logout()
  }

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/")
  }

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`} id="sidebar">
      <div className="logo">
        <img src="assets/img/logo/logo.png" alt="logo" />
      </div>

      <ul className="chat-list">
        <li className={isActive("/dashboard") ? "active" : ""}>
          <Link to="/dashboard">
            <img src="icons/default.png" style={{ width: "20px", marginRight: "10px" }} alt="dashboard" />
            Dashboard
          </Link>
        </li>
        <li className={isActive("/users") ? "active" : ""}>
          <Link to="/users">
            <img src="icons/person.png" style={{ width: "20px", marginRight: "10px" }} alt="users" />
            Users
          </Link>
        </li>
        <li className={isActive("/plans") ? "active" : ""}>
          <Link to="/plans">
            <i className="fa fa-dollar-sign" style={{ color: "#3ac6bd", marginRight: "10px" }}></i>
            Plans
          </Link>
        </li>
      </ul>

      <div className="mt-5">
        <button
          onClick={handleLogout}
          className="btn btn-danger w-100"
          style={{
            backgroundColor: "#dc3545",
            border: "none",
            padding: "10px 15px",
            borderRadius: "8px",
            color: "white",
            fontWeight: "500",
          }}
        >
          <i className="fa fa-sign-out-alt" style={{ marginRight: "8px" }}></i>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
