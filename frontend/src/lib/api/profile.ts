import { httpClient } from '@/lib/api/http';
export const getUserProfileStats = async () => {
  const response = await httpClient.get('user/stats');
  return response.data.data;
};