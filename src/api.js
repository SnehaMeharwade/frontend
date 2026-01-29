import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee API
export const employeeAPI = {
  getAll: () => api.get('/employees/'),
  getById: (id) => api.get(`/employees/${id}/`),
  create: (data) => api.post('/employees/', data),
  update: (id, data) => api.put(`/employees/${id}/`, data),
  delete: (id) => api.delete(`/employees/${id}/`),
  getByDepartment: (dept) => api.get(`/employees/by_department/?dept=${dept}`),
};

// Attendance API
export const attendanceAPI = {
  getAll: () => api.get('/attendance/'),
  getById: (id) => api.get(`/attendance/${id}/`),
  create: (data) => api.post('/attendance/', data),
  update: (id, data) => api.put(`/attendance/${id}/`, data),
  delete: (id) => api.delete(`/attendance/${id}/`),
  getEmployeeRecords: (employeeId) => api.get(`/attendance/employee_records/?employee_id=${employeeId}`),
  filterByDate: (startDate, endDate) => api.get(`/attendance/filter_by_date/?start_date=${startDate}&end_date=${endDate}`),
  getSummary: () => api.get('/attendance/summary/'),
};

export default api;
