import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const RequestAdvance = () => {
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    reason: '',
    repayment_date: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/employee/dashboard-stats`, { withCredentials: true });
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/api/employee/request-advance`,
        {
          ...formData,
          amount: parseFloat(formData.amount)
        },
        { withCredentials: true }
      );
      toast.success('Advance request submitted successfully');
      navigate('/employee/my-requests');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="employee">
      <div data-testid="request-advance-page">
        <h1 className="text-3xl font-outfit font-medium tracking-tight text-slate-900 mb-8">Request Salary Advance</h1>

        {stats && (
          <div className="mb-8 p-6 rounded-2xl bg-blue-50 border border-blue-200" data-testid="stats-info">
            <h3 className="font-medium text-slate-900 mb-2">Your Advance Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Available Advance</p>
                <p className="text-lg font-semibold text-slate-900">₹{stats.available_advance?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-600">Max Limit</p>
                <p className="text-lg font-semibold text-slate-900">₹{stats.max_advance?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-2xl rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="request-form">
            <div>
              <label className="block text-sm font-medium mb-2">Amount (₹) *</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="10000"
                max={stats?.available_advance}
                data-testid="amount-input"
              />
              {stats && (
                <p className="text-xs text-slate-500 mt-1">
                  Maximum available: ₹{stats.available_advance?.toLocaleString()}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Reason (Optional)</label>
              <textarea
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Medical emergency, home repair, etc."
                data-testid="reason-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Repayment Date *</label>
              <input
                type="date"
                required
                value={formData.repayment_date}
                onChange={(e) => setFormData({...formData, repayment_date: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
                data-testid="repayment-date-input"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-6 text-base bg-primary hover:bg-primary/90"
              data-testid="submit-request-btn"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};