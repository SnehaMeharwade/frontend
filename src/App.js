import React, { useState } from 'react';
import './App.css';
import EmployeeForm from './EmployeeForm';
import EmployeeList from './EmployeeList';
import AttendanceForm from './AttendanceForm';
import AttendanceList from './AttendanceList';
import Dashboard from './Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [employeeRefresh, setEmployeeRefresh] = useState(0);
  const [attendanceRefresh, setAttendanceRefresh] = useState(0);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  const handleEmployeeSuccess = () => {
    setEmployeeRefresh((prev) => prev + 1);
    setEmployeeToEdit(null);
  };

  const handleAttendanceSuccess = () => {
    setAttendanceRefresh((prev) => prev + 1);
  };

  const handleEditEmployee = (employee) => {
    setEmployeeToEdit(employee);
    setActiveTab('employees');
  };

  return (
    <div className="App">
      <header className="header">
        <h1>🏢 HRMS Lite</h1>
        <p>Human Resource Management System</p>
      </header>

      <div className="container">
        <div className="nav-tabs">
          <button
            className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-button ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('employees');
              setEmployeeToEdit(null);
            }}
          >
            Employees
          </button>
          <button
            className={`nav-button ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'dashboard' && (
            <Dashboard employeeRefresh={employeeRefresh} attendanceRefresh={attendanceRefresh} />
          )}

          {activeTab === 'employees' && (
            <div>
              <h2>{employeeToEdit ? 'Edit Employee' : 'Add New Employee'}</h2>
              <EmployeeForm
                onSuccess={handleEmployeeSuccess}
                employeeToEdit={employeeToEdit}
                onCancel={() => setEmployeeToEdit(null)}
              />

              <hr style={{ margin: '40px 0', borderTop: '1px solid #ddd' }} />

              <h2>Employee List</h2>
              <EmployeeList refreshTrigger={employeeRefresh} onEdit={handleEditEmployee} />
            </div>
          )}

          {activeTab === 'attendance' && (
            <div>
              <h2>Mark Attendance</h2>
              <AttendanceForm onSuccess={handleAttendanceSuccess} />

              <hr style={{ margin: '40px 0', borderTop: '1px solid #ddd' }} />

              <h2>Attendance Records</h2>
              <AttendanceList refreshTrigger={attendanceRefresh} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
