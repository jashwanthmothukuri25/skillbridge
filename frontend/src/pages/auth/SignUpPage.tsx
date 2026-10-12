import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Layers,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  Building,
  BookOpen,
  Calendar,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUpStudent, signUpMentor } = useApp();

  const roleParam = searchParams.get('role');
  const [role, setRole] = useState<'student' | 'mentor'>(
    roleParam === 'mentor' ? 'mentor' : 'student'
  );

  // Common form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Student specific fields
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('Final Year (2026)');

  // Mentor specific fields
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [skills, setSkills] = useState('Java, Spring Boot, System Design');
  const [hourlyRate, setHourlyRate] = useState(1999);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      if (role === 'student') {
        await signUpStudent({
          name: fullName.trim(),
          email: email.trim(),
          password,
          college: college.trim() || 'Engineering College',
          department,
          year
        });
        navigate('/student');
      } else {
        await signUpMentor({
          name: fullName.trim(),
          email: email.trim(),
          password,
          title: jobTitle.trim() || 'Software Engineer',
          company: company.trim() || 'Tech Company',
          experienceYears: Number(experienceYears),
          skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
          hourlyRateInr: Number(hourlyRate)
        });
        navigate('/mentor');
      }
    } catch {
      setErrorMessage('Failed to create account. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F8FC] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6">
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
            Create your account
          </h1>
          <p className="text-sm text-gray-600">
            Join students and mentors accelerating tech careers
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="p-1 rounded-xl bg-gray-200/90 grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              role === 'student'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            I am a Student
          </button>
          <button
            type="button"
            onClick={() => setRole('mentor')}
            className={`flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              role === 'mentor'
                ? 'bg-white text-violet-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            I am a Mentor
          </button>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-gray-50/40 hover:bg-white transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'student' ? 'you@college.edu' : 'you@company.com'}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-gray-50/40 hover:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                Create Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-gray-50/40 hover:bg-white transition-all"
                />
              </div>
            </div>

            {/* Student Specific Fields */}
            {role === 'student' ? (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                    College / University
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Building className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. National Institute of Technology"
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-gray-50/40 hover:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Department
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. CSE / IT"
                        className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-gray-50/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Batch / Year
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="e.g. 2026 Batch"
                        className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-gray-50/40"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Mentor Specific Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Current Company
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Google, Microsoft"
                      required
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 bg-gray-50/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Staff Engineer"
                      required
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 bg-gray-50/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 bg-gray-50/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Hourly Rate (₹ INR)
                    </label>
                    <input
                      type="number"
                      step={100}
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 bg-gray-50/40"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Key Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Java, Spring Boot, System Design, React"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 bg-gray-50/40"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-4 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 active:scale-[0.99] shadow-md ${
                role === 'student'
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'
                  : 'bg-violet-600 hover:bg-violet-700 shadow-violet-500/25'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Register as {role === 'student' ? 'Student' : 'Mentor'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Instant access to mentor calendars, bookings, and mock sessions</span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to={`/login?role=${role}`}
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

// Aliases and default export for compatibility
export const SignUp = SignUpPage;
export default SignUpPage;
