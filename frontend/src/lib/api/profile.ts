import { httpClient } from "@/lib/api/http";

export const getUserProfileStats = async (
  period?: "all" | "month" | "week"
) => {
  const params = period && period !== "all" ? `?period=${period}` : "";
  const response = await httpClient.get(`user/stats${params}`);
  return response.data.data;
};
