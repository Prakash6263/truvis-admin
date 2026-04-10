const API_BASE_URL = "https://python.aitechnotech.in/truvis/superadmin"

export const usersApi = {
  async getUsersActivity(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/users-activity`, {
        method: "GET",
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        return {
          success: false,
          message: "Failed to fetch users",
          data: null,
        }
      }

      const data = await response.json()
      return {
        success: data.status === 1,
        message: data.status === 1 ? "Success" : "Failed",
        data: data.data || [],
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      return {
        success: false,
        message: error.message,
        data: null,
      }
    }
  },

  async getUserDetails(token, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/user-details/${userId}`, {
        method: "GET",
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        return {
          success: false,
          message: "Failed to fetch user details",
          data: null,
        }
      }

      const data = await response.json()
      return {
        success: data.status === 1,
        message: data.status === 1 ? "Success" : "Failed",
        data: data.data || null,
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
      return {
        success: false,
        message: error.message,
        data: null,
      }
    }
  },
}
