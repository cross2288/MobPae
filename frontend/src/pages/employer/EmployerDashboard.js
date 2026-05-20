import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import axios from 'axios';
import { Users, UserCheck, Clock, CheckCircle, XCircle, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const EmployerDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalApprovedAmount: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [employeesRes, requestsRes] = await Promise.all([
        axios.get(`${API_URL}/api/employer/employees`, { withCredentials: true }),
        axios.get(`${API_URL}/api/employer/advance-requests`, { withCredentials: true })
      ]);

      const employees = employeesRes.data;
      const requests = requestsRes.data;

      setStats({
        totalEmployees: employees.length,
        activeEmployees: employees.filter(e => e.status === 'active').length,
        pendingRequests: requests.filter(r => r.status === 'pending').length,
        approvedRequests: requests.filter(r => r.status === 'approved').length,
        rejectedRequests: requests.filter(r => r.status === 'rejected').length,
        totalApprovedAmount: requests
          .filter(r => r.status === 'approved')
          .reduce((sum, r) => sum + (r.amount || 0), 0)
      });

      setRecentRequests(requests.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="employer">
      <div data-testid="employer-dashboard">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-outfit font-medium tracking-tight text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">Welcome back, manage your team here</p>
          </div>
          <Link to="/employer/employees" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90" data-testid="manage-employees-btn">
              <Plus className="h-5 w-5 mr-2" /> Add Employee
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64" data-testid="loading-spinner">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              <StatCard
                title="Total Employees"
                value={stats.totalEmployees}
                icon={Users}
                color="blue"
                testId="total-employees-card"
              />
              <StatCard
                title="Active"
                value={stats.activeEmployees}
                icon={UserCheck}
                color="green"
                testId="active-employees-card"
              />
              <StatCard
                title="Pending"
                value={stats.pendingRequests}
                icon={Clock}
                color="yellow"
                testId="pending-requests-card"
              />
              <StatCard
                title="Approved"
                value={stats.approvedRequests}
                icon={CheckCircle}
                color="green"
                testId="approved-requests-card"
              />
              <StatCard
                title="Rejected"
                value={stats.rejectedRequests}
                icon={XCircle}
                color="red"
                testId="rejected-requests-card"
              />
              <StatCard
                title="Approved Amount"
                value={`₹${stats.totalApprovedAmount.toLocaleString()}`}
                icon={TrendingUp}
                color="indigo"
                testId="approved-amount-card"
              />
            </div>

            <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-outfit font-medium">Recent Requests</h2>
                <Link to="/employer/requests">
                  <Button variant="ghost" size="sm" className="text-primary" data-testid="view-all-requests-btn">
                    View All
                  </Button>
                </Link>
              </div>
              {recentRequests.length === 0 ? (
                <p className="text-slate-600 text-center py-8" data-testid="no-recent-requests">No requests yet</p>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full" data-testid="recent-requests-table">
                      <thead className="border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Employee</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Amount</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Reason</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentRequests.map((request, index) => (
                          <tr key={index} className="border-b border-slate-100" data-testid={`request-row-${index}`}>
                            <td className="px-4 py-3 text-sm text-slate-900">{request.employee_name}</td>
                            <td className="px-4 py-3 text-sm text-slate-900 font-medium">₹{request.amount?.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{request.reason || '-'}</td>
                            <td className="px-4 py-3 text-sm">
                              <StatusBadge status={request.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-3" data-testid="recent-requests-cards">
                    {recentRequests.map((request, index) => (
                      <div key={index} className="border border-slate-100 rounded-xl p-4" data-testid={`request-card-${index}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-slate-900">{request.employee_name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{request.reason || 'No reason provided'}</p>
                          </div>
                          <StatusBadge status={request.status} />
                        </div>
                        <p className="text-lg font-outfit font-semibold text-slate-900 mt-2">₹{request.amount?.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
    status === 'approved' ? 'bg-green-100 text-green-700' :
    status === 'rejected' ? 'bg-red-100 text-red-700' :
    'bg-yellow-100 text-yellow-700'
  }`}>
    {status}
  </span>
);

const StatCard = ({ title, value, icon: Icon, color, testId }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };

  return (
    <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-4 sm:p-6" data-testid={testId}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>
      <p className="text-xs sm:text-sm text-slate-600 mb-1">{title}</p>
      <p className="text-lg sm:text-2xl font-outfit font-semibold text-slate-900 break-words">{value}</p>
    </div>
  );
};
