import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

const DEV_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTE4OGQ0ZTI2NzUzYmY2YmJlN2I5ZiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3NTAzODQyNCwiZXhwIjoxNzc1NjQzMjI0fQ.Q5YECZE9FRdxAesu91PqDs3Janyu1iaqBAFtHMu7R9k";

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return DEV_TOKEN || localStorage.getItem('token');
  }
  return DEV_TOKEN;
};

export const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }
};

API.interceptors.request.use((req) => {
  const token = getAuthToken();
  if (token) req.headers.authorization = `Bearer ${token}`;
  return req;
});

export const getOverview = () => API.get('/analytics/overview');
export const getMonthlyTrend = () => API.get('/analytics/monthly-trend?months=6');
export const getCategoryDistribution = () => API.get('/analytics/category-distribution');
export const getLeaderboard = () => API.get('/analytics/leaderboard?limit=5');

export const getImpactLogs = (filters = {}) => API.get('/impact-logs', { params: filters });
export const getSettings = () => API.get('/settings');
export const updateSettings = (data) => API.put('/settings', data);

export default API;