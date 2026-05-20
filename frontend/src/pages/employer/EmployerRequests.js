import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { CheckCircle, XCircle, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const EmployerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState('all');

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

  const filteredRequests = filter === 'all'
    ? requests
    : requests.filter(r => r.status === filter);

  const filters = [
    { value: 'all', label: 'All', count: requests.length },
    { value: 'pending', label: 'Pending', count: requests.filter(r => r.status === 'pending').length },
    { value: 'approved', label: 'Approved', count: requests.filter(r => r.status === 'approved').length },
    { value: 'rejected', label: 'Rejected', count: requests.filter(r => r.status === 'rejected').length },
  ];

  return (
    <DashboardLayout role="employer">
      <div data-testid="employer-requests">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-outfit font-medium tracking-tight text-slate-900">Advance Requests</h1>
          <p className="text-sm text-slate-600 mt-1">Review and approve employee advance requests</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0" data-testid="filter-tabs">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === f.value
                  ? 'bg-primary text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
              data-testid={`filter-${f.value}`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64" data-testid="loading-spinner">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-12 text-center" data-testid="no-requests">
            <p className="text-slate-600">No {filter !== 'all' ? filter : ''} requests</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="requests-table">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Employee</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Amount</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Reason</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Repayment</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Status</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request, index) => (
                      <tr key={request.request_id || index} className="border-b border-slate-100" data-testid={`request-row-${index}`}>
                        <td className="px-4 py-4">
                          <p className="text-sm text-slate-900 font-medium">{request.employee_name}</p>
                          <p className="text-xs text-slate-500">{request.employee_email}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-900 font-medium">₹{request.amount?.toLocaleString()}</td>
                        <td className="px-4 py-4 text-sm text-slate-600 max-w-xs truncate">{request.reason || '-'}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{request.repayment_date}</td>
                        <td className="px-4 py-4 text-sm">
                          <StatusBadge status={request.status} testId={`status-badge-${index}`} />
                        </td>
                        <td className="px-4 py-4">
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleAction(request.request_id, 'approve')}
                                disabled={actionLoading === request.request_id}
                                className="rounded-lg bg-green-600 hover:bg-green-700 text-white"
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

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3" data-testid="requests-cards">
              {filteredRequests.map((request, index) => (
                <div
                  key={request.request_id || index}
                  className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-4"
                  data-testid={`request-card-${index}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-slate-900">
                        <User className="h-4 w-4 flex-shrink-0" />
                        <p className="font-medium truncate">{request.employee_name}</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{request.employee_email}</p>
                    </div>
                    <StatusBadge status={request.status} testId={`status-badge-${index}`} />
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-slate-100">
                    <span className="text-sm text-slate-600">Amount</span>
                    <span className="text-2xl font-outfit font-semibold text-slate-900">₹{request.amount?.toLocaleString()}</span>
                  </div>

                  {request.reason && (
                    <p className="text-sm text-slate-600 mb-3 italic">"{request.reason}"</p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-slate-600 mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>Repayment: {request.repayment_date}</span>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAction(request.request_id, 'approve')}
                        disabled={actionLoading === request.request_id}
                        className="flex-1 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                        data-testid={`approve-btn-${index}`}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(request.request_id, 'reject')}
                        disabled={actionLoading === request.request_id}
                        className="flex-1 rounded-lg border-red-300 text-red-600 hover:bg-red-50"
                        data-testid={`reject-btn-${index}`}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

const StatusBadge = ({ status, testId }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
      status === 'approved' ? 'bg-green-100 text-green-700' :
      status === 'rejected' ? 'bg-red-100 text-red-700' :
      'bg-yellow-100 text-yellow-700'
    }`}
    data-testid={testId}
  >
    {status}
  </span>
);
