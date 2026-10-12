import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Video,
  Lock,
  CreditCard,
  Smartphone,
  Building,
  Info,
  Sparkles
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

  const [selectedDate, setSelectedDate] = useState('Today, 7:00 PM - 8:30 PM');
  const [sessionNotes, setSessionNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('student@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    bookingId: string;
    escrowRef: string;
    totalAmount: number;
    platformFee: number;
    mentorPayout: number;
  } | null>(null);

  const availableSlots = [
    'Today, 7:00 PM - 8:30 PM',
    'Tomorrow, 6:00 PM - 7:30 PM',
    'Thursday, 8:00 PM - 9:30 PM',
    'Saturday, 11:00 AM - 12:30 PM',
    'Sunday, 5:00 PM - 6:30 PM'
  ];

  const pkgPrice = matchedPkg.priceInr || 2499;
  const platformFee = Math.round(pkgPrice * 0.1); // 10% Platform fee
  const totalAmount = pkgPrice + platformFee;
  const mentorPayout = pkgPrice; // Mentor receives their package price

  const handleConfirmPrepaidBooking = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const escrowRef = `ESC-SB-${Math.floor(10000 + Math.random() * 90000)}`;
      const bookedId = addBooking({
        studentId: user?.id || 'std-guest',
        studentName: user?.name || 'Student Candidate',
        mentorId: matchedMentor.id,
        mentorName: matchedMentor.name,
        mentorAvatar: matchedMentor.avatar,
        packageId: matchedPkg.id,
        packageTitle: matchedPkg.title,
        date: selectedDate.startsWith('Today') ? 'Today' : selectedDate.split(',')[0],
        timeSlot: selectedDate,
        durationMinutes: matchedPkg.durationMinutes,
        amountInr: totalAmount,
        status: 'upcoming',
        paymentStatus: 'escrow_held',
        escrowHoldRef: escrowRef,
        platformFeeInr: platformFee,
        mentorPayoutInr: mentorPayout,
        paymentMethod: paymentMethod === 'upi' ? `UPI (${upiId})` : paymentMethod === 'card' ? 'Debit/Credit Card' : 'NetBanking'
      });

      setBookingResult({
        bookingId: bookedId,
        escrowRef,
        totalAmount,
        platformFee,
        mentorPayout
      });

      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

  if (isSuccess && bookingResult) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F8FC] px-4 py-12">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" /> Funds Held in Platform Escrow
            </div>
            <h2 className="text-2xl font-black text-gray-900 mt-2">Prepaid Booking Confirmed!</h2>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              Your mentorship slot with <span className="font-semibold text-gray-800">{matchedMentor.name}</span> is reserved.
            </p>
          </div>

          {/* Escrow Proof Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-gray-500 font-medium">Booking ID:</span>
              <span className="font-mono font-bold text-gray-900">{bookingResult.bookingId}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-gray-500 font-medium">Money Held In:</span>
              <span className="font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                ICICI Bank Nodal Escrow A/C #001205009182
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-gray-500 font-medium">Scheduled Class:</span>
              <span className="font-bold text-gray-900">{selectedDate}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-gray-500 font-medium">Prepaid Amount:</span>
              <span className="font-bold text-emerald-700">₹{bookingResult.totalAmount.toLocaleString('en-IN')} (Locked in Bank)</span>
            </div>
            <div className="flex justify-between items-center text-[11px] pt-1">
              <span className="text-gray-500">Destination Account:</span>
              <span className="font-bold text-gray-800 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-blue-600" /> Mentor's HDFC Bank A/C (••••4892) — Added after session
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-left flex gap-2.5 items-start text-xs text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Student Protection Guarantee:</span> The payment will only be disbursed to {matchedMentor.name} after you attend the live video session. If the mentor fails to attend, 100% is refunded.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to={`/session/${bookingResult.bookingId}`}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Video className="w-4 h-4" /> Enter Video Classroom
            </Link>
            <Link
              to="/student"
              className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-colors flex items-center justify-center"
            >
              Go to Student Hub
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
          {/* Left Column: Slot & Payment Options */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Secure Prepaid Escrow Booking
              </span>
              <h1 className="text-2xl font-extrabold text-[#0B1020]">Select Slot & Payment Method</h1>
              <p className="text-xs text-gray-500">
                Choose your session time and prepaid payment option. Payment is held safely by SkillBridge until the class ends.
              </p>
            </div>

            {/* 1. Slot Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                1. Select Available Time Slot
              </label>
              <div className="space-y-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedDate(slot)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between text-xs font-semibold transition-all ${
                      selectedDate === slot
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs ring-1 ring-blue-600'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CalendarIcon className="w-4 h-4 text-blue-600" />
                      <span>{slot}</span>
                      {slot.startsWith('Today') && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Today!
                        </span>
                      )}
                    </div>
                    {selectedDate === slot && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Prepaid Payment Method Selection */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                2. Select Prepaid Payment Method
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'upi'
                      ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold ring-1 ring-blue-600'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 font-medium'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span className="text-xs">UPI (Instant)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold ring-1 ring-blue-600'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 font-medium'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span className="text-xs">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'netbanking'
                      ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold ring-1 ring-blue-600'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 font-medium'
                  }`}
                >
                  <Building className="w-4 h-4 text-blue-600" />
                  <span className="text-xs">NetBanking</span>
                </button>
              </div>

              {/* Dynamic Payment Details */}
              {paymentMethod === 'upi' && (
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                  <label className="text-[11px] font-semibold text-gray-700">Enter UPI Virtual Payment Address (VPA)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-gray-300 focus:outline-hidden focus:border-blue-600 bg-white font-mono"
                    />
                    <span className="px-3 py-2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg flex items-center">
                      Verified
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Supports Google Pay, PhonePe, Paytm, CRED, BHIM. Payment will be authorized and deposited into SkillBridge Escrow.
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[11px] text-gray-600">
                    <span>Card Number</span>
                    <span className="text-emerald-700 font-bold">256-Bit Encrypted</span>
                  </div>
                  <input
                    type="text"
                    disabled
                    value="•••• •••• •••• 4242 (Test Sandbox Card)"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 font-mono text-xs text-gray-600"
                  />
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input type="text" disabled value="Valid Thru: 12/28" className="px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 font-mono text-xs text-gray-600" />
                    <input type="text" disabled value="CVV: •••" className="px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 font-mono text-xs text-gray-600" />
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                  <label className="text-[11px] font-semibold text-gray-700">Select Bank</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs">
                    <option>HDFC Bank (Instant Transfer)</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India (SBI)</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}
            </div>

            {/* 3. Session Notes */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                3. Session Goal / Agenda (Optional)
              </label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="e.g. Please review my distributed system project, database caching bottleneck, and mock interview questions..."
                rows={2}
                className="w-full p-3 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Right Column: Escrow Order Summary Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200/80 p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Payment Breakdown</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase">
                Escrow Protected
              </span>
            </div>

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

            {/* Escrow Rule Details */}
            <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-blue-300">
                <Building className="w-4 h-4 text-emerald-400" />
                <span>3-Step Bank Escrow Settlement</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                <li className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                  <span><strong>1. Prepaid by Student:</strong> Authorized upfront via UPI/Card to reserve your slot.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                  <span><strong>2. Money Held in a Bank:</strong> Funds locked in Bank Escrow Account (ICICI Nodal). The mentor cannot access or touch the money.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                  <span><strong>3. After Session Added to Mentor Account:</strong> After the live class ends, the bank directly transfers ₹{pkgPrice.toLocaleString('en-IN')} into mentor's HDFC Bank A/C!</span>
                </li>
              </ul>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Mentorship Package:</span>
                <span className="font-bold text-gray-900 text-right">{matchedPkg.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration:</span>
                <span className="font-medium text-gray-700">{matchedPkg.durationMinutes} Minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Mentor Fee:</span>
                <span className="font-medium text-gray-800">₹{pkgPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-1">
                  Escrow & Platform Fee (10%):
                </span>
                <span className="font-medium text-gray-800">₹{platformFee.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-500">Total Prepaid:</span>
                <div className="text-[10px] text-emerald-600 font-semibold">Held in Escrow</div>
              </div>
              <span className="text-2xl font-black text-gray-900">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={handleConfirmPrepaidBooking}
              disabled={isProcessing}
              className={`w-full py-3.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                isProcessing
                  ? 'bg-blue-400 text-white cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authorizing Prepaid Escrow...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{totalAmount.toLocaleString('en-IN')} & Secure Slot in Escrow</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Full refund guarantee if mentor cancels or fails to attend</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
