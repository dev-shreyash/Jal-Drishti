import { isAxiosError } from "axios";
import api from "./api";

export interface OperatorLoginData {
  username: string;
  password: string;
}

export interface Operator {
  id: string | number;
  username: string;
  name?: string;
  role?: string;
}

export interface OperatorLoginResponse {
  token: string;
  operator?: Operator;
}

export async function operatorLogin(data: OperatorLoginData): Promise<OperatorLoginResponse> {
  try {
    const response = await api.post<OperatorLoginResponse>("/operator/login", data);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError<{ error?: string }>(error)) {
      throw new Error(error.response?.data?.error || "Invalid credentials");
    }
    throw new Error("An unexpected error occurred during login");
  }
}