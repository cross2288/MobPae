import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { LogIn } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const { data } = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/me`, {
        credentials: 'include'
      }).then(r => r.json()).catch(() => ({ data: null }));
      
      if (data?.role === 'admin') navigate('/admin');
      else if (data?.role === 'employer') navigate('/employer');
      else if (data?.role === 'employee') navigate('/employee');
      else navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" data-testid="login-page">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-3xl font-outfit font-semibold text-slate-900 mb-2" data-testid="logo-login">Mob Pae</h1>
          </Link>
          <p className="text-slate-600">Sign in to your account</p>
        </div>

        <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="you@company.com"
                data-testid="email-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
                data-testid="password-input"
              />
            </div>
            {error && <p className="text-red-600 text-sm" data-testid="error-message">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-6 text-base bg-primary hover:bg-primary/90"
              data-testid="login-submit-btn"
            >
              {loading ? 'Signing in...' : (
                <span className="flex items-center justify-center">
                  <LogIn className="mr-2 h-5 w-5" /> Sign In
                </span>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-slate-600">
          Don't have an account? Contact your employer
        </p>
      </div>
    </div>
  );
};