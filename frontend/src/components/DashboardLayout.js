import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Users, FileText, LogOut, Building2, Wallet, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';

export const DashboardLayout = ({ children, role }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/enquiries', icon: FileText, label: 'Enquiries' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/requests', icon: Wallet, label: 'Advance Requests' },
  ];

  const employerLinks = [
    { to: '/employer', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/employer/employees', icon: Users, label: 'Employees' },
    { to: '/employer/requests', icon: Wallet, label: 'Advance Requests' },
  ];

  const employeeLinks = [
    { to: '/employee', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/employee/request-advance', icon: Wallet, label: 'Request Advance' },
    { to: '/employee/my-requests', icon: Clock, label: 'My Requests' },
  ];

  const links = role === 'admin' ? adminLinks : role === 'employer' ? employerLinks : employeeLinks;

  return (
    <div className="min-h-screen bg-slate-50 flex" data-testid="dashboard-layout">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col" data-testid="sidebar">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-outfit font-semibold text-slate-900" data-testid="sidebar-logo">Mob Pae</h1>
          <p className="text-sm text-slate-600 mt-1 capitalize">{role} Portal</p>
        </div>
        <nav className="flex-1 p-4" data-testid="sidebar-nav">
          <ul className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-200">
          <div className="mb-3 px-4 py-2">
            <p className="text-sm font-medium text-slate-900" data-testid="user-name">{user?.name}</p>
            <p className="text-xs text-slate-600" data-testid="user-email">{user?.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-slate-700 hover:bg-red-50 hover:text-red-600"
            data-testid="logout-btn"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto" data-testid="main-content">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};