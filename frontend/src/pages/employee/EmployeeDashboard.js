import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import axios from 'axios';
import { Wallet, TrendingUp, Calendar, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const EmployeeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, requestsRes] = await Promise.all([
        axios.get(`${API_URL}/api/employee/dashboard-stats`, { withCredentials: true }),
        axios.get(`${API_URL}/api/employee/my-requests`, { withCredentials: true })
      ]);

      setStats(statsRes.data);
      setRecentRequests(requestsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="employee">
      <div data-testid="employee-dashboard">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-outfit font-medium tracking-tight text-slate-900">Employee Dashboard</h1>
          <Link to="/employee/request-advance">
            <Button className="rounded-full bg-primary hover:bg-primary/90" data-testid="request-advance-btn">
              <Wallet className="h-5 w-5 mr-2" /> Request Advance
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64" data-testid="loading-spinner">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Monthly Salary"
                value={`₹${stats?.monthly_salary?.toLocaleString() || 0}`}
                icon={TrendingUp}
                color="blue"
                testId="monthly-salary-card"
              />
              <StatCard
                title="Available Advance"
                value={`₹${stats?.available_advance?.toLocaleString() || 0}`}
                icon={Wallet}
                color="green"
                testId="available-advance-card"
              />
              <StatCard
                title="Max Advance Limit"
                value={`₹${stats?.max_advance?.toLocaleString() || 0}`}
                icon={Calendar}
                color="purple"
                testId="max-advance-card"
              />
              <StatCard
                title="Usage"
                value={`${stats?.usage_percentage?.toFixed(1) || 0}%`}
                icon={Activity}
                color="orange"
                testId="usage-card"
              />
            </div>

            <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-outfit font-medium">Recent Requests</h2>
                <Link to="/employee/my-requests">
                  <Button variant="ghost" size="sm" className="text-primary" data-testid="view-all-requests-btn">
                    View All
                  </Button>
                </Link>
              </div>
              {recentRequests.length === 0 ? (
                <div className="text-center py-8" data-testid="no-recent-requests">
                  <p className="text-slate-600 mb-4">No requests yet</p>
                  <Link to="/employee/request-advance">
                    <Button className="rounded-full bg-primary hover:bg-primary/90" data-testid="make-first-request-btn">
                      <Wallet className="h-5 w-5 mr-2" /> Make Your First Request
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full" data-testid="recent-requests-table">
                    <thead className="border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Reason</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Repayment Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRequests.map((request, index) => (
                        <tr key={index} className="border-b border-slate-100" data-testid={`request-row-${index}`}>
                          <td className="px-4 py-3 text-sm text-slate-900 font-medium">₹{request.amount?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{request.reason || '-'}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{request.repayment_date}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              request.status === 'approved' ? 'bg-green-100 text-green-700' :
                              request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {request.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
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
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6" data-testid={testId}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className="text-sm text-slate-600 mb-1">{title}</p>
      <p className="text-2xl font-outfit font-semibold text-slate-900">{value}</p>
    </div>
  );
};