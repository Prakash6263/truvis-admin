const API_BASE_URL = "https://aitechnotech.in/Truvis";
// const API_BASE_URL = "http://localhost:5000"

const getAuthToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

export const planApi = {
    
  // ➕ 1. CREATE PLAN
  createPlan: async (planData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, message: "Unauthorized. Please login again." };
      }

      const response = await fetch(`${API_BASE_URL}/admin/plans/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: planData.name,
          price: Number(planData.price),
          credits: Number(planData.credits),
          isFree: Boolean(planData.isFree),
          description: planData.description,
          features: planData.features,
        }),
      });

      const data = await response.json();
      console.log("data", data);
      return response.ok && data.status === 1
        ? { success: true, data }
        : { success: false, message: data.message || "Failed to create plan" };
    } catch (error) {
      console.error("Create plan error:", error);
      return { success: false, message: "Network error. Please try again." };
    }
  },

  // 📄 2. GET ALL PLANS
  getPlans: async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, message: "Unauthorized. Please login again." };
      }

      const response = await fetch(`${API_BASE_URL}/admin/plans/`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      // console.log("getPlans", data)

      return response.ok
        ? { success: true, data }
        : { success: false, message: data.message || "Failed to fetch plans" };
    } catch (error) {
      console.error("Get plans error:", error);
      return { success: false, message: "Network error. Please try again." };
    }
  },

  // ✏️ 3. UPDATE PLAN
  updatePlan: async (planId, planData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, message: "Unauthorized. Please login again." };
      }

      const response = await fetch(`${API_BASE_URL}/admin/plans/${planId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: planData.name,
          price: Number(planData.price),
          credits: Number(planData.credits),
          isFree: Boolean(planData.isFree),
          description: planData.description,
          features: planData.features,
        }),
      });

      const data = await response.json();

      return response.ok
        ? { success: true, data }
        : { success: false, message: data.message || "Failed to update plan" };
    } catch (error) {
      console.error("Update plan error:", error);
      return { success: false, message: "Network error. Please try again." };
    }
  },

  // 🗑 4. DELETE PLAN
  deletePlan: async (planId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, message: "Unauthorized. Please login again." };
      }

      const response = await fetch(`${API_BASE_URL}/admin/plans/${planId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      return response.ok
        ? { success: true, data }
        : { success: false, message: data.message || "Failed to delete plan" };
    } catch (error) {
      console.error("Delete plan error:", error);
      return { success: false, message: "Network error. Please try again." };
    }
  },
};
