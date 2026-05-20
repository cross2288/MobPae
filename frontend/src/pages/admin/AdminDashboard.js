import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import axios from 'axios';
import { Users, Building2, Wallet, TrendingUp } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEmployers: 0,
    totalEmployees: 0,
    pendingEnquiries: 0,
    totalRequests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [usersRes, enquiriesRes, requestsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/users`, { withCredentials: true }),
        axios.get(`${API_URL}/api/admin/enquiries`, { withCredentials: true }),
        axios.get(`${API_URL}/api/admin/advance-requests`, { withCredentials: true })
      ]);

      const users = usersRes.data;
      const enquiries = enquiriesRes.data;
      const requests = requestsRes.data;

      setStats({
        totalUsers: users.length,
        totalEmployers: users.filter(u => u.role === 'employer').length,
        totalEmployees: users.filter(u => u.role === 'employee').length,
        pendingEnquiries: enquiries.filter(e => e.status === 'pending').length,
        totalRequests: requests.length
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div data-testid="admin-dashboard">
        <h1 className="text-3xl font-outfit font-medium tracking-tight text-slate-900 mb-8">Admin Dashboard</h1>

        {loading ? (
          <div className="flex items-center justify-center h-64" data-testid="loading-spinner">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
              color="blue"
              testId="total-users-card"
            />
            <StatCard
              title="Employers"
              value={stats.totalEmployers}
              icon={Building2}
              color="green"
              testId="total-employers-card"
            />
            <StatCard
              title="Employees"
              value={stats.totalEmployees}
              icon={Users}
              color="purple"
              testId="total-employees-card"
            />
            <StatCard
              title="Pending Enquiries"
              value={stats.pendingEnquiries}
              icon={TrendingUp}
              color="orange"
              testId="pending-enquiries-card"
            />
            <StatCard
              title="Advance Requests"
              value={stats.totalRequests}
              icon={Wallet}
              color="indigo"
              testId="total-requests-card"
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ title, value, icon: Icon, color, testId }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };

  return (
    <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6" data-testid={testId}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className="text-sm text-slate-600 mb-1">{title}</p>
      <p className="text-3xl font-outfit font-semibold text-slate-900">{value}</p>
    </div>
  );
};