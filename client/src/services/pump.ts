import api from "./api";

export const getPumps = async () => {
  const response = await api.get("/admin/pumps");
  return response.data;
};

export const createPump = async (data: any) => {
  const response = await api.post("/admin/pumps", data);
  return response.data;
};

export const updatePump = async (id: number, data: any) => {
  const response = await api.put(`/admin/pumps/${id}`, data);
  return response.data;
};

export const deletePump = async (id: number) => {
  const response = await api.delete(`/admin/pumps/${id}`);
  return response.data;
};