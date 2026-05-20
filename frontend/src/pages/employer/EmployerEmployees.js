import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const EmployerEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/employer/employees`, { withCredentials: true });
      setEmployees(data);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="employer">
      <div data-testid="employer-employees">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-outfit font-medium tracking-tight text-slate-900">Employees</h1>
          <Button
            onClick={() => setShowAddModal(true)}
            className="rounded-full bg-primary hover:bg-primary/90"
            data-testid="add-employee-btn"
          >
            <Plus className="h-5 w-5 mr-2" /> Add Employee
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64" data-testid="loading-spinner">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : employees.length === 0 ? (
          <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-12 text-center" data-testid="no-employees">
            <p className="text-slate-600 mb-4">No employees added yet</p>
            <Button onClick={() => setShowAddModal(true)} className="rounded-full bg-primary hover:bg-primary/90" data-testid="add-first-employee-btn">
              <Plus className="h-5 w-5 mr-2" /> Add Your First Employee
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="employees-table">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Name</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Email</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Phone</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Monthly Salary</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Advance Limit</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee, index) => (
                    <tr key={index} className="border-b border-slate-100" data-testid={`employee-row-${index}`}>
                      <td className="px-4 py-4 text-sm text-slate-900">{employee.name}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{employee.email}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{employee.phone_number}</td>
                      <td className="px-4 py-4 text-sm text-slate-900 font-medium">₹{employee.monthly_salary?.toLocaleString()}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{employee.advance_limit_percentage}%</td>
                      <td className="px-4 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700" data-testid={`status-badge-${index}`}>
                          {employee.status || 'active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showAddModal && (
          <AddEmployeeModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              loadEmployees();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

const AddEmployeeModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    monthly_salary: '',
    advance_limit_percentage: '30',
    department: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/api/employer/add-employee`,
        {
          ...formData,
          monthly_salary: parseFloat(formData.monthly_salary),
          advance_limit_percentage: parseFloat(formData.advance_limit_percentage)
        },
        { withCredentials: true }
      );
      toast.success('Employee added successfully');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" data-testid="add-employee-modal">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-outfit font-medium">Add Employee</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-900" data-testid="close-modal-btn">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" data-testid="add-employee-form">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  data-testid="name-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  data-testid="email-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  data-testid="phone-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Monthly Salary *</label>
                <input
                  type="number"
                  required
                  value={formData.monthly_salary}
                  onChange={(e) => setFormData({...formData, monthly_salary: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="50000"
                  data-testid="salary-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Advance Limit % *</label>
                <input
                  type="number"
                  required
                  min="20"
                  max="40"
                  value={formData.advance_limit_percentage}
                  onChange={(e) => setFormData({...formData, advance_limit_percentage: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  data-testid="limit-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Department (Optional)</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  data-testid="department-input"
                />
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-slate-700">
              Default password will be <strong>employee123</strong>. Employee should change it after first login.
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-6 text-base bg-primary hover:bg-primary/90"
              data-testid="submit-employee-btn"
            >
              {loading ? 'Adding...' : 'Add Employee'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};