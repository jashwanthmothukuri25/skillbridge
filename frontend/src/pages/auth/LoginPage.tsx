import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Layers,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

type UserRole = 'student' | 'mentor' | 'admin';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useApp();

  const initialRole = (searchParams.get('role') as UserRole) || 'student';
  const [activeRole, setActiveRole] = useState<UserRole>(initialRole);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const demoAccounts: Record<
    UserRole,
    { name: string; email: string; desc: string; targetRoute: string }
  > = {
    student: {
      name: 'Rohan Verma',
      email: 'rohan.verma@college.edu',
      desc: 'Final Year CSE student preparing for placement interviews',
      targetRoute: '/student'
    },
    mentor: {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@google.com',
      desc: 'Sr. Staff Engineer at Google with 8+ years experience',
      targetRoute: '/mentor'
    },
    admin: {
      name: 'Dr. Sunita Rao',
      email: 'admin@skillbridge.edu',
      desc: 'Placement Dean & Platform Verification Administrator',
      targetRoute: '/admin'
    }
  };

  const handleAutoFill = (role: UserRole) => {
    setActiveRole(role);
    setEmail(demoAccounts[role].email);
    setPassword('demoPass123!');
    setErrorMessage('');
  };

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      await login(activeRole, email.trim(), password);
      navigate(demoAccounts[activeRole].targetRoute);
    } catch {
      setErrorMessage('Unable to log in. Please verify your credentials or use Auto-Fill.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F8FC] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white border border-gray-200 shadow-2xs hover:scale-105 transition-transform"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0B1020] to-[#4F7CFF] flex items-center justify-center text-white">
              <Layers className="w-4 h-4 text-blue-300" />
            </div>
            <span className="font-bold text-gray-900 tracking-tight">SkillBridge</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1020] tracking-tight">
            Sign in to SkillBridge
          </h1>
          <p className="text-sm text-gray-600">
            Select your portal and enter your credentials to continue
          </p>
        </div>

        {/* Role Selector Segmented Control */}
        <div className="p-1 rounded-xl bg-gray-200/90 grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => handleRoleChange('student')}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeRole === 'student'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Student
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('mentor')}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeRole === 'mentor'
                ? 'bg-white text-violet-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Mentor
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeRole === 'admin'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Admin
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 p-6 sm:p-8 space-y-6">
          {/* Quick Demo Credentials Assistant */}
          <div className="rounded-xl p-3.5 bg-blue-50/70 border border-blue-100 flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Demo {activeRole} access
              </div>
              <p className="text-xs text-blue-700/80 leading-relaxed">
                {demoAccounts[activeRole].desc}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleAutoFill(activeRole)}
              className="shrink-0 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-white border border-blue-200 rounded-md hover:bg-blue-50 transition-colors shadow-2xs"
            >
              Auto-Fill
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    activeRole === 'student'
                      ? 'rohan.verma@college.edu'
                      : activeRole === 'mentor'
                      ? 'aarav.sharma@google.com'
                      : 'admin@skillbridge.edu'
                  }
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-gray-50/40 hover:bg-white"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Demo mode: Use the "Auto-Fill" button above to test.')}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-gray-50/40 hover:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-hidden"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-4 focus:ring-blue-500/20 shadow-md shadow-blue-500/25 transition-all disabled:opacity-60 active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in as {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Value Badges */}
          <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-[11px] text-gray-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              100% Verified mentors
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              Live 1:1 sessions
            </span>
          </div>
        </div>

        {/* Link to Register */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account yet?{' '}
          <Link
            to={`/signup?role=${activeRole}`}
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export const Login = LoginPage;
export default LoginPage;

