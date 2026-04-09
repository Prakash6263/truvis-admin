"use client"
import { useAuth } from "../context/AuthContext"

const Sidebar = ({ isCollapsed }) => {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`} id="sidebar">
      <div className="logo">
        <img src="assets/img/logo/logo.png" alt="logo" />
      </div>

      <ul className="chat-list">
        <li className="active">
          <a href="/dashboard">
            <img src="icons/default.png" style={{ width: "20px", marginRight: "10px" }} alt="dashboard" />
            Dashboard
          </a>
        </li>
        <li>
          <a href="#">
            <img src="icons/chart.png" style={{ width: "20px", marginRight: "10px" }} alt="chart" />
            Risk Prediction
          </a>
        </li>
        <li>
          <a href="#">
            <img src="icons/card.png" style={{ width: "20px", marginRight: "10px" }} alt="card" />
            Flagged Anomalies
          </a>
        </li>
        <li>
          <a href="#">
            <img src="icons/repair.png" style={{ width: "20px", marginRight: "10px" }} alt="repair" />
            Trends
          </a>
        </li>
      </ul>

      <h6 className="mb-2">ACCOUNT PAGES</h6>

      <ul className="chat-list">
        <li>
          <a href="#">
            <img src="icons/person.png" style={{ width: "20px", marginRight: "10px" }} alt="person" />
            Profile
          </a>
        </li>
        <li>
          <a href="/plans">
            <i className="fa fa-dollar-sign" style={{ color: "#3ac6bd", marginRight: "10px" }}></i>
            Plans
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fa fa-file" style={{ color: "#3ac6bd", marginRight: "10px" }}></i>
            Reports
          </a>
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
