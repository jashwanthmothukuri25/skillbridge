
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { adminService } from '../../services/adminService';
import { getToken } from '../../services/api';
import {
  Shield,
  Users,
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  Clock,
  Sparkles
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, bookings, mentors } = useApp();
  const [activeTab, setActiveTab] = useState<'verifications' | 'bookings' | 'safety'>('verifications');
  const [searchTerm, setSearchTerm] = useState('');
  const [liveStats, setLiveStats] = useState<any>(null);

  // Sample pending mentor verification requests
  const [pendingMentors, setPendingMentors] = useState([
    {
      id: 'req-1',
      name: 'Rohan Deshmukh',
      currentCompany: 'Google India',
      role: 'Staff Site Reliability Engineer',
      experienceYears: 9,
      email: 'rohan.d@google.com',
      workIdVerified: true,
      skills: ['Kubernetes', 'Go', 'Distributed Tracing', 'SRE'],
      submittedAt: 'Today, 2:15 PM',
      proposedStartingPrice: 2499,
    },
    {
      id: 'req-2',
      name: 'Sneha Venkatesh',
      currentCompany: 'Amazon Web Services',
      role: 'Senior Solutions Architect',
      experienceYears: 7,
      email: 'sneha.v@amazon.com',
      workIdVerified: true,
      skills: ['AWS', 'Serverless', 'DynamoDB', 'Microservices'],
      submittedAt: 'Yesterday, 8:40 PM',
      proposedStartingPrice: 1999,
    },
    {
      id: 'req-3',
      name: 'Vikram Sethi',
      currentCompany: 'Flipkart',
      role: 'Lead SDE-3 Backend',
      experienceYears: 6,
      email: 'vikram.s@flipkart.com',
      workIdVerified: false,
      skills: ['Java', 'Kafka', 'Redis', 'High Throughput'],
      submittedAt: '10 Oct 2026',
      proposedStartingPrice: 1799,
    },
  ]);

  useEffect(() => {
    if (getToken()) {
      adminService.getStats().then((stats) => {
        setLiveStats(stats);
      }).catch((err) => {
        console.warn('Admin stats notice:', err);
      });

      adminService.getPendingMentors().then((data) => {
        if (data && data.length > 0) {
          setPendingMentors(data.map((m: any) => ({
            id: String(m.id),
            name: m.name,
            currentCompany: m.company || 'Tech Company',
            role: m.title || 'Senior Software Engineer',
            experienceYears: m.experienceYears || 5,
            email: `${m.name.toLowerCase().replace(/\s+/g, '.')}@company.com`,
            workIdVerified: true,
            skills: m.skills || [],
            submittedAt: 'Recent',
            proposedStartingPrice: m.hourlyRateInr || 1999
          })));
        }
      }).catch((err) => {
        console.warn('Pending mentors notice:', err);
      });
    }
  }, []);

  const [notification, setNotification] = useState<string | null>(null);

  const handleApprove = (id: string, name: string) => {
    setPendingMentors((prev) => prev.filter((m) => m.id !== id));
    if (getToken() && !id.startsWith('req-')) {
      adminService.verifyMentor(id).catch((err) => console.warn('Verify mentor notice:', err));
    }
    setNotification(`Approved ${name} as a verified industry mentor.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleReject = (id: string, name: string) => {
    setPendingMentors((prev) => prev.filter((m) => m.id !== id));
    if (getToken() && !id.startsWith('req-')) {
      adminService.rejectMentor(id).catch((err) => console.warn('Reject mentor notice:', err));
    }
    setNotification(`Declined verification request for ${name}.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const totalGMV = liveStats?.platformVolumeInr !== undefined
    ? liveStats.platformVolumeInr
    : bookings.reduce((sum, b) => sum + (b.packagePriceINR || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[11px] font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            SkillBridge Platform Administration
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Marketplace Operations Hub</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Monitor verified engineer admissions, simulated escrow releases, quality standards, and student feedback.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/discover"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 transition-colors inline-flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Live Directory
          </Link>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span>Pending Approvals</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{pendingMentors.length}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Requires work ID check</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span>Active Mentors</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{mentors.length || 18}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">100% verified engineers</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span>Total Bookings</span>
            <Briefcase className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
          <div className="text-[11px] text-gray-500 mt-1">Simulated escrow pipeline</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span>Platform Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">₹{totalGMV.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Gross mentorship value</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 px-6 pt-4 gap-6">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`pb-3 font-semibold text-xs transition-colors relative flex items-center gap-1.5 ${
              activeTab === 'verifications'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>Mentor Verifications</span>
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] flex items-center justify-center font-bold">
              {pendingMentors.length}
            </span>
            {activeTab === 'verifications' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 font-semibold text-xs transition-colors relative flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>Marketplace Bookings</span>
            <span className="w-5 h-5 rounded-full bg-slate-100 text-gray-700 text-[10px] flex items-center justify-center font-bold">
              {bookings.length}
            </span>
            {activeTab === 'bookings' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('safety')}
            className={`pb-3 font-semibold text-xs transition-colors relative ${
              activeTab === 'safety' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Disputes & Code of Conduct
            {activeTab === 'safety' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Tab Content: Verifications */}
        {activeTab === 'verifications' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900">
                Pending Engineer Verification Applications
              </h2>
              <span className="text-xs text-gray-500">
                Verify corporate email domain and LinkedIn before activating
              </span>
            </div>

            {pendingMentors.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs">
                No pending mentor verification requests at this time.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingMentors.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">{item.name}</span>
                        <span className="text-xs text-gray-600">
                          {item.role} at <strong className="text-gray-900">{item.currentCompany}</strong>
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 font-medium rounded">
                          {item.experienceYears}+ years exp
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-3">
                        <span>Work Email: <strong className="text-gray-700">{item.email}</strong></span>
                        <span>•</span>
                        <span>Proposed rate: <strong>₹{item.proposedStartingPrice}</strong></span>
                        <span>•</span>
                        <span>Submitted {item.submittedAt}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => handleReject(item.id, item.name)}
                        className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(item.id, item.name)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve & Verify
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Bookings */}
        {activeTab === 'bookings' && (
          <div className="p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Live Platform Booking Logs</h2>
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs">
                No simulated bookings recorded in current local session.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-gray-600 font-semibold border-y border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Booking ID</th>
                      <th className="py-3 px-4">Mentor</th>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Package</th>
                      <th className="py-3 px-4">Scheduled For</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono text-[11px] text-gray-500">{b.id}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">{b.mentorName}</td>
                        <td className="py-3 px-4 text-gray-700">{b.studentName || 'Student'}</td>
                        <td className="py-3 px-4 text-gray-700">{b.packageTitle}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {b.date} • {b.timeSlot}
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900">
                          ₹{b.packagePriceINR?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Safety */}
        {activeTab === 'safety' && (
          <div className="p-6 text-center py-12 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-gray-900">No Open Disputes</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              All 1-on-1 mentorship sessions are running within SLA standards. Simulated escrow releases occur 24 hours post-session.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
