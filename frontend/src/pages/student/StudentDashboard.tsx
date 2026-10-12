import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  Video,
  User,
  Star,
  ArrowRight,
  BookOpen,
  Compass,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user, bookings } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all');

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') return b.status === 'upcoming';
    if (activeTab === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Student Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 rounded-2xl shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-400/20 text-blue-200 border border-blue-400/30 text-[11px] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Tier-1 Placement Acceleration Track
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.name || 'Student'}
          </h1>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            Track your 1-on-1 industry mentorship sessions, review actionable feedback scorecards, and prepare for off-campus engineering rounds.
          </p>
        </div>

        <Link
          to="/discover"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-all inline-flex items-center gap-2 self-start md:self-auto"
        >
          <Compass className="w-4 h-4" />
          Browse Mentors
        </Link>
      </div>

      {/* Highlights / Progress Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="text-xs text-gray-500 font-semibold mb-1">Upcoming Sessions</div>
          <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">
            Confirmed with industry engineers
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="text-xs text-gray-500 font-semibold mb-1">Target Role Target</div>
          <div className="text-base font-bold text-gray-900 mt-1">Backend SDE-1 / Cloud</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Google, Microsoft, Amazon standards
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="text-xs text-gray-500 font-semibold mb-1">Placement Readiness</div>
          <div className="text-2xl font-bold text-gray-900">72%</div>
          <div className="text-[11px] text-gray-500 mt-1">
            DSA (80%) • System Design (65%)
          </div>
        </div>
      </div>

      {/* Booked Sessions List */}
      <div id="sessions" className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Your Mentorship Sessions</h2>
            <p className="text-xs text-gray-500">
              Access your synchronized video links and review past scorecards
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-gray-600">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeTab === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'hover:text-gray-900'
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeTab === 'upcoming' ? 'bg-white text-gray-900 shadow-xs' : 'hover:text-gray-900'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeTab === 'completed' ? 'bg-white text-gray-900 shadow-xs' : 'hover:text-gray-900'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="p-6">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">No sessions scheduled yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Find a mentor from Google, Microsoft, or Amazon to schedule your first 1-on-1 mock interview.
              </p>
              <Link
                to="/discover"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                Explore Industry Mentors
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {b.mentorName ? b.mentorName.charAt(0) : 'M'}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">{b.mentorName}</span>
                        <span className="text-xs text-gray-500">• {b.mentorCompany}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {b.status}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-gray-700">{b.packageTitle}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {b.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {b.timeSlot}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-gray-900">
                          ₹{b.packagePriceINR?.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <Link
                      to={`/session/${b.id}`}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Enter Room
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
