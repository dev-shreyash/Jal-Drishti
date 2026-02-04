import api from "./api";

export const getVillages = async () => {
  const res = await api.get("/admin/villages");
  return res.data;
};


export const addVillage = async (data: any) => {
  const res = await api.post("/admin/villages", data);
  return res.data;
};

export const updateVillage = async (id: number, data: any) => {
  const res = await api.put(`/admin/villages/${id}`, data);
  return res.data;
};

export const deleteVillage = async (id: number) => {
  const res = await api.delete(`/admin/villages/${id}`);
  return res.data;
};
