"use client"

import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { dashboardApi } from "../api/dashboardApi"

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  useEffect(() => {
    // Fetch dashboard data from API
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        
        if (!token) {
          setError("Authentication token not found")
          setLoading(false)
          return
        }

        const result = await dashboardApi.getDashboardStats(token)

        if (result.success) {
          setDashboardData(result.data)
          setError(null)
        } else {
          setError(result.message || "Failed to fetch dashboard data")
        }
      } catch (err) {
        setError("Error fetching dashboard data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  useEffect(() => {
    // Initialize charts after dashboard data is loaded
    const initCharts = () => {
      if (window.Chart && dashboardData) {
        // Pie Chart 1 - Threat Classification
        const ctx1 = document.getElementById("pieChart1")
        if (ctx1) {
          const threatData = dashboardData.threat_classification || {}
          const labels = Object.keys(threatData)
          const data = Object.values(threatData)
          
          new window.Chart(ctx1, {
            type: "doughnut",
            data: {
              labels: labels,
              datasets: [
                {
                  data: data,
                  backgroundColor: ["#0fd1b0", "#ff6384", "#36a2eb", "#ffcd56", "#ff9999", "#99ccff"],
                },
              ],
            },
          })
        }

        // Pie Chart 2 - Jurisdictional Breakdown
        const ctx2 = document.getElementById("pieChart2")
        if (ctx2) {
          const jurisdictionData = dashboardData.jurisdiction || {}
          const labels = Object.keys(jurisdictionData)
          const data = Object.values(jurisdictionData)
          
          new window.Chart(ctx2, {
            type: "doughnut",
            data: {
              labels: labels,
              datasets: [
                {
                  data: data,
                  backgroundColor: ["#0fd1b0", "#ffcd56", "#36a2eb", "#ff6384"],
                },
              ],
            },
          })
        }

        // Line Chart - Risks Prevented
        const ctx3 = document.getElementById("lineChart")
        if (ctx3) {
          const riskData = dashboardData.risks_prevented_chart || []
          const labels = riskData.map(item => {
            const date = new Date(item.month)
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
          })
          const data = riskData.map(item => item.count)
          
          new window.Chart(ctx3, {
            type: "line",
            data: {
              labels: labels,
              datasets: [
                {
                  label: "Risks Prevented",
                  data: data,
                  borderColor: "#0fd1b0",
                  backgroundColor: "rgba(15,209,176,0.2)",
                  fill: true,
                  tension: 0.4,
                },
              ],
            },
          })
        }

        // Bar Chart 2 - Severity Distribution
        const ctx4 = document.getElementById("barChart2")
        if (ctx4) {
          // Count severity levels from recent reports
          const reports = dashboardData.recent_reports || []
          const severityCount = {
            Critical: 0,
            High: 0,
            Medium: 0,
            Low: 0
          }
          
          reports.forEach(report => {
            if (severityCount.hasOwnProperty(report.severity)) {
              severityCount[report.severity]++
            }
          })
          
          new window.Chart(ctx4, {
            type: "bar",
            data: {
              labels: Object.keys(severityCount),
              datasets: [
                {
                  data: Object.values(severityCount),
                  backgroundColor: ["#e74c3c", "#ff9999", "#ffcd56", "#2ecc71"],
                },
              ],
            },
          })
        }
      }
    }

    const timer = setTimeout(initCharts, 100)
    return () => clearTimeout(timer)
  }, [dashboardData])

  return (
    <main className="main">
      <Sidebar isCollapsed={sidebarCollapsed} />

      <div className="main2">
        <Navbar onToggleSidebar={toggleSidebar} />

        <div className="middle">
          <div className="container-fluid pt-4 p-2">
            {/* Loading & Error States */}
            {loading && (
              <div className="alert alert-info">Loading dashboard data...</div>
            )}
            {error && (
              <div className="alert alert-danger">Error: {error}</div>
            )}

            {/* Top Stats */}
            {!loading && dashboardData && (
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <div className="stat-card d-flex justify-content-between">
                    <div>
                      <p>Open Risks</p>
                      <h6>
                        {dashboardData.metrics?.open_risks || 0}
                      </h6>
                    </div>
                    <div>
                      <img src="icons/Icon1.png" alt="icon1" />
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stat-card d-flex justify-content-between">
                    <div>
                      <p>High Severity</p>
                      <h6>
                        {dashboardData.metrics?.high_severity || 0}
                      </h6>
                    </div>
                    <div>
                      <img src="icons/Icon2.png" alt="icon2" />
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stat-card d-flex justify-content-between">
                    <div>
                      <p>Detections</p>
                      <h6>
                        +{dashboardData.metrics?.detections || 0}
                      </h6>
                    </div>
                    <div>
                      <img src="icons/Icon3.png" alt="icon3" />
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stat-card d-flex justify-content-between">
                    <div>
                      <p>AI Analyzed</p>
                      <h6>
                        {dashboardData.metrics?.ai_analyzed || 0}
                      </h6>
                    </div>
                    <div>
                      <img src="icons/Icon4.png" alt="icon4" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Middle Charts */}
            {!loading && dashboardData && (
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="card p-3">
                    <h6>Threat Classification</h6>
                    <canvas id="pieChart1" height="200"></canvas>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card p-3">
                    <h6>Jurisdictional Breakdown</h6>
                    <canvas id="pieChart2" height="200"></canvas>
                  </div>
                </div>
              </div>
            )}

            {/* Line Chart */}
            {!loading && dashboardData && (
              <div className="row g-3 mb-4">
                <div className="col-md-12">
                  <div className="card p-3">
                    <h6>Successfully Risk Prevented</h6>
                    <canvas id="lineChart" height="300"></canvas>
                  </div>
                </div>
              </div>
            )}

            {/* Reports & Compliance */}
            {!loading && dashboardData && (
            <div className="row g-3">
              <div className="col-md-9">
                <div className="card p-3">
                  <h6>AI Reports</h6>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Report</th>
                        <th>Category</th>
                        <th>Attack Type</th>
                        <th>Severity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData?.recent_reports?.slice(0, 5).map((report, index) => {
                        const severityScore = report.severity_score || 0
                        const barColor = 
                          report.severity === "Critical" ? "bg-danger" :
                          report.severity === "High" ? "bg-warning" :
                          report.severity === "Medium" ? "bg-info" : "bg-success"
                        
                        return (
                          <tr key={index}>
                            <td>
                              <i className="fa fa-file-alt text-primary"></i> {report.report}
                            </td>
                            <td>{report.category}</td>
                            <td>
                              <span style={{fontSize: '0.85em'}}>{report.attack_type.substring(0, 30)}{report.attack_type.length > 30 ? '...' : ''}</span>
                            </td>
                            <td>
                              <div className="progress" style={{ height: "8px" }}>
                                <div
                                  className={`progress-bar ${barColor}`}
                                  role="progressbar"
                                  style={{ width: `${severityScore}%` }}
                                  aria-valuenow={severityScore}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <small>{report.severity} ({severityScore}%)</small>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3">
                  <h6>Compliance Check Usage</h6>
                  <canvas id="barChart2" height="250"></canvas>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default Dashboard
