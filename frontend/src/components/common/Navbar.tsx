import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Layers,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Bell,
  Clock,
  Check,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const { user, logout, notifications, unreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'mentor') return '/mentor';
    return '/student';
  };

  const getDashboardLabel = () => {
    if (!user) return '';
    if (user.role === 'admin') return 'Admin Console';
    if (user.role === 'mentor') return 'Mentor Studio';
    return 'Student Hub';
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldCheck className="w-3 h-3" /> Admin
          </span>
        );
      case 'mentor':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">
            <Briefcase className="w-3 h-3" /> Mentor
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <GraduationCap className="w-3 h-3" /> Student
          </span>
        );
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0B1020] via-[#1E293B] to-[#4F7CFF] flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Layers className="w-5 h-5 text-blue-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                SkillBridge
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-gray-600 -mt-1">
                College to Industry
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/mentors"
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                isActive('/mentors')
                  ? 'text-blue-600 bg-blue-50/70 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Explore Mentors
            </Link>
            <a
              href="/#how-it-works"
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              How It Works
            </a>
            {!user && (
              <Link
                to="/signup?role=mentor"
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Become a Mentor
              </Link>
            )}
          </nav>

          {/* Right Action / Auth Area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 text-sm font-semibold rounded-lg bg-gray-50 text-gray-800 border border-gray-200/80 hover:bg-gray-100 transition-colors shadow-2xs"
                >
                  <Compass className="w-4 h-4 text-blue-600" />
                  {getDashboardLabel()}
                </Link>

                {/* Notification Center */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-hidden"
                    title="Class & Escrow Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotificationCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse shadow-sm">
                        {unreadNotificationCount}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-gray-100 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900">Notifications</span>
                          {unreadNotificationCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px]">
                              {unreadNotificationCount} new
                            </span>
                          )}
                        </div>
                        {unreadNotificationCount > 0 && (
                          <button
                            onClick={markAllNotificationsAsRead}
                            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                        {notifications
                          .filter((n) => n.role === 'all' || !user || n.role === user.role)
                          .map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                markNotificationAsRead(notif.id);
                                if (notif.actionUrl) {
                                  setNotificationsOpen(false);
                                  navigate(notif.actionUrl);
                                }
                              }}
                              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                                !notif.read ? 'bg-blue-50/40' : ''
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                                  notif.type === 'class_reminder'
                                    ? 'bg-amber-100 text-amber-700'
                                    : notif.type === 'payout_released'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {notif.type === 'class_reminder' ? (
                                  <Clock className="w-4 h-4" />
                                ) : notif.type === 'payout_released' ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <ShieldCheck className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="text-xs font-bold text-gray-900 truncate">
                                    {notif.title}
                                  </h4>
                                  <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                    {notif.createdAt}
                                  </span>
                                </div>
                                <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2 leading-relaxed">
                                  {notif.message}
                                </p>
                                {notif.actionLabel && (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 mt-1.5">
                                    {notif.actionLabel} &rarr;
                                  </span>
                                )}
                              </div>
                              {!notif.read && (
                                <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1"></span>
                              )}
                            </div>
                          ))}
                      </div>

                      <div className="p-2 border-t border-gray-100 bg-gray-50/50 text-center">
                        <span className="text-[10px] text-gray-500 font-medium">
                          Automated Class Attendance & Escrow Ledger
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dropdown Menu */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-hidden"
                  >
                    <img
                      src={
                        user.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          user.name || 'User'
                        )}`
                      }
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                    />
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-gray-100 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">{user.email}</p>
                        <div className="mt-2">{getRoleBadge(user.role)}</div>
                      </div>

                      <div className="py-1">
                        <Link
                          to={getDashboardPath()}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Compass className="w-4 h-4 text-gray-500" />
                          {getDashboardLabel()}
                        </Link>
                        {user.role === 'mentor' && (
                          <Link
                            to="/mentor/packages"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Sparkles className="w-4 h-4 text-gray-500" />
                            Manage Packages
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-all hover:shadow-md hover:shadow-blue-500/30 active:scale-[0.99]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-1">
            <Link
              to="/mentors"
              className="px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Explore Mentors
            </Link>
            <a
              href="/#how-it-works"
              className="px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
            >
              How It Works
            </a>
            {!user && (
              <Link
                to="/signup?role=mentor"
                className="px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Become a Mentor
              </Link>
            )}
          </nav>

          <div className="pt-3 border-t border-gray-100">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-1">
                  <img
                    src={
                      user.avatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        user.name || 'User'
                      )}`
                    }
                    alt={user.name}
                    className="w-9 h-9 rounded-full border border-gray-200"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                </div>
                <Link
                  to={getDashboardPath()}
                  className="block w-full text-center px-4 py-2 text-sm font-semibold rounded-lg bg-blue-50 text-blue-700 border border-blue-200"
                >
                  Go to {getDashboardLabel()}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="text-center px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="text-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
