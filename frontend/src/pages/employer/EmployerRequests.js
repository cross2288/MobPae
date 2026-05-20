import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const EmployerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/employer/advance-requests`, { withCredentials: true });
      setRequests(data);
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    setActionLoading(requestId);
    try {
      await axios.post(
        `${API_URL}/api/employer/handle-request`,
        { request_id: requestId, action },
        { withCredentials: true }
      );
      toast.success(`Request ${action}d successfully`);
      loadRequests();
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout role="employer">
      <div data-testid="employer-requests">
        <h1 className="text-3xl font-outfit font-medium tracking-tight text-slate-900 mb-8">Advance Requests</h1>

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
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Employee</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Email</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Amount</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Reason</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Repayment Date</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Status</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => (
                    <tr key={index} className="border-b border-slate-100" data-testid={`request-row-${index}`}>
                      <td className="px-4 py-4 text-sm text-slate-900">{request.employee_name}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{request.employee_email}</td>
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
                      <td className="px-4 py-4">
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAction(request.request_id, 'approve')}
                              disabled={actionLoading === request.request_id}
                              className="rounded-lg bg-green-600 hover:bg-green-700"
                              data-testid={`approve-btn-${index}`}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(request.request_id, 'reject')}
                              disabled={actionLoading === request.request_id}
                              className="rounded-lg border-red-300 text-red-600 hover:bg-red-50"
                              data-testid={`reject-btn-${index}`}
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </div>
                        )}
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