"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { usersApi } from "../api/usersApi"

const ITEMS_PER_PAGE = 10

const Users = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [usersData, setUsersData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  useEffect(() => {
    // Fetch users data from API
    const fetchUsersData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        
        if (!token) {
          setError("Authentication token not found")
          setLoading(false)
          return
        }

        const result = await usersApi.getUsersActivity(token)

        if (result.success) {
          setUsersData(result.data)
          setError(null)
        } else {
          setError(result.message || "Failed to fetch users data")
        }
      } catch (err) {
        setError("Error fetching users data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsersData()
  }, [])

  const handleViewDetails = (userId) => {
    navigate(`/user-details/${userId}`)
  }

  return (
    <main className="main">
      <Sidebar isCollapsed={sidebarCollapsed} />

      <div className="main2">
        <Navbar onToggleSidebar={toggleSidebar} />

        <div className="middle">
          <div className="container-fluid pt-4 p-2">
            {/* Header */}
            <div className="mb-4">
              <h4>Users Activity</h4>
              <p className="text-muted">Manage and monitor user activities</p>
            </div>

            {/* Loading & Error States */}
            {loading && (
              <div className="alert alert-info">Loading users data...</div>
            )}
            {error && (
              <div className="alert alert-danger">Error: {error}</div>
            )}

            {/* Users Table */}
            {!loading && usersData && usersData.length > 0 && (
              <div className="row g-3">
                <div className="col-md-12">
                  <div className="card p-3">
                    <h6>Users List</h6>
                    <div style={{ overflowX: "auto" }}>
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Created At</th>
                            <th>Scopes</th>
                            <th>Audits</th>
                            <th>Governance</th>
                            <th>Wallet Balance</th>
                            <th>Last Activity</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usersData
                            .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                            .map((user) => (
                            <tr key={user.id}>
                              <td>{user.id}</td>
                              <td>{user.name}</td>
                              <td>
                                <small>{user.email}</small>
                              </td>
                              <td>
                                <small>{new Date(user.created_at).toLocaleDateString()}</small>
                              </td>
                              <td>
                                <span className="badge bg-info">{user.scopes_count}</span>
                              </td>
                              <td>
                                <span className="badge bg-warning">{user.audits_count}</span>
                              </td>
                              <td>
                                <span className="badge bg-secondary">{user.governance_count}</span>
                              </td>
                              <td>
                                <strong>${user.wallet_balance}</strong>
                              </td>
                              <td>
                                <small>
                                  {user.last_activity
                                    ? new Date(user.last_activity).toLocaleDateString()
                                    : "N/A"}
                                </small>
                              </td>
                              <td>
                                <button
                                  onClick={() => handleViewDetails(user.id)}
                                  className="btn btn-sm btn-info"
                                  style={{
                                    backgroundColor: "#0fd1b0",
                                    border: "none",
                                    padding: "5px 10px",
                                    borderRadius: "4px",
                                    color: "white",
                                    fontSize: "12px",
                                  }}
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
                    <div style={{ marginTop: "20px", paddingTop: "15px", borderTop: "1px solid #eee" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
                        <small className="text-muted">
                          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                          {Math.min(currentPage * ITEMS_PER_PAGE, usersData.length)} of {usersData.length} users
                        </small>
                        <div style={{ display: "flex", gap: "5px", flexWrap: "nowrap" }}>
                          <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{
                              padding: "8px 12px",
                              border: "1px solid #ddd",
                              backgroundColor: currentPage === 1 ? "#f5f5f5" : "#fff",
                              cursor: currentPage === 1 ? "not-allowed" : "pointer",
                              borderRadius: "4px",
                              fontSize: "14px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Previous
                          </button>
                          {Array.from({ length: Math.ceil(usersData.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              style={{
                                padding: "8px 12px",
                                minWidth: "40px",
                                backgroundColor: page === currentPage ? "#0fd1b0" : "#fff",
                                color: page === currentPage ? "white" : "#000",
                                border: page === currentPage ? "1px solid #0fd1b0" : "1px solid #ddd",
                                cursor: "pointer",
                                borderRadius: "4px",
                                fontSize: "14px",
                                fontWeight: page === currentPage ? "600" : "400",
                              }}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === Math.ceil(usersData.length / ITEMS_PER_PAGE)}
                            style={{
                              padding: "8px 12px",
                              border: "1px solid #ddd",
                              backgroundColor: currentPage === Math.ceil(usersData.length / ITEMS_PER_PAGE) ? "#f5f5f5" : "#fff",
                              cursor: currentPage === Math.ceil(usersData.length / ITEMS_PER_PAGE) ? "not-allowed" : "pointer",
                              borderRadius: "4px",
                              fontSize: "14px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!loading && usersData && usersData.length === 0 && (
              <div className="alert alert-warning">No users found</div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </main>
  )
}

export default Users
