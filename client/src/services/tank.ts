import api from "./api";

export const getTanks = async () => {
  const res = await api.get("/admin/tanks");
  return res.data;
};

export const createTank = async (data: any) => {
  const res = await api.post("/admin/tanks", data);
  return res.data;
};

export const updateTank = async (id: number, data: any) => {
  const res = await api.put(`/admin/tanks/${id}`, data);
  return res.data;
};

export const deleteTank = async (id: number) => {
  const res = await api.delete(`/admin/tanks/${id}`);
  return res.data;
};
