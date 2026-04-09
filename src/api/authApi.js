const API_BASE_URL = "https://aitechnotech.in/Truvis"
// const API_BASE_URL = "http://localhost:5000"

export const authApi = {
  // 🔐 LOGIN
  login: async (email, password) => {
    try {
      const url = `${API_BASE_URL}/superadmin/login?email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      })

      const data = await response.json()

      if (response.ok && data.status === 1) {
        if (data.token) {
          localStorage.setItem("token", data.token)
        }

        return { success: true, data }
      } else {
        return {
          success: false,
          message: data.message || "Invalid email or password",
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        message: "Network error. Please try again.",
      }
    }
  },

  // 📝 REGISTER
  register: async (name, email, password) => {
    try {
      const url = `${API_BASE_URL}/superadmin/register?name=${encodeURIComponent(
        name
      )}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(
        password
      )}`

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      })

      const data = await response.json()

      if (response.ok && data.status === 1) {
        return {
          success: true,
          data,
        }
      } else {
        return {
          success: false,
          message: data.message || "Registration failed",
        }
      }
    } catch (error) {
      console.error("Register error:", error)
      return {
        success: false,
        message: "Network error. Please try again.",
      }
    }
  },
}
