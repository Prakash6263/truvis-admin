"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { usersApi } from "../api/usersApi"

const ITEMS_PER_PAGE = 5

const UserDetails = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [scopesPage, setScopesPage] = useState(1)
  const [auditsPage, setAuditsPage] = useState(1)
  const [walletPage, setWalletPage] = useState(1)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  useEffect(() => {
    // Fetch user details from API
    const fetchUserDetails = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        
        if (!token) {
          setError("Authentication token not found")
          setLoading(false)
          return
        }

        const result = await usersApi.getUserDetails(token, userId)

        if (result.success) {
          setUserDetails(result.data)
          setError(null)
        } else {
          setError(result.message || "Failed to fetch user details")
        }
      } catch (err) {
        setError("Error fetching user details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUserDetails()
    }
  }, [userId])

  return (
    <main className="main">
      <Sidebar isCollapsed={sidebarCollapsed} />

      <div className="main2">
        <Navbar onToggleSidebar={toggleSidebar} />

        <div className="middle">
          <div className="container-fluid pt-4 p-2">
            {/* Header with Back Button */}
            <div className="mb-4 d-flex justify-content-between align-items-center">
              <div>
                <h4>User Details</h4>
                <p className="text-muted">View detailed information about the user</p>
              </div>
              <button
                onClick={() => navigate("/users")}
                className="btn btn-secondary"
                style={{
                  backgroundColor: "#6c757d",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  color: "white",
                }}
              >
                <i className="fa fa-arrow-left" style={{ marginRight: "8px" }}></i>
                Back to Users
              </button>
            </div>

            {/* Loading & Error States */}
            {loading && (
              <div className="alert alert-info">Loading user details...</div>
            )}
            {error && (
              <div className="alert alert-danger">Error: {error}</div>
            )}

            {/* User Details */}
            {!loading && userDetails && (
              <div className="row g-3">
                {/* Basic Information */}
                <div className="col-md-6">
                  <div className="card p-4">
                    <h6 className="mb-3">Basic Information</h6>
                    <div className="mb-3">
                      <label className="text-muted">Name</label>
                      <p className="mb-0">
                        <strong>{userDetails.name}</strong>
                      </p>
                    </div>
                    <div className="mb-3">
                      <label className="text-muted">Email</label>
                      <p className="mb-0">
                        <strong>{userDetails.email}</strong>
                      </p>
                    </div>
                    <div className="mb-3">
                      <label className="text-muted">Phone</label>
                      <p className="mb-0">
                        <strong>{userDetails.phone || "N/A"}</strong>
                      </p>
                    </div>
                    <div className="mb-3">
                      <label className="text-muted">Country Code</label>
                      <p className="mb-0">
                        <strong>{userDetails.country_code || "N/A"}</strong>
                      </p>
                    </div>
                    <div className="mb-3">
                      <label className="text-muted">Created At</label>
                      <p className="mb-0">
                        <strong>
                          {new Date(userDetails.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats Card */}
                <div className="col-md-6">
                  <div className="card p-4">
                    <h6 className="mb-3">Statistics</h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div style={{ padding: "15px", backgroundColor: "#f0f9f7", borderRadius: "8px" }}>
                          <p className="text-muted mb-1">Scopes</p>
                          <h5 style={{ color: "#0fd1b0" }}>{userDetails.scopes?.length || 0}</h5>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div style={{ padding: "15px", backgroundColor: "#fff3cd", borderRadius: "8px" }}>
                          <p className="text-muted mb-1">Audits</p>
                          <h5 style={{ color: "#ffc107" }}>{userDetails.audits?.length || 0}</h5>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div style={{ padding: "15px", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
                          <p className="text-muted mb-1">Governance</p>
                          <h5 style={{ color: "#6c757d" }}>{userDetails.governance_checks?.length || 0}</h5>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div style={{ padding: "15px", backgroundColor: "#cfe2ff", borderRadius: "8px" }}>
                          <p className="text-muted mb-1">Wallet Balance</p>
                          <h5 style={{ color: "#0d6efd" }}>${userDetails.wallet_balance}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scopes */}
                {userDetails.scopes && userDetails.scopes.length > 0 && (
                  <div className="col-md-12">
                    <div className="card p-4">
                      <h6 className="mb-3">Scopes</h6>
                      <div style={{ overflowX: "auto" }}>
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Scope ID</th>
                              <th>System Name</th>
                              <th>Processing Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userDetails.scopes
                              .slice((scopesPage - 1) * ITEMS_PER_PAGE, scopesPage * ITEMS_PER_PAGE)
                              .map((scope, index) => (
                                <tr key={index}>
                                  <td>
                                    <small>{scope.scope_id}</small>
                                  </td>
                                  <td>{scope.systemm_name}</td>
                                  <td>
                                    <span
                                      className="badge"
                                      style={{
                                        backgroundColor:
                                          scope.processing_status === "completed" ? "#0fd1b0" : "#ffc107",
                                      }}
                                    >
                                      {scope.processing_status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                      {userDetails.scopes.length > ITEMS_PER_PAGE && (
                        <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
                          <small className="text-muted">
                            Showing {(scopesPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                            {Math.min(scopesPage * ITEMS_PER_PAGE, userDetails.scopes.length)} of{" "}
                            {userDetails.scopes.length}
                          </small>
                          <div style={{ display: "flex", gap: "5px", flexWrap: "nowrap" }}>
                            <button
                              onClick={() => setScopesPage(scopesPage - 1)}
                              disabled={scopesPage === 1}
                              style={{
                                padding: "6px 10px",
                                border: "1px solid #ddd",
                                backgroundColor: scopesPage === 1 ? "#f5f5f5" : "#fff",
                                cursor: scopesPage === 1 ? "not-allowed" : "pointer",
                                borderRadius: "4px",
                                fontSize: "12px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Prev
                            </button>
                            {Array.from({ length: Math.ceil(userDetails.scopes.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(
                              (page) => (
                                <button
                                  key={page}
                                  onClick={() => setScopesPage(page)}
                                  style={{
                                    padding: "6px 10px",
                                    minWidth: "36px",
                                    backgroundColor: page === scopesPage ? "#0fd1b0" : "#fff",
                                    color: page === scopesPage ? "white" : "#000",
                                    border: page === scopesPage ? "1px solid #0fd1b0" : "1px solid #ddd",
                                    cursor: "pointer",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    fontWeight: page === scopesPage ? "600" : "400",
                                  }}
                                >
                                  {page}
                                </button>
                              )
                            )}
                            <button
                              onClick={() => setScopesPage(scopesPage + 1)}
                              disabled={scopesPage === Math.ceil(userDetails.scopes.length / ITEMS_PER_PAGE)}
                              style={{
                                padding: "6px 10px",
                                border: "1px solid #ddd",
                                backgroundColor: scopesPage === Math.ceil(userDetails.scopes.length / ITEMS_PER_PAGE) ? "#f5f5f5" : "#fff",
                                cursor: scopesPage === Math.ceil(userDetails.scopes.length / ITEMS_PER_PAGE) ? "not-allowed" : "pointer",
                                borderRadius: "4px",
                                fontSize: "12px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Audits */}
                {userDetails.audits && userDetails.audits.length > 0 && (
                  <div className="col-md-12">
                    <div className="card p-4">
                      <h6 className="mb-3">Audits</h6>
                      <div style={{ overflowX: "auto" }}>
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Audit ID</th>
                              <th>Type</th>
                              <th>Status</th>
                              <th>Start Date</th>
                              <th>End Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userDetails.audits
                              .slice((auditsPage - 1) * ITEMS_PER_PAGE, auditsPage * ITEMS_PER_PAGE)
                              .map((audit, index) => (
                                <tr key={index}>
                                  <td>
                                    <small>{audit.audit_id}</small>
                                  </td>
                                  <td>{audit.audit_type}</td>
                                  <td>
                                    <span
                                      className="badge"
                                      style={{
                                        backgroundColor:
                                          audit.processing_status === "completed" ? "#0fd1b0" : "#ffc107",
                                      }}
                                    >
                                      {audit.processing_status}
                                    </span>
                                  </td>
                                  <td>{new Date(audit.start_date).toLocaleDateString()}</td>
                                  <td>{new Date(audit.end_date).toLocaleDateString()}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                      {userDetails.audits.length > ITEMS_PER_PAGE && (
                        <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
                          <small className="text-muted">
                            Showing {(auditsPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                            {Math.min(auditsPage * ITEMS_PER_PAGE, userDetails.audits.length)} of{" "}
                            {userDetails.audits.length}
                          </small>
                          <div style={{ display: "flex", gap: "5px", flexWrap: "nowrap" }}>
                            <button
                              onClick={() => setAuditsPage(auditsPage - 1)}
                              disabled={auditsPage === 1}
                              style={{
                                padding: "6px 10px",
                                border: "1px solid #ddd",
                                backgroundColor: auditsPage === 1 ? "#f5f5f5" : "#fff",
                                cursor: auditsPage === 1 ? "not-allowed" : "pointer",
                                borderRadius: "4px",
                                fontSize: "12px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Prev
                            </button>
                            {Array.from({ length: Math.ceil(userDetails.audits.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(
                              (page) => (
                                <button
                                  key={page}
                                  onClick={() => setAuditsPage(page)}
                                  style={{
                                    padding: "6px 10px",
                                    minWidth: "36px",
                                    backgroundColor: page === auditsPage ? "#0fd1b0" : "#fff",
                                    color: page === auditsPage ? "white" : "#000",
                                    border: page === auditsPage ? "1px solid #0fd1b0" : "1px solid #ddd",
                                    cursor: "pointer",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    fontWeight: page === auditsPage ? "600" : "400",
                                  }}
                                >
                                  {page}
                                </button>
                              )
                            )}
                            <button
                              onClick={() => setAuditsPage(auditsPage + 1)}
                              disabled={auditsPage === Math.ceil(userDetails.audits.length / ITEMS_PER_PAGE)}
                              style={{
                                padding: "6px 10px",
                                border: "1px solid #ddd",
                                backgroundColor: auditsPage === Math.ceil(userDetails.audits.length / ITEMS_PER_PAGE) ? "#f5f5f5" : "#fff",
                                cursor: auditsPage === Math.ceil(userDetails.audits.length / ITEMS_PER_PAGE) ? "not-allowed" : "pointer",
                                borderRadius: "4px",
                                fontSize: "12px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Wallet History */}
                {userDetails.wallet_history && userDetails.wallet_history.length > 0 && (
                  <div className="col-md-12">
                    <div className="card p-4">
                      <h6 className="mb-3">Wallet History</h6>
                      <div style={{ overflowX: "auto" }}>
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Action</th>
                              <th>Details</th>
                              <th>Amount</th>
                              <th>Date</th>
                              <th>Transaction ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userDetails.wallet_history
                              .slice((walletPage - 1) * ITEMS_PER_PAGE, walletPage * ITEMS_PER_PAGE)
                              .map((transaction, index) => (
                                <tr key={index}>
                                  <td>
                                    <span
                                      className="badge"
                                      style={{
                                        backgroundColor:
                                          transaction.action === "recharge" ? "#0fd1b0" : "#ff6384",
                                      }}
                                    >
                                      {transaction.action}
                                    </span>
                                  </td>
                                  <td>
                                    <small>{transaction.details}</small>
                                  </td>
                                  <td>
                                    <strong>${transaction.change_amount}</strong>
                                  </td>
                                  <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                                  <td>
                                    <small>{transaction.transaction_id}</small>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                      {userDetails.wallet_history.length > ITEMS_PER_PAGE && (
                        <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
                          <small className="text-muted">
                            Showing {(walletPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                            {Math.min(walletPage * ITEMS_PER_PAGE, userDetails.wallet_history.length)} of{" "}
                            {userDetails.wallet_history.length}
                          </small>
                          <div style={{ display: "flex", gap: "5px", flexWrap: "nowrap" }}>
                            <button
                              onClick={() => setWalletPage(walletPage - 1)}
                              disabled={walletPage === 1}
                              style={{
                                padding: "6px 10px",
                                border: "1px solid #ddd",
                                backgroundColor: walletPage === 1 ? "#f5f5f5" : "#fff",
                                cursor: walletPage === 1 ? "not-allowed" : "pointer",
                                borderRadius: "4px",
                                fontSize: "12px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Prev
                            </button>
                            {Array.from(
                              { length: Math.ceil(userDetails.wallet_history.length / ITEMS_PER_PAGE) },
                              (_, i) => i + 1
                            ).map((page) => (
                              <button
                                key={page}
                                onClick={() => setWalletPage(page)}
                                style={{
                                  padding: "6px 10px",
                                  minWidth: "36px",
                                  backgroundColor: page === walletPage ? "#0fd1b0" : "#fff",
                                  color: page === walletPage ? "white" : "#000",
                                  border: page === walletPage ? "1px solid #0fd1b0" : "1px solid #ddd",
                                  cursor: "pointer",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  fontWeight: page === walletPage ? "600" : "400",
                                }}
                              >
                                {page}
                              </button>
                            ))}
                            <button
                              onClick={() => setWalletPage(walletPage + 1)}
                              disabled={walletPage === Math.ceil(userDetails.wallet_history.length / ITEMS_PER_PAGE)}
                              style={{
                                padding: "6px 10px",
                                border: "1px solid #ddd",
                                backgroundColor: walletPage === Math.ceil(userDetails.wallet_history.length / ITEMS_PER_PAGE) ? "#f5f5f5" : "#fff",
                                cursor: walletPage === Math.ceil(userDetails.wallet_history.length / ITEMS_PER_PAGE) ? "not-allowed" : "pointer",
                                borderRadius: "4px",
                                fontSize: "12px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </main>
  )
}

export default UserDetails
