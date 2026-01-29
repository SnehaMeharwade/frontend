import React, { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI } from './api';

const AttendanceForm = ({ onSuccess }) => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee: '',
    date: new Date().toISOString().split('T')[0],
    status: 'PRESENT',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await employeeAPI.getAll();
        setEmployees(response.data.results || response.data);
      } catch (err) {
        setError('Failed to load employees');
      } finally {
        setLoadingEmployees(false);
      }
    };
    loadEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await attendanceAPI.create(formData);
      setSuccess('Attendance marked successfully!');
      setFormData({
        employee: '',
        date: new Date().toISOString().split('T')[0],
        status: 'PRESENT',
      });
      onSuccess();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error marking attendance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingEmployees) {
    return <div className="loading"><div className="spinner"></div>Loading employees...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="form-row">
        <div className="form-group">
          <label>Employee *</label>
          <select
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            required
          >
            <option value="">Select an employee...</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name} ({employee.employee_id})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Status *</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="PRESENT">Present</option>
          <option value="ABSENT">Absent</option>
        </select>
      </div>

      <div className="button-group">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Marking...' : 'Mark Attendance'}
        </button>
      </div>
    </form>
  );
};

export default AttendanceForm;
