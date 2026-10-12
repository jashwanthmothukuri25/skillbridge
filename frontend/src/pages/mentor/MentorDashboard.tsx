
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mentorService } from '../../services/mentorService';
import { getToken } from '../../services/api';
import {
  Calendar,
  Clock,
  DollarSign,
  Star,
  Plus,
  Video,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Sparkles,
  Users,
  Settings,
  X,
  ShieldCheck,
  Building
} from 'lucide-react';

export const MentorDashboard: React.FC = () => {
  const { user, bookings } = useApp();

  // Mentor's current active packages
  const [packages, setPackages] = useState([
    {
      id: 'pkg-1',
      title: 'Full-Stack System Design & Bottleneck Audit',
      durationMinutes: 90,
      priceINR: 2499,
      topics: ['Distributed Caching', 'Kafka Queues', 'Database Sharding', 'CAP Theorem'],
      sessionsCount: 32,
    },
    {
      id: 'pkg-2',
      title: 'Enterprise Java / Spring Boot Architecture Code Review',
      durationMinutes: 60,
      priceINR: 1999,
      topics: ['Spring Security', 'JPA N+1 Fixes', 'Concurrency', 'Microservices'],
      sessionsCount: 24,
    },
    {
      id: 'pkg-3',
      title: 'FAANG-Grade Technical Mock Interview',
      durationMinutes: 60,
      priceINR: 1799,
      topics: ['Live Problem Decomposition', 'Time & Space Analysis', 'Feedback Scorecard'],
      sessionsCount: 51,
    },
  ]);

  useEffect(() => {
    if (user?.id && getToken()) {
      mentorService.getMentorPackages(user.id).then((pkgs) => {
        if (pkgs && pkgs.length > 0) {
          setPackages(pkgs.map((p) => ({
            id: String(p.id),
            title: p.title,
            durationMinutes: p.durationMinutes,
            priceINR: p.priceINR || p.priceInr || 1999,
            topics: p.topics || [],
            sessionsCount: p.sessionsCount || 0
          })));
        }
      }).catch((err) => {
        console.warn('Fetch mentor packages fallback:', err);
      });
    }
  }, [user]);

  const [showNewPackageModal, setShowNewPackageModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState(60);
  const [newPrice, setNewPrice] = useState(1999);
  const [newTopics, setNewTopics] = useState('');

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const newPkg = {
      id: `pkg-${Date.now()}`,
      title: newTitle,
      durationMinutes: Number(newDuration),
      priceINR: Number(newPrice),
      topics: newTopics.split(',').map((t) => t.trim()).filter(Boolean),
      sessionsCount: 0,
    };
    setPackages([...packages, newPkg]);

    if (getToken()) {
      mentorService.createPackage({
        title: newTitle,
        durationMinutes: Number(newDuration),
        priceInr: Number(newPrice),
        topics: newTopics.split(',').map((t) => t.trim()).filter(Boolean)
      }).catch((err) => {
        console.warn('Create package backend notice:', err);
      });
    }

    setShowNewPackageModal(false);
    setNewTitle('');
    setNewTopics('');
  };

  const upcomingToday = bookings.find(
    (b) => b.status === 'upcoming' && (b.date === 'Today' || b.timeSlot.includes('PM') || b.timeSlot.includes('AM'))
  );

  const totalEscrowHeld = bookings
    .filter((b) => b.status === 'upcoming')
    .reduce((sum, b) => sum + (b.mentorPayoutInr || 2250), 0);

  return (
    <div className="space-y-6">
      {/* Upcoming Class Notification Banner */}
      {upcomingToday && (
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 p-0.5 rounded-2xl shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-slate-950 text-white p-5 rounded-[15px] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Video className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                    Class Attendance Required Today
                  </span>
                  <span className="text-xs text-emerald-300 font-mono font-bold">
                    {upcomingToday.timeSlot}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white">
                  {upcomingToday.packageTitle} with Student: <span className="text-emerald-300">{upcomingToday.studentName}</span>
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Escrow Payout Held: ₹{(upcomingToday.mentorPayoutInr || 2250).toLocaleString('en-IN')}
                  </span>
                  <span>•</span>
                  <span className="text-slate-400">Funds release directly to your bank account after session sign-off</span>
                </div>
              </div>
            </div>

            <Link
              to={`/session/${upcomingToday.id}`}
              className="px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 self-start md:self-auto shrink-0"
            >
              <Video className="w-4 h-4 fill-current" />
              <span>Start Video Classroom</span>
            </Link>
          </div>
        </div>
      )}

      {/* Mentor Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 rounded-2xl shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Mentor Studio
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome, {user?.name || 'Engineer'}</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Manage your student slots, configure structured mentorship packages, and enter your live 1-on-1 video rooms.
          </p>
        </div>

        <button
          onClick={() => setShowNewPackageModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all inline-flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Package
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span>Escrow Held Payouts</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">₹{totalEscrowHeld.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Releases upon completion</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span>Completed Sessions</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">107</div>
          <div className="text-[11px] text-gray-500 mt-1">Across 3 packages</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span>Average Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">4.96</div>
          <div className="text-[11px] text-gray-500 mt-1">From 84 student reviews</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span>Upcoming Sessions</span>
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{bookings.length || 2}</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">Next: Today, 7:00 PM</div>
        </div>
      </div>

      {/* Mentor Verified Bank Account Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-gray-900">Verified Payout Bank Account</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                ✓ Active for Auto-Deposit
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              HDFC Bank • A/C No: <strong className="text-gray-800">•••• •••• 4892</strong> • IFSC: <strong className="text-gray-800">HDFC0001234</strong> • Beneficiary: <strong className="text-gray-800">{user?.name || 'Aarav Sharma'}</strong>
            </p>
            <p className="text-[11px] text-emerald-700 mt-1 font-medium">
              💡 Student payments prepaid and held in Bank Escrow are automatically added directly to this account right after session completion.
            </p>
          </div>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-right self-start md:self-auto shrink-0">
          <span className="text-[10px] text-gray-500 block uppercase font-bold">UPI Auto-Sweep ID</span>
          <span className="text-xs font-mono font-bold text-blue-700">aarav.sharma@okhdfcbank</span>
        </div>
      </div>

      {/* Upcoming Sessions Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Upcoming Mentorship Sessions</h2>
            <p className="text-xs text-gray-500">
              Students have booked the following slots through your calendar
            </p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-xs text-gray-900">
                  Mock Interview: System Design & Java Concurrency
                </div>
                <div className="text-[11px] text-gray-500">
                  Student: Shiva K. • Scheduled: Today at 7:30 PM (60 mins)
                </div>
              </div>
            </div>
            <Link
              to="/session/demo"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm inline-flex items-center gap-1.5 transition-colors"
            >
              <Video className="w-3.5 h-3.5" />
              Enter Online Video Room
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs text-gray-900">{b.packageTitle}</span>
                    <span className="text-[11px] text-gray-500">• Student: <strong className="text-gray-800">{b.studentName || 'Enrolled Student'}</strong></span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      b.paymentStatus === 'escrow_released'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {b.paymentStatus === 'escrow_released' ? '✓ Payout Disbursed' : '🔒 Payout in Escrow'}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 flex flex-wrap items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {b.date} at {b.timeSlot} ({b.durationMinutes || 60} mins)
                    </span>
                    <span>•</span>
                    <span className="font-bold text-emerald-600">
                      Payout: ₹{(b.mentorPayoutInr || 2250).toLocaleString('en-IN')}
                    </span>
                    {b.escrowHoldRef && (
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {b.escrowHoldRef}
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  to={`/session/${b.id}`}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors self-start md:self-auto shrink-0"
                >
                  <Video className="w-3.5 h-3.5" />
                  Enter Video Classroom
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Package Management Section */}
      <div id="packages" className="bg-white p-6 rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Your Mentorship Packages</h2>
            <p className="text-xs text-gray-500">
              Students purchase these structured outcomes directly from your profile
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-5 rounded-xl border border-gray-200 hover:border-blue-300 transition-all bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-xs text-gray-900 leading-snug">{pkg.title}</h3>
                </div>
                <div className="flex items-baseline gap-1 text-base font-extrabold text-gray-900 my-2">
                  ₹{pkg.priceINR.toLocaleString('en-IN')}
                  <span className="text-[11px] font-normal text-gray-500">/ {pkg.durationMinutes} mins</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {pkg.topics.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>{pkg.sessionsCount} sessions completed</span>
                <span className="text-emerald-600 font-semibold">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Package Modal */}
      {showNewPackageModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Create New Package</h3>
              <button
                onClick={() => setShowNewPackageModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Package Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems Architecture Mock"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Topics (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Kafka, Redis, Distributed Locking"
                  value={newTopics}
                  onChange={(e) => setNewTopics(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPackageModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
                >
                  Publish Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;
