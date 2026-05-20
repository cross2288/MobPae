import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/employee/my-requests`, { withCredentials: true });
      setRequests(data);
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="employee">
      <div data-testid="my-requests-page">
        <h1 className="text-3xl font-outfit font-medium tracking-tight text-slate-900 mb-8">My Requests</h1>

        {loading ? (
          <div className="flex items-center justify-center h-64" data-testid="loading-spinner">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-12 text-center" data-testid="no-requests">
            <p className="text-slate-600">No requests yet</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="requests-table">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Request ID</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Amount</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Reason</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Repayment Date</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Status</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => (
                    <tr key={index} className="border-b border-slate-100" data-testid={`request-row-${index}`}>
                      <td className="px-4 py-4 text-sm text-slate-600 font-mono">{request.request_id?.substring(0, 8)}...</td>
                      <td className="px-4 py-4 text-sm text-slate-900 font-medium">₹{request.amount?.toLocaleString()}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{request.reason || '-'}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{request.repayment_date}</td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === 'approved' ? 'bg-green-100 text-green-700' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`} data-testid={`status-badge-${index}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {new Date(request.created_at).toLocaleDateString()}
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