import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { LogIn, Shield, Building2, UserRound } from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("admin@mobpae.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (!result.success) {
      setLoading(false);
      setError(result.error || "Login failed");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/me`,
        {
          credentials: "include",
        }
      );

      const me = await res.json();
      setLoading(false);

      const user = me?.data || me?.user || me;

      if (user?.role === "admin") navigate("/admin");
      else if (user?.role === "employer") navigate("/employer");
      else if (user?.role === "employee") navigate("/employee");
      else navigate("/");
    } catch (err) {
      setLoading(false);
      setError("Unable to fetch user role");
    }
  };

  const fillDemo = (role) => {
    setError("");

    if (role === "admin") {
      setEmail("admin@mobpae.com");
      setPassword("admin123");
    }

    if (role === "employer") {
      setEmail("employer@mobpae.com");
      setPassword("employer123");
    }

    if (role === "employee") {
      setEmail("employee@mobpae.com");
      setPassword("employee123");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
        {/* Left */}
        <div className="hidden lg:block">
          <Link to="/">
            <h1 className="text-4xl font-outfit font-bold text-slate-900 mb-4">
              Mob <span className="text-blue-600">Pae</span>
            </h1>
          </Link>

          <h2 className="text-5xl font-bold text-slate-900 leading-tight">
            One login for your complete salary advance platform.
          </h2>

          <p className="text-slate-600 text-lg mt-6 max-w-lg">
            Admins, employers, and employees can securely access their dashboard
            from one simple login screen.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-10">
            <button
              type="button"
              onClick={() => fillDemo("admin")}
              className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-blue-500 hover:shadow-md transition"
            >
              <Shield className="text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900">Admin</h3>
              <p className="text-xs text-slate-500 mt-1">Platform control</p>
            </button>

            <button
              type="button"
              onClick={() => fillDemo("employer")}
              className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-blue-500 hover:shadow-md transition"
            >
              <Building2 className="text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900">Employer</h3>
              <p className="text-xs text-slate-500 mt-1">Manage employees</p>
            </button>

            <button
              type="button"
              onClick={() => fillDemo("employee")}
              className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-blue-500 hover:shadow-md transition"
            >
              <UserRound className="text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900">Employee</h3>
              <p className="text-xs text-slate-500 mt-1">Request advance</p>
            </button>
          </div>
        </div>

        {/* Right Login Card */}
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8 lg:hidden">
            <Link to="/">
              <h1 className="text-3xl font-outfit font-semibold text-slate-900 mb-2">
                Mob <span className="text-blue-600">Pae</span>
              </h1>
            </Link>
            <p className="text-slate-600">Sign in to your account</p>
          </div>

          <div className="rounded-3xl bg-white shadow-[0_20px_60px_rgb(15,23,42,0.08)] border border-slate-100 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Welcome back
              </h2>
              <p className="text-slate-500 mt-1">
                Sign in using your registered email.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-6 text-base bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <span className="flex items-center justify-center">
                    <LogIn className="mr-2 h-5 w-5" /> Sign In
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 grid grid-cols-3 gap-2 lg:hidden">
              <button
                onClick={() => fillDemo("admin")}
                className="text-xs border rounded-xl py-2"
              >
                Admin
              </button>
              <button
                onClick={() => fillDemo("employer")}
                className="text-xs border rounded-xl py-2"
              >
                Employer
              </button>
              <button
                onClick={() => fillDemo("employee")}
                className="text-xs border rounded-xl py-2"
              >
                Employee
              </button>
            </div>
          </div>

          <p className="text-center mt-6 text-sm text-slate-600">
            Don&apos;t have an account? Contact your employer
          </p>
        </div>
      </div>
    </div>
  );
};
