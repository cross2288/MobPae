import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/enquiries`, { withCredentials: true });
      setEnquiries(data);
    } catch (error) {
      console.error('Failed to load enquiries:', error);
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowApprovalModal(true);
  };

  return (
    <DashboardLayout role="admin">
      <div data-testid="admin-enquiries">
        <h1 className="text-3xl font-outfit font-medium tracking-tight text-slate-900 mb-8">Employer Enquiries</h1>

        {loading ? (
          <div className="flex items-center justify-center h-64" data-testid="loading-spinner">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-12 text-center" data-testid="no-enquiries">
            <p className="text-slate-600">No enquiries yet</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="enquiries-table">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Company</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Contact Person</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Email</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">City</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Employees</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Status</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enquiry, index) => (
                    <tr key={index} className="border-b border-slate-100" data-testid={`enquiry-row-${index}`}>
                      <td className="px-4 py-4 text-sm text-slate-900">{enquiry.company_name}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{enquiry.contact_person_name}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{enquiry.work_email}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{enquiry.city}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{enquiry.number_of_employees}</td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          enquiry.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`} data-testid={`status-badge-${index}`}>
                          {enquiry.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {enquiry.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleApprove(enquiry)}
                            className="rounded-lg bg-primary hover:bg-primary/90"
                            data-testid={`approve-btn-${index}`}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showApprovalModal && (
          <ApprovalModal
            enquiry={selectedEnquiry}
            onClose={() => {
              setShowApprovalModal(false);
              setSelectedEnquiry(null);
            }}
            onSuccess={() => {
              setShowApprovalModal(false);
              setSelectedEnquiry(null);
              loadEnquiries();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

const ApprovalModal = ({ enquiry, onClose, onSuccess }) => {
  const [email, setEmail] = useState(enquiry.work_email);
  const [password, setPassword] = useState('employer123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/api/admin/approve-employer`,
        {
          enquiry_id: enquiry.work_email,
          employer_email: email,
          employer_password: password
        },
        { withCredentials: true }
      );
      toast.success('Employer approved successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to approve employer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" data-testid="approval-modal">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl">
        <h2 className="text-2xl font-outfit font-medium mb-4">Approve Employer</h2>
        <p className="text-sm text-slate-600 mb-6">Create account for {enquiry.company_name}</p>
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="approval-form">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              data-testid="employer-email-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Temporary Password</label>
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              data-testid="employer-password-input"
            />
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl"
              data-testid="cancel-btn"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
              data-testid="confirm-approve-btn"
            >
              {loading ? 'Approving...' : 'Approve'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};