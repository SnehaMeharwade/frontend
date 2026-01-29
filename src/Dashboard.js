import React, { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI } from './api';

const Dashboard = ({ employeeRefresh, attendanceRefresh }) => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalRecords: 0,
    totalPresent: 0,
    totalAbsent: 0,
  });
  const [employeeSummary, setEmployeeSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [employeeRefresh, attendanceRefresh]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [empRes, summaryRes] = await Promise.all([
        employeeAPI.getAll(),
        attendanceAPI.getSummary(),
      ]);

      const employees = empRes.data.results || empRes.data;
      const summary = summaryRes.data;

      setStats({
        totalEmployees: Array.isArray(employees) ? employees.length : 0,
        totalRecords: summary.reduce((acc, emp) => acc + emp.total_records, 0),
        totalPresent: summary.reduce((acc, emp) => acc + emp.total_present, 0),
        totalAbsent: summary.reduce((acc, emp) => acc + emp.total_absent, 0),
      });

      setEmployeeSummary(summary);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div>Loading dashboard...</div>;
  }

  return (
    <div>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Employees</div>
          <div className="stat-value">{stats.totalEmployees}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Attendance Records</div>
          <div className="stat-value">{stats.totalRecords}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Present Days</div>
          <div className="stat-value" style={{ color: '#28a745' }}>
            {stats.totalPresent}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Absent Days</div>
          <div className="stat-value" style={{ color: '#dc3545' }}>
            {stats.totalAbsent}
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>Employee Attendance Summary</h3>

      {employeeSummary.length === 0 ? (
        <div className="empty-state">
          <h3>No Data</h3>
          <p>Add employees and mark attendance to see the summary.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Total Records</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Attendance Rate</th>
              </tr>
            </thead>
            <tbody>
              {employeeSummary.map((emp, idx) => {
                const rate =
                  emp.total_records > 0
                    ? ((emp.total_present / emp.total_records) * 100).toFixed(1)
                    : 0;
                return (
                  <tr key={idx}>
                    <td><strong>{emp.name}</strong></td>
                    <td>{emp.total_records}</td>
                    <td>
                      <span className="badge badge-success">{emp.total_present}</span>
                    </td>
                    <td>
                      <span className="badge badge-danger">{emp.total_absent}</span>
                    </td>
                    <td>
                      <strong
                        style={{
                          color: rate >= 80 ? '#28a745' : rate >= 60 ? '#ffc107' : '#dc3545',
                        }}
                      >
                        {rate}%
                      </strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
