import api from "./api";

export const getTanks = async () => {
  const response = await api.get("/admin/tanks");
  return response.data;
};

export const createTank = async (data: any) => {
  const response = await api.post("/admin/tanks", data);
  return response.data;
};

export const updateTank = async (id: number, data: any) => {
  const response = await api.put(`/admin/tanks/${id}`, data);
  return response.data;
};

export const deleteTank = async (id: number) => {
  const response = await api.delete(`/admin/tanks/${id}`);
  return response.data;
};