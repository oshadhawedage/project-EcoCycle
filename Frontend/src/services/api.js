import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5050/api', 
});

const DEV_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTE4ODRlZTI2NzUzYmY2YmJlN2I5OSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzc0OTcyMTUwLCJleHAiOjE3NzU1NzY5NTB9.RbEIphqvadL85US8okUH_jDYM10Q7hSi0z3XS9m94Pg";

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

// ================= PICKUP REQUEST APIs =================

// USER: create pickup request from ewaste item
export const createPickupRequest = (data) => API.post("/pickups", data);

// RECYCLER / ADMIN: get all pickup requests
export const getAllPickupRequests = () => API.get("/pickups");

// RECYCLER / ADMIN: get single pickup request details
export const getPickupRequestById = (id) => API.get(`/pickups/${id}`);

// RECYCLER: accept pickup request
export const acceptPickupRequest = (id) => API.put(`/pickups/${id}/accept`);

// RECYCLER: get accepted pickup requests
export const getAcceptedPickupRequests = () => API.get("/pickups/accepted/my");

// RECYCLER / ADMIN: update pickup status
export const updatePickupRequestStatus = (id, status) =>
  API.put(`/pickups/${id}/status`, { status });

// ADMIN: delete pickup request
export const deletePickupRequest = (id) => API.delete(`/pickups/${id}`);