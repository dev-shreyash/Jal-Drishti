import api from "./api";

export interface OperatorPump {
  pump_id: string | number;
  pump_name: string;
  status: string;
  power_hp: number;
}

export interface OperatorTank {
  tank_id: string | number;
  tank_name: string;
  capacity_liters: number;
  is_smart_tank: boolean;
}

export async function getOperatorPumps(operatorId: number): Promise<OperatorPump[]> {
  const response = await api.get(`/operator-data/pumps/${operatorId}`);
  return response.data;
}

export async function getOperatorTanks(operatorId: number): Promise<OperatorTank[]> {
  const response = await api.get(`/operator-data/tanks/${operatorId}`);
  return response.data;
}