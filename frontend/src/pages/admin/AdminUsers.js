import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/users`, { withCredentials: true });
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div data-testid="admin-users">
        <h1 className="text-3xl font-outfit font-medium tracking-tight text-slate-900 mb-8">All Users</h1>

        {loading ? (
          <div className="flex items-center justify-center h-64" data-testid="loading-spinner">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="users-table">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Name</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Email</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Role</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index} className="border-b border-slate-100" data-testid={`user-row-${index}`}>
                      <td className="px-4 py-4 text-sm text-slate-900">{user.name}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{user.email}</td>
                      <td className="px-4 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize" data-testid={`role-badge-${index}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`} data-testid={`status-badge-${index}`}>
                          {user.status || 'active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};