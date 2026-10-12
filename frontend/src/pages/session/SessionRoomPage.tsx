import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MonitorUp,
  MessageSquare,
  FileText,
  Clock,
  ShieldCheck,
  Send,
  Users,
  ChevronRight,
  Sparkles,
  Lock,
  CheckCircle2,
  Star,
  Award,
  ArrowRight,
  Play,
  Building,
  Zap,
  Receipt,
  QrCode
} from 'lucide-react';

export const SessionRoomPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user, bookings, completeSessionAndReleaseEscrow } = useApp();

  // Find target booking
  const currentBooking: Booking = bookings.find(
    (b) => b.id === sessionId || b.id === `bk-${sessionId}` || sessionId?.includes(b.id)
  ) || bookings[0] || {
    id: sessionId || 'bk-1001',
    studentId: 'std-1',
    studentName: user?.name || 'Rohan Verma',
    mentorId: 'm-1',
    mentorName: 'Aarav Sharma',
    packageId: 'pkg-101',
    packageTitle: 'Mock System Design Round + Architecture Critique',
    date: 'Today',
    timeSlot: '7:00 PM - 8:30 PM',
    durationMinutes: 90,
    amountInr: 2499,
    status: 'upcoming',
    paymentStatus: 'escrow_held',
    escrowHoldRef: 'ESC-SB-90281',
    mentorPayoutInr: 2250,
    bankTransferUtr: 'IMPS-HDFC-993821038472'
  };

  const isCompleted = currentBooking.status === 'completed';

  // Video State
  const [isClassroomJoined, setIsClassroomJoined] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState<'notes' | 'chat'>('notes');
  const [notes, setNotes] = useState(
    '### 1-on-1 Mentorship Agenda & Notes\n\n- [x] Background & Placement Target Discussion\n- [ ] System Design Architecture Review (Distributed Caching)\n- [ ] Database Sharding & Read-Replicas Strategies\n- [ ] Q&A and Mock Scorecard Feedback'
  );

  // App Automated Settlement State
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [sessionRating, setSessionRating] = useState(5);
  const [feedbackNote, setFeedbackNote] = useState('Excellent actionable feedback on distributed caching and interview whiteboard skills!');
  const [isEscrowReleased, setIsEscrowReleased] = useState(isCompleted);
  const [isAutoSettling, setIsAutoSettling] = useState(false);
  const [liveUtr, setLiveUtr] = useState(
    currentBooking.bankTransferUtr || `IMPS-HDFC-${Math.floor(100000000000 + Math.random() * 900000000000)}`
  );

  // 60-minute countdown simulation
  const [secondsRemaining, setSecondsRemaining] = useState(currentBooking.durationMinutes ? currentBooking.durationMinutes * 60 : 3600);

  useEffect(() => {
    if (!isClassroomJoined) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isClassroomJoined]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // AUTOMATIC BANK TRANSFER TRIGGERED BY APP ONLY (NO STUDENT PERMISSION)
  const handleConcludeSessionAutomated = () => {
    setIsAutoSettling(true);
    const generatedUtr = `IMPS-HDFC-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    setLiveUtr(generatedUtr);

    setTimeout(() => {
      completeSessionAndReleaseEscrow(currentBooking.id);
      setIsEscrowReleased(true);
      setIsAutoSettling(false);
      setShowReceiptModal(true);
    }, 700);
  };

  const roomName = `SkillBridge-Session-${(currentBooking.id || 'demo').replace(/[^a-zA-Z0-9]/g, '')}`;
  const displayName = encodeURIComponent(user?.name || (user?.role === 'mentor' ? currentBooking.mentorName : currentBooking.studentName) || 'Participant');
  const jitsiUrl = `https://meet.jit.si/${roomName}#userInfo.displayName="${displayName}"&config.prejoinPageEnabled=false&config.toolbarButtons=["camera","microphone","desktop","chat","raisehand","tileview","hangup"]`;

  const mentorPayout = currentBooking.mentorPayoutInr || Math.round((currentBooking.amountInr || 2499) * 0.9);
  const platformFee = Math.round((currentBooking.amountInr || 2499) * 0.1);

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col overflow-hidden font-sans">
      {/* Top Session Header */}
      <header className="h-14 border-b border-white/10 px-4 md:px-6 flex items-center justify-between bg-slate-900/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            to={user?.role === 'mentor' ? '/mentor' : '/student'}
            className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs hover:bg-blue-500 transition-colors"
          >
            SB
          </Link>
          <div>
            <div className="font-semibold text-xs text-white flex items-center gap-2">
              <span>SkillBridge Encrypted Video Classroom</span>
              <span className={`w-2 h-2 rounded-full ${isClassroomJoined ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            </div>
            <div className="text-[10px] text-slate-400">
              {currentBooking.packageTitle} • Session #{currentBooking.id}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Scheduled Day / Time Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-mono font-medium text-slate-200">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>{isClassroomJoined ? `${formatTime(secondsRemaining)} remaining` : `Scheduled: ${currentBooking.date}, ${currentBooking.timeSlot}`}</span>
          </div>

          {/* Bank Escrow Status Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {isEscrowReleased ? '✓ Auto-Credited to Mentor Bank (IMPS)' : `Held in Bank Escrow: ₹${(currentBooking.amountInr || 2499).toLocaleString('en-IN')}`}
            </span>
          </div>

          {/* Conclude Session Button (Triggers App-Only Automated Transfer) */}
          {isClassroomJoined && (
            <button
              onClick={handleConcludeSessionAutomated}
              disabled={isAutoSettling}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              {isAutoSettling ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>App Auto-Settling Payout...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                  <span>Conclude Class & Auto-Settle</span>
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Classroom Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Video Viewport */}
        <div className="flex-1 p-4 flex flex-col justify-between relative bg-slate-950">
          {!isClassroomJoined ? (
            /* Lobby & Scheduled Day Gate */
            <div className="flex-1 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 flex flex-col items-center justify-center p-6 text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-blue-600/20 border-2 border-blue-500/30 flex items-center justify-center text-blue-400 shadow-xl">
                <Video className="w-10 h-10" />
              </div>

              <div className="max-w-md space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> Scheduled WebRTC Classroom
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Ready to start your 1-on-1 session?
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Join with mentor <span className="text-white font-semibold">{currentBooking.mentorName}</span>. Your camera, audio, screen share, and collaborative notes will activate in-browser.
                </p>
              </div>

              {/* 3-Step Escrow Guarantee Summary */}
              <div className="w-full max-w-md p-4 rounded-xl bg-slate-800/80 border border-white/10 text-left text-xs space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Class Date & Time:</span>
                  <span className="font-bold text-amber-300">{currentBooking.date}, {currentBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Prepaid Escrow Deposit:</span>
                  <span className="font-bold text-emerald-400">₹{(currentBooking.amountInr || 2499).toLocaleString('en-IN')} (Locked in ICICI Escrow)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Destination Account:</span>
                  <span className="text-white font-medium">HDFC Bank A/C •••• 4892 (Aarav Sharma)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-950/60 border border-blue-500/30 text-[11px] text-blue-200 flex items-start gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>App-Only Automated Settlement:</strong> Money is added to the mentor's bank account automatically by the app engine after the session completes. <em>No student permission or manual approval required.</em>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <button
                  onClick={() => setIsClassroomJoined(true)}
                  className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Enter Live Video Classroom</span>
                </button>
                <Link
                  to={user?.role === 'mentor' ? '/mentor' : '/student'}
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors flex items-center justify-center"
                >
                  Back to Hub
                </Link>
              </div>
            </div>
          ) : (
            /* Live Embedded WebRTC Meeting Frame */
            <div className="flex-1 rounded-2xl bg-black border border-white/10 relative overflow-hidden shadow-2xl flex flex-col">
              <iframe
                title="SkillBridge Encrypted Video Session"
                src={jitsiUrl}
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                className="w-full h-full border-0 rounded-2xl"
              />
            </div>
          )}

          {/* Bottom Toolbar when in call */}
          {isClassroomJoined && (
            <div className="pt-3 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>WebRTC End-to-End Encrypted Tunnel</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleConcludeSessionAutomated}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Conclude Class & Trigger App Auto-Payout &rarr;</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Panel: Interactive Notes & Agenda */}
        <aside className="w-80 border-l border-white/10 bg-slate-900 flex flex-col justify-between hidden lg:flex">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Session Agenda & Notes</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300">
              Auto-saved
            </span>
          </div>

          <div className="flex-1 p-4 flex flex-col overflow-hidden">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Take live session notes, code links, and action items..."
              className="w-full flex-1 bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-hidden focus:border-blue-500/50 resize-none leading-relaxed"
            />
          </div>

          <div className="p-4 border-t border-white/10 bg-slate-950/40 space-y-3">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>App Automated Settlement:</span>
              <span className="text-emerald-400 font-semibold">Ready (No student gate)</span>
            </div>
            <button
              onClick={handleConcludeSessionAutomated}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Conclude Class & Auto-Disburse</span>
            </button>
          </div>
        </aside>
      </div>

      {/* APP AUTOMATED BANK SETTLEMENT RECEIPT MODAL (NO STUDENT PERMISSION) */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-white/15 rounded-3xl p-6 text-white space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Header Badge */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-md">
                <Building className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
                App Automated Transfer Executed
              </div>
              <h3 className="text-lg font-black text-white">Funds Deposited to Mentor Bank Account</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                SkillBridge platform engine has <strong>automatically executed</strong> an instant IMPS transfer to mentor <span className="text-white font-semibold">{currentBooking.mentorName}</span>'s bank account upon session conclusion.
              </p>
            </div>

            {/* Official IMPS Transfer Receipt Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 text-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400 font-medium">Transfer Status:</span>
                <span className="font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  SUCCESS • AUTO-CREDITED
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400 font-medium">Bank IMPS Reference UTR:</span>
                <span className="font-mono font-bold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                  {liveUtr}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400">Origin Bank (Escrow):</span>
                <span className="text-blue-300 font-medium">ICICI Bank Nodal Escrow A/C #001205009182</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400">Beneficiary Bank:</span>
                <span className="text-white font-semibold">HDFC Bank A/C •••• 4892 (IFSC: HDFC0001234)</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400">Beneficiary Name:</span>
                <span className="text-white font-semibold">{currentBooking.mentorName}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400">Prepaid by Student (UPI):</span>
                <span className="text-white font-semibold">₹{(currentBooking.amountInr || 2499).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400">Platform Commission (10%):</span>
                <span className="text-slate-300 font-medium">₹{platformFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between pt-1 font-bold">
                <span className="text-emerald-400">Direct Deposit to Mentor Account:</span>
                <span className="text-emerald-400 text-sm font-black">₹{mentorPayout.toLocaleString('en-IN')} (IMPS)</span>
              </div>
            </div>

            {/* Platform Rule Clarification */}
            <div className="p-3 rounded-xl bg-blue-950/50 border border-blue-500/30 text-[11px] text-blue-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Zero Student Permission Required:</strong> The payout was initiated automatically by SkillBridge platform engine upon session completion. The student does not have to approve or confirm payout.
              </div>
            </div>

            {/* Optional Mentor Review Section (Purely for Public Scorecard) */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-300">
                  Rate your session experience with {currentBooking.mentorName} (Optional)
                </label>
                <span className="text-[10px] text-slate-500">Public scorecard</span>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSessionRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= sessionRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                rows={2}
                placeholder="Leave notes or review for mentor's public profile..."
                className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-slate-200 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2.5 pt-1">
              <Link
                to={user?.role === 'mentor' ? '/mentor' : '/student'}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Return to {user?.role === 'mentor' ? 'Mentor Studio' : 'Student Hub'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs transition-colors"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Release Bottom Banner */}
      {isEscrowReleased && !showReceiptModal && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-2xl text-white space-y-2 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Added to Mentor Bank Automatically!</span>
          </div>
          <p className="text-[11px] text-slate-300">
            ₹{mentorPayout.toLocaleString('en-IN')} has been transferred via IMPS into mentor's HDFC Bank A/C (••••4892) by the app. UTR: {liveUtr}.
          </p>
          <div className="pt-1 flex gap-3">
            <button
              onClick={() => setShowReceiptModal(true)}
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline"
            >
              View Full Bank Receipt
            </button>
            <Link
              to={user?.role === 'mentor' ? '/mentor' : '/student'}
              className="text-[11px] font-bold text-blue-400 hover:text-blue-300"
            >
              Back to Hub &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionRoomPage;
