"use client"

import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Swal from "sweetalert2"
import { CirclesWithBar } from "react-loader-spinner"
import { planApi } from "../api/planApi"

const Plans = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    credits: "",
    isFree: false,
    description: "",
    features: "",
  })
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchingPlans, setFetchingPlans] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [editFormData, setEditFormData] = useState({
    name: "",
    price: "",
    credits: "",
    isFree: false,
    description: "",
    features: "",
  })

  // Fetch all plans
  const fetchPlans = async () => {
    setFetchingPlans(true)
    setError("")
    try {
      const result = await planApi.getPlans()
      if (result.success) {
        setPlans(result.data || [])
      } else {
        setError(result.message || "Failed to fetch plans")
      }
    } catch (err) {
      setError("Failed to fetch plans. Network error.")
      console.error(err)
    }
    setFetchingPlans(false)
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Create new plan
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    const featuresArray = formData.features
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0)

    const planData = {
      name: formData.name,
      price: Number.parseFloat(formData.price) || 0,
      credits: Number.parseInt(formData.credits) || 0,
      isFree: formData.isFree,
      description: formData.description,
      features: featuresArray,
    }

    try {
      const result = await planApi.createPlan(planData)
      if (result.success) {
        setSuccess("Plan created successfully!")
        fetchPlans()
        setFormData({
          name: "",
          price: "",
          credits: "",
          isFree: false,
          description: "",
          features: "",
        })
      } 
      // else {
      //   setError(result.message || "Failed to create plan")
      // }
    } catch (err) {
      console.error(err)
      setError("Failed to create plan. Network error.")
    }

    setLoading(false)
  }

  // Edit plan modal
  const handleEditClick = (plan) => {
    setEditingPlan(plan)
    setEditFormData({
      name: plan.name,
      price: plan.price.toString(),
      credits: plan.credits.toString(),
      isFree: plan.isFree,
      description: plan.description,
      features: plan.features.join(", "),
    })
    setShowEditModal(true)
    setError("")
    setSuccess("")
  }

  // Update plan
  const handleUpdatePlan = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    const featuresArray = editFormData.features
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0)

    const planData = {
      name: editFormData.name,
      price: Number.parseFloat(editFormData.price) || 0,
      credits: Number.parseInt(editFormData.credits) || 0,
      isFree: editFormData.isFree,
      description: editFormData.description,
      features: featuresArray,
    }

    try {
      const result = await planApi.updatePlan(editingPlan.id, planData)
      if (result.success) {
        setSuccess("Plan updated successfully!")
        setShowEditModal(false)
        setEditingPlan(null)
        fetchPlans()
      } else {
        setError(result.message || "Failed to update plan")
      }
    } catch (err) {
      console.error(err)
      setError("Failed to update plan. Network error.")
    }

    setLoading(false)
  }

  // Delete plan
  const handleDeletePlan = async (planId, planName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete the plan "${planName}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    })

    if (!result.isConfirmed) return

    setError("")
    setSuccess("")

    try {
      const deleteResult = await planApi.deletePlan(planId)
      if (deleteResult.success) {
        await Swal.fire({
          title: "Deleted!",
          text: "Plan deleted successfully!",
          icon: "success",
          confirmButtonColor: "#3ac6bd",
          confirmButtonText: "OK",
        })
        fetchPlans()
      } else {
        await Swal.fire({
          title: "Error!",
          text: deleteResult.message || "Failed to delete plan",
          icon: "error",
          confirmButtonColor: "#3ac6bd",
          confirmButtonText: "OK",
        })
      }
    } catch (err) {
      console.error(err)
      await Swal.fire({
        title: "Error!",
        text: "Failed to delete plan. Network error.",
        icon: "error",
        confirmButtonColor: "#3ac6bd",
        confirmButtonText: "OK",
      })
    }
  }

  return (
    <main className="main">
      <Sidebar isCollapsed={sidebarCollapsed} />
      <div className="main2">
        <Navbar onToggleSidebar={toggleSidebar} />

        <div className="middle">
          <div className="container-fluid pt-4 p-2">
            <h4 className="mb-4" style={{ color: "#3ac6bd", fontWeight: "600" }}>
              Plans Management
            </h4>

            {/* Create Plan Form */}
            <div className="row g-3 mb-4">
              <div className="col-md-12">
                <div className="card p-4">
                  <h5 className="mb-3">Create New Plan</h5>

                  {error && <div className="alert alert-danger">{error}</div>}
                  {success && <div className="alert alert-success">{success}</div>}

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Plan Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g., Max Plan"
                          required
                        />
                      </div>

                      <div className="col-md-3">
                        <label className="form-label">Price ($)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="10"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      <div className="col-md-3">
                        <label className="form-label">Credits</label>
                        <input
                          type="number"
                          className="form-control"
                          name="credits"
                          value={formData.credits}
                          onChange={handleInputChange}
                          placeholder="100"
                          min="0"
                          required
                        />
                      </div>

                      <div className="col-md-12">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows="3"
                          required
                        />
                      </div>

                      <div className="col-md-12">
                        <label className="form-label">Features (comma-separated)</label>
                        <input
                          type="text"
                          className="form-control"
                          name="features"
                          value={formData.features}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="col-md-12">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name="isFree"
                            id="isFree"
                            checked={formData.isFree}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="isFree">
                            This is a free plan
                          </label>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <button
                          type="submit"
                          className="btn text-white"
                          disabled={loading}
                          style={{ backgroundColor: "#3ac6bd", border: "none", padding: "10px 24px", borderRadius: "8px", fontWeight: "500" }}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Creating...
                            </>
                          ) : (
                            "Create Plan"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* All Plans Table */}
            <div className="row g-3">
              <div className="col-md-12">
                <div className="card p-4">
                  <h5 className="mb-3">All Plans</h5>

                  {fetchingPlans ? (
                    <div className="text-center py-4">
                      <CirclesWithBar height="100" width="100" color="#3AC6BD" outerCircleColor="#3AC6BD" innerCircleColor="#3AC6BD" barColor="#3AC6BD" visible={true} />
                    </div>
                  ) : plans.length === 0 ? (
                    <div className="text-center py-4 text-muted">No plans found. Create your first plan above!</div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead style={{ backgroundColor: "#f8f9fa" }}>
                          <tr>
                            <th>Plan Name</th>
                            <th>Price</th>
                            <th>Credits</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Features</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {plans.map((plan) => (
                            <tr key={plan.id}>
                              <td><strong style={{ color: "#3ac6bd" }}>{plan.name}</strong></td>
                              <td>${plan.price}</td>
                              <td>{plan.credits}</td>
                              <td>
                                <span className="badge" style={{ backgroundColor: plan.isFree ? "#28a745" : "#3ac6bd", color: "white", padding: "6px 12px", borderRadius: "6px" }}>
                                  {plan.isFree ? "Free" : "Paid"}
                                </span>
                              </td>
                              <td><small style={{ maxWidth: "200px", display: "block" }}>{plan.description}</small></td>
                              <td>
                                <ul style={{ marginBottom: 0, paddingLeft: "20px", fontSize: "14px" }}>
                                  {plan.features.map((feature, idx) => <li key={idx}>{feature}</li>)}
                                </ul>
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button onClick={() => handleEditClick(plan)} className="btn btn-sm text-white" style={{ backgroundColor: "#3ac6bd", border: "none", padding: "6px 12px", borderRadius: "6px" }}>
                                    <i className="fa fa-edit me-1"></i>Update
                                  </button>
                                  <button onClick={() => handleDeletePlan(plan.id, plan.name)} className="btn btn-sm btn-danger" style={{ padding: "6px 12px", borderRadius: "6px" }}>
                                    <i className="fa fa-trash me-1"></i>Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Plan Modal */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ borderBottom: "2px solid #3ac6bd" }}>
                <h5 className="modal-title" style={{ color: "#3ac6bd", fontWeight: "600" }}>
                  Update Plan: {editingPlan?.name}
                </h5>
                <button type="button" className="btn-close" onClick={() => { setShowEditModal(false); setEditingPlan(null); setError(""); }}></button>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleUpdatePlan}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Plan Name</label>
                      <input type="text" className="form-control" name="name" value={editFormData.name} onChange={handleEditInputChange} required />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Price ($)</label>
                      <input type="number" className="form-control" name="price" value={editFormData.price} onChange={handleEditInputChange} min="0" step="0.01" required />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Credits</label>
                      <input type="number" className="form-control" name="credits" value={editFormData.credits} onChange={handleEditInputChange} min="0" required />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label">Description</label>
                      <textarea className="form-control" name="description" value={editFormData.description} onChange={handleEditInputChange} rows="3" required />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label">Features (comma-separated)</label>
                      <input type="text" className="form-control" name="features" value={editFormData.features} onChange={handleEditInputChange} required />
                    </div>

                    <div className="col-md-12">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" name="isFree" checked={editFormData.isFree} onChange={handleEditInputChange} />
                        <label className="form-check-label">This is a free plan</label>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer mt-3" style={{ border: "none" }}>
                    <button type="button" className="btn btn-secondary" onClick={() => { setShowEditModal(false); setEditingPlan(null); setError(""); }}>Cancel</button>
                    <button type="submit" className="btn text-white" disabled={loading} style={{ backgroundColor: "#3ac6bd" }}>
                      {loading ? "Updating..." : "Update Plan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}

export default Plans
