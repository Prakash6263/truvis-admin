const API_BASE_URL = "https://python.aitechnotech.in/truvis"

export const dashboardApi = {
  // 📊 GET DASHBOARD STATS
  getDashboardStats: async (token) => {
    try {
      const url = `${API_BASE_URL}/superadmin/dashboard-stats`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok && data.status === 1) {
        return {
          success: true,
          data: data,
        }
      } else {
        return {
          success: false,
          message: data.message || "Failed to fetch dashboard stats",
        }
      }
    } catch (error) {
      console.error("Dashboard stats error:", error)
      return {
        success: false,
        message: "Network error. Please try again.",
      }
    }
  },
}
