
import React, { useState } from 'react';
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Compass,
  Calendar,
  BookOpen,
  DollarSign,
  Shield,
  LogOut,
  User,
  Menu,
  X,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = user?.role || 'student';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = {
    student: [
      { name: 'Student Hub', path: '/student', icon: LayoutDashboard },
      { name: 'Explore Mentors', path: '/discover', icon: Compass },
      { name: 'My Sessions', path: '/student#sessions', icon: Calendar },
    ],
    mentor: [
      { name: 'Mentor Studio', path: '/mentor', icon: LayoutDashboard },
      { name: 'My Packages', path: '/mentor#packages', icon: BookOpen },
      { name: 'Calendar & Slots', path: '/mentor#calendar', icon: Calendar },
      { name: 'Earnings & Reviews', path: '/mentor#earnings', icon: DollarSign },
    ],
    admin: [
      { name: 'Admin Overview', path: '/admin', icon: Shield },
      { name: 'Mentor Verifications', path: '/admin#verifications', icon: User },
      { name: 'Bookings & Escrow', path: '/admin#bookings', icon: Calendar },
    ],
  }[role];

  const roleBadgeStyle = {
    student: 'bg-blue-50 text-blue-700 border-blue-200',
    mentor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    admin: 'bg-purple-50 text-purple-700 border-purple-200',
  }[role];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            SB
          </div>
          <span className="font-bold text-gray-900 text-base">SkillBridge</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 md:min-h-screen flex flex-col justify-between`}
      >
        <div className="p-5">
          <Link to="/" className="hidden md:flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-base shadow-sm">
              SB
            </div>
            <div>
              <div className="font-bold text-gray-900 text-base leading-none">SkillBridge</div>
              <div className="text-[10px] text-gray-500 font-medium tracking-wide uppercase mt-1">
                Workspace
              </div>
            </div>
          </Link>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-gray-200 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-xs text-gray-900 truncate">
                  {user?.name || 'Demo User'}
                </div>
                <div className="text-[11px] text-gray-500 truncate">{user?.email || 'user@example.com'}</div>
              </div>
            </div>
            <div className="mt-2.5 pt-2.5 border-t border-gray-200 flex items-center justify-between">
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md border ${roleBadgeStyle}`}>
                {role} account
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 px-3 py-1">
              Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-slate-100 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100 space-y-1.5">
          <Link
            to="/discover"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-slate-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              Public Marketplace
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
