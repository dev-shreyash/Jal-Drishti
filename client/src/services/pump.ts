import api from "./api";

export const getPumps = async () => {
  const res = await api.get("/admin/pumps");
  return res.data;
};

export const createPump = async (data: any) => {
  const res = await api.post("/admin/pumps", data);
  return res.data;
};

export const updatePump = async (id: number, data: any) => {
  const res = await api.put(`/admin/pumps/${id}`, data);
  return res.data;
};

export const deletePump = async (id: number) => {
  const res = await api.delete(`/admin/pumps/${id}`);
  return res.data;
};
