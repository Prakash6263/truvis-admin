"use client"

import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  useEffect(() => {
    // Initialize charts after component mounts
    const initCharts = () => {
      if (window.Chart) {
        // Pie Chart 1
        const ctx1 = document.getElementById("pieChart1")
        if (ctx1) {
          new window.Chart(ctx1, {
            type: "doughnut",
            data: {
              labels: ["Spoofing", "Tampering", "Repudiation"],
              datasets: [
                {
                  data: [40, 30, 30],
                  backgroundColor: ["#0fd1b0", "#ff6384", "#36a2eb"],
                },
              ],
            },
          })
        }

        // Pie Chart 2
        const ctx2 = document.getElementById("pieChart2")
        if (ctx2) {
          new window.Chart(ctx2, {
            type: "doughnut",
            data: {
              labels: ["APAC", "EMEA", "AMER"],
              datasets: [
                {
                  data: [30, 40, 30],
                  backgroundColor: ["#0fd1b0", "#ffcd56", "#36a2eb"],
                },
              ],
            },
          })
        }

        // Line Chart
        const ctx3 = document.getElementById("lineChart")
        if (ctx3) {
          new window.Chart(ctx3, {
            type: "line",
            data: {
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
              datasets: [
                {
                  label: "Risks Prevented",
                  data: [200, 400, 300, 500, 700, 600, 800, 750],
                  borderColor: "#0fd1b0",
                  backgroundColor: "rgba(15,209,176,0.2)",
                  fill: true,
                  tension: 0.4,
                },
              ],
            },
          })
        }

        // Bar Chart 2
        const ctx4 = document.getElementById("barChart2")
        if (ctx4) {
          new window.Chart(ctx4, {
            type: "bar",
            data: {
              labels: ["High", "Medium", "Low"],
              datasets: [
                {
                  data: [80, 50, 30],
                  backgroundColor: ["#e74c3c", "#2ecc71", "#3498db"],
                },
              ],
            },
          })
        }
      }
    }

    const timer = setTimeout(initCharts, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="main">
      <Sidebar isCollapsed={sidebarCollapsed} />

      <div className="main2">
        <Navbar onToggleSidebar={toggleSidebar} />

        <div className="middle">
          <div className="container-fluid pt-4 p-2">
            {/* Top Stats */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="stat-card d-flex justify-content-between">
                  <div>
                    <p>Open Risks</p>
                    <h6>
                      $3,000 <span className="text-success">+5%</span>
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
                      2,300 <span className="text-danger">+5%</span>
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
                      +3,052 <span className="text-success">+3%</span>
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
                      173,000+ <span className="text-success">+8%</span>
                    </h6>
                  </div>
                  <div>
                    <img src="icons/Icon4.png" alt="icon4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Charts */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="card p-3">
                  <h6>Threat Classification</h6>
                  <canvas id="pieChart1" height="200"></canvas>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3 text-center">
                  <h6>File Upload</h6>
                  <button className="btn btn-info text-white mt-4">Upload</button>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3">
                  <h6>Jurisdictional Breakdown</h6>
                  <canvas id="pieChart2" height="200"></canvas>
                </div>
              </div>
            </div>

            {/* Line Chart */}
            <div className="row g-3 mb-4">
              <div className="col-md-12">
                <div className="card p-3">
                  <h6>Successfully Risk Prevented</h6>
                  <canvas id="lineChart" height="300"></canvas>
                </div>
              </div>
            </div>

            {/* Reports & Compliance */}
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
                      <tr>
                        <td>
                          <i className="fa fa-file-alt text-primary"></i> Soft UI Version
                        </td>
                        <td>Spoofing</td>
                        <td>DDoS Attack</td>
                        <td>
                          <div className="progress" style={{ height: "8px" }}>
                            <div
                              className="progress-bar bg-warning"
                              role="progressbar"
                              style={{ width: "80%" }}
                              aria-valuenow="80"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                          <small>80%</small>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i className="fa fa-file-alt text-primary"></i> Add Progress Track
                        </td>
                        <td>Tampering</td>
                        <td>XSS Attack</td>
                        <td>
                          <div className="progress" style={{ height: "8px" }}>
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{ width: "30%" }}
                              aria-valuenow="30"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                          <small>30%</small>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i className="fa fa-file-alt text-primary"></i> Fix Platform Errors
                        </td>
                        <td>Repudiation</td>
                        <td>SQL Injection</td>
                        <td>
                          <div className="progress" style={{ height: "8px" }}>
                            <div
                              className="progress-bar bg-danger"
                              role="progressbar"
                              style={{ width: "100%" }}
                              aria-valuenow="100"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                          <small>100%</small>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i className="fa fa-file-alt text-primary"></i> Launch Mobile App
                        </td>
                        <td>Information Disclosure</td>
                        <td>Phishing</td>
                        <td>
                          <div className="progress" style={{ height: "8px" }}>
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{ width: "25%" }}
                              aria-valuenow="25"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                          <small>25%</small>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i className="fa fa-file-alt text-primary"></i> Add New Pricing Page
                        </td>
                        <td>Elevation of Privilege</td>
                        <td>Session Hijack</td>
                        <td>
                          <div className="progress" style={{ height: "8px" }}>
                            <div
                              className="progress-bar bg-warning"
                              role="progressbar"
                              style={{ width: "40%" }}
                              aria-valuenow="40"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                          <small>40%</small>
                        </td>
                      </tr>
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
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default Dashboard
