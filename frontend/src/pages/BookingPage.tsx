
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Video
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BookingPage: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const { mentors, addBooking, user } = useApp();

  // Find target package
  let matchedMentor = mentors[0];
  let matchedPkg = mentors[0].packages[0];

  for (const m of mentors) {
    const found = m.packages.find((p) => p.id === packageId);
    if (found) {
      matchedMentor = m;
      matchedPkg = found;
      break;
    }
  }

  const [selectedDate, setSelectedDate] = useState('Tomorrow, 7:00 PM');
  const [sessionNotes, setSessionNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const availableSlots = [
    'Tomorrow, 7:00 PM - 8:30 PM',
    'Thursday, 8:00 PM - 9:30 PM',
    'Saturday, 11:00 AM - 12:30 PM',
    'Sunday, 5:00 PM - 6:30 PM'
  ];

  const handleConfirmBooking = () => {
    addBooking({
      studentId: user?.id || 'std-guest',
      studentName: user?.name || 'Student Candidate',
      mentorId: matchedMentor.id,
      mentorName: matchedMentor.name,
      mentorAvatar: matchedMentor.avatar,
      packageId: matchedPkg.id,
      packageTitle: matchedPkg.title,
      date: selectedDate.split(',')[0],
      timeSlot: selectedDate,
      durationMinutes: matchedPkg.durationMinutes,
      amountInr: matchedPkg.priceInr,
      status: 'upcoming'
    });

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F8FC] px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-gray-900">Session Confirmed!</h2>
            <p className="text-xs text-gray-600">
              Your mentorship slot with {matchedMentor.name} is reserved.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Package:</span>
              <span className="font-bold text-gray-900">{matchedPkg.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Scheduled:</span>
              <span className="font-bold text-gray-900">{selectedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount Paid (Simulated):</span>
              <span className="font-bold text-blue-600">₹{matchedPkg.priceInr.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/student"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors"
            >
              Go to Student Hub
            </Link>
            <Link
              to="/mentors"
              className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-colors"
            >
              Explore More
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Mentor Profile
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Slot & Details */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Step 1 of 2
              </span>
              <h1 className="text-2xl font-extrabold text-[#0B1020]">Select Calendar Slot</h1>
              <p className="text-xs text-gray-500">
                Choose an available evening time slot synchronized with {matchedMentor.name}'s schedule.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                Available Timings
              </label>
              <div className="space-y-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedDate(slot)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between text-xs font-semibold transition-all ${
                      selectedDate === slot
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CalendarIcon className="w-4 h-4 text-blue-600" />
                      <span>{slot}</span>
                    </div>
                    {selectedDate === slot && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                What would you like to focus on? (Optional)
              </label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="e.g. Please review my distributed cache design and resume points for off-campus placement drives..."
                rows={3}
                className="w-full p-3 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Right Column: Summary Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200/80 p-6 space-y-6 shadow-xs">
            <h2 className="text-base font-bold text-gray-900">Booking Summary</h2>

            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <img
                src={matchedMentor.avatar}
                alt={matchedMentor.name}
                className="w-12 h-12 rounded-xl object-cover border border-gray-200"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{matchedMentor.name}</p>
                <p className="text-xs text-gray-500 truncate">{matchedMentor.title}</p>
                <span className="text-[11px] font-semibold text-blue-600">{matchedMentor.company}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Package:</span>
                <span className="font-bold text-gray-900 text-right">{matchedPkg.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration:</span>
                <span className="font-medium text-gray-700">{matchedPkg.durationMinutes} Minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Session Mode:</span>
                <span className="font-medium text-gray-700 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-blue-600" /> 1:1 Video
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Total Price:</span>
              <span className="text-xl font-black text-gray-900">
                ₹{matchedPkg.priceInr.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={handleConfirmBooking}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              Confirm & Book Session <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Simulated booking sandbox • No real payment charged</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
