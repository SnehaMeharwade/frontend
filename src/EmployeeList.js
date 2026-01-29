import React, { useState, useEffect } from 'react';
import { employeeAPI } from './api';

const EmployeeList = ({ refreshTrigger, onEdit }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const loadEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data.results || response.data);
    } catch (err) {
      setError('Failed to load employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(id);
        setDeleteSuccess('Employee deleted successfully!');
        loadEmployees();
        setTimeout(() => setDeleteSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete employee');
      }
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading employees...</div>;

  return (
    <div>
      {deleteSuccess && <div className="alert alert-success">{deleteSuccess}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      
      {employees.length === 0 ? (
        <div className="empty-state">
          <h3>No Employees Found</h3>
          <p>Add your first employee to get started.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td><strong>{employee.employee_id}</strong></td>
                  <td>{employee.full_name}</td>
                  <td>{employee.email}</td>
                  <td><span className="badge badge-info">{employee.department}</span></td>
                  <td>
                    <button
                      className="btn btn-primary btn-small"
                      onClick={() => onEdit(employee)}
                      style={{ marginRight: '8px' }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => handleDelete(employee.id)}
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

export default EmployeeList;
