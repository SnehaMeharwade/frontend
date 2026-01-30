import axios from "axios";

/**
 * API BASE URL
 * Local: http://127.0.0.1:8000
 * Prod : https://website-2u84.onrender.com
 */
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  "https://website-2u84.onrender.com";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= EMPLOYEE API ================= */
export const employeeAPI = {
  getAll: () => api.get("/employees/"),
  getById: (id) => api.get(`/employees/${id}/`),
  create: (data) => api.post("/employees/", data),
  update: (id, data) => api.put(`/employees/${id}/`, data),
  delete: (id) => api.delete(`/employees/${id}/`),
  getByDepartment: (dept) =>
    api.get(`/employees/by_department/?dept=${dept}`),
};

/* ================= ATTENDANCE API ================= */
export const attendanceAPI = {
  getAll: () => api.get("/attendance/"),
  getById: (id) => api.get(`/attendance/${id}/`),
  create: (data) => api.post("/attendance/", data),
  update: (id, data) => api.put(`/attendance/${id}/`),
  delete: (id) => api.delete(`/attendance/${id}/`),
  getEmployeeRecords: (employeeId) =>
    api.get(`/attendance/employee_records/?employee_id=${employeeId}`),
  filterByDate: (startDate, endDate) =>
    api.get(
      `/attendance/filter_by_date/?start_date=${startDate}&end_date=${endDate}`
    ),
  getSummary: () => api.get("/attendance/summary/"),
};

export default api;
