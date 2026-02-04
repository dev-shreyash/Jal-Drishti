import api from "./api";

export const getOperators = async () => {
  const res = await api.get("/admin/operators");
  return res.data;
};

export const createOperator = async (data: any) => {
  const res = await api.post("/admin/operators", data);
  return res.data;
};

export const updateOperator = async (id: number, data: any) => {
  const res = await api.put(`/admin/operators/${id}`, data);
  return res.data;
};

export const deleteOperator = async (id: number) => {
  const res = await api.delete(`/admin/operators/${id}`);
  return res.data;
};
