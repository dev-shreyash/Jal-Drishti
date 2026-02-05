import api from "./api";

// --- Types ---

export interface AdminStats {
  villageName: string;
  population: number;
  pumps: number;
  operators: number;
  complaints: number;
  alerts: number;
}

export interface AiAlert {
  pumpId: number;
  name: string;
  healthScore: number;
  status: "At Risk" | "Critical";
  predictedFailure: string;
  riskFactor: string;
}

export interface AiInsightsResponse {
  success: boolean;
  alerts: AiAlert[];
}

export interface Complaint {
  id: number;
  resident_name: string;
  village: string;
  issue_type: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED";
  date: string;
  priority: "HIGH" | "MEDIUM" | "CRITICAL";
}

export interface SystemAlert {
  id: string;
  asset: string;
  message: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  timestamp: string;
}

// --- API Methods ---

// 1. Get General Dashboard Stats
export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    const response = await api.get("/admin/dashboard/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
};

// 2. Get AI/ML Predictions & Alerts
export const getAiInsights = async (): Promise<AiInsightsResponse> => {
  try {
    const response = await api.get("/admin/dashboard/ai-insights");
    return response.data;
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    return { success: false, alerts: [] };
  }
};

export const getComplaints = async (): Promise<Complaint[]> => {
  try {
    const response = await api.get("/admin/complaints");
    return response.data;
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return []; // Return empty array on failure
  }
};

export const updateComplaintStatus = async (id: number, status: string, comment: string) => {
  try {
    const response = await api.put(`/admin/complaints/${id}`, { status, comment });
    return response.data;
  } catch (error) {
    console.error("Error updating complaint:", error);
    throw error;
  }
};

export const getSystemAlerts = async (): Promise<SystemAlert[]> => {
  try {
    const response = await api.get("/admin/alerts");
    return response.data;
  } catch (error) {
    console.error("Error fetching system alerts:", error);
    return [];
  }
};

// export const getAdminStats = async () => {
//   const response = await api.get("/admin/dashboard/stats");
//   return response.data; // This now contains real DB counts
// };