/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";

// Fetch all operators
export const getOperators = async () => {
  const response = await api.get("/admin/operators"); // Ensure backend route exists
  return response.data;
};

// Create new operator
export const createOperator = async (data: any) => {
  const response = await api.post("/admin/operators", data);
  return response.data;
};

// Update existing operator
export const updateOperator = async (id: number, data: any) => {
  const response = await api.put(`/admin/operators/${id}`, data);
  return response.data;
};

// Delete operator
export const deleteOperator = async (id: number) => {
  const response = await api.delete(`/admin/operators/${id}`);
  return response.data;
};