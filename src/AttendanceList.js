import React, { useState, useEffect } from 'react';
import { attendanceAPI, employeeAPI } from './api';

const AttendanceList = ({ refreshTrigger }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [attendanceRes, employeeRes] = await Promise.all([
        attendanceAPI.getAll(),
        employeeAPI.getAll(),
      ]);

      const attendanceData = attendanceRes.data.results || attendanceRes.data;
      setRecords(attendanceData);

      const empData = employeeRes.data.results || employeeRes.data;
      setEmployeeList(empData);
    } catch (err) {
      setError('Failed to load attendance records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await attendanceAPI.delete(id);
        loadData();
      } catch (err) {
        setError('Failed to delete attendance record');
      }
    }
  };

  const filteredRecords = selectedEmployee
    ? records.filter((record) => record.employee.toString() === selectedEmployee)
    : records;

  if (loading) return <div className="loading"><div className="spinner"></div>Loading records...</div>;

  return (
    <div>
      {error && <div className="alert alert-error">{error}</div>}
      
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label>Filter by Employee:</label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">All Employees</option>
          {employeeList.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name} ({emp.employee_id})
            </option>
          ))}
        </select>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="empty-state">
          <h3>No Attendance Records Found</h3>
          <p>Mark attendance to get started.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td><strong>{record.employee_id}</strong></td>
                  <td>{record.employee_name}</td>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        record.status === 'PRESENT'
                          ? 'badge-success'
                          : 'badge-danger'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => handleDelete(record.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;
