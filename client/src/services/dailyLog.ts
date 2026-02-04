import api from "./api";

export const getDailyLogs = async () => {
  const res = await api.get("/operator/daily-logs");
  return res.data;
};

export const createDailyLog = async (data: any) => {
  const res = await api.post("/operator/daily-logs", data);
  return res.data;
};
