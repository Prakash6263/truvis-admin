"use client"
import { useAuth } from "../context/AuthContext"

const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuth()

  return (
    <div className="topbar mb-3">
      <div>
        <button className="btn btn-toggle-sidebar w-auto" onClick={onToggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <div className="right w-auto">
        <a href="#">
          <span className="fw-semibold">
            <i className="fas fa-user icon"></i> {user?.name || "Username"}
          </span>
        </a>
        <a href="#">
          <i className="fas fa-cog icon"></i>
        </a>
        <a href="#">
          <i className="fas fa-bell icon"></i>
        </a>
      </div>
    </div>
  )
}

export default Navbar
