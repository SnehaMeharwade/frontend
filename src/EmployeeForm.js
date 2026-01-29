import React, { useState, useEffect } from 'react';
import { employeeAPI } from './api';

const EmployeeForm = ({ onSuccess, employeeToEdit, onCancel }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: 'IT',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employeeToEdit) {
      setFormData(employeeToEdit);
    }
  }, [employeeToEdit]);

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
    setLoading(true);

    try {
      if (employeeToEdit) {
        await employeeAPI.update(employeeToEdit.id, formData);
      } else {
        await employeeAPI.create(formData);
      }
      setFormData({
        employee_id: '',
        full_name: '',
        email: '',
        department: 'IT',
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Error saving employee. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      
      <div className="form-row">
        <div className="form-group">
          <label>Employee ID *</label>
          <input
            type="text"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            placeholder="e.g., EMP001"
            required
          />
        </div>
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="e.g., John Doe"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g., john@example.com"
            required
          />
        </div>
        <div className="form-group">
          <label>Department *</label>
          <select name="department" value={formData.department} onChange={handleChange}>
            <option value="HR">Human Resources</option>
            <option value="IT">Information Technology</option>
            <option value="SALES">Sales</option>
            <option value="MARKETING">Marketing</option>
            <option value="FINANCE">Finance</option>
            <option value="OPERATIONS">Operations</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      <div className="button-group">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : (employeeToEdit ? 'Update Employee' : 'Add Employee')}
        </button>
        {employeeToEdit && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default EmployeeForm;
