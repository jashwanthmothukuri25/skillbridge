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
  Building
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
    bankTransferUtr: 'UTR-SB-90281'
  };

  const isCompleted = currentBooking.status === 'completed';

  // Video State
  const [isClassroomJoined, setIsClassroomJoined] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState<'notes' | 'chat'>('notes');
  const [notes, setNotes] = useState(
    '### 1-on-1 Mentorship Agenda & Notes\n\n- [x] Background & Placement Target Discussion\n- [ ] System Design Architecture Review (Distributed Caching)\n- [ ] Database Sharding & Read-Replicas Strategies\n- [ ] Q&A and Mock Scorecard Feedback'
  );

  // Completion & Escrow Modal
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [sessionRating, setSessionRating] = useState(5);
  const [feedbackNote, setFeedbackNote] = useState('Excellent actionable feedback on distributed caching and interview whiteboard skills!');
  const [isEscrowReleased, setIsEscrowReleased] = useState(isCompleted);

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

  const handleConfirmCompletion = () => {
    completeSessionAndReleaseEscrow(currentBooking.id);
    setIsEscrowReleased(true);
    setShowCompletionModal(false);
  };

  const roomName = `SkillBridge-Session-${(currentBooking.id || 'demo').replace(/[^a-zA-Z0-9]/g, '')}`;
  const displayName = encodeURIComponent(user?.name || (user?.role === 'mentor' ? currentBooking.mentorName : currentBooking.studentName) || 'Participant');
  const jitsiUrl = `https://meet.jit.si/${roomName}#userInfo.displayName="${displayName}"&config.prejoinPageEnabled=false&config.toolbarButtons=["camera","microphone","desktop","chat","raisehand","tileview","hangup"]`;

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
              {isEscrowReleased ? 'Added to Mentor Bank Account' : `Held in Bank Escrow: ₹${(currentBooking.amountInr || 2499).toLocaleString('en-IN')}`}
            </span>
          </div>

          {/* Complete / Leave Button */}
          {isClassroomJoined && (
            <button
              onClick={() => setShowCompletionModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Complete & Add to Mentor Account</span>
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

              {/* Escrow Status Summary Banner */}
              <div className="w-full max-w-md p-4 rounded-xl bg-slate-800/80 border border-white/10 text-left text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Class Date & Time:</span>
                  <span className="font-bold text-amber-300">{currentBooking.date}, {currentBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Prepaid Escrow Deposit:</span>
                  <span className="font-bold text-emerald-400">₹{(currentBooking.amountInr || 2499).toLocaleString('en-IN')} (Safely Held)</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-white/5">
                  <span className="text-slate-400">Escrow Release Policy:</span>
                  <span className="text-slate-300 font-medium">Disbursed to mentor after mutual completion</span>
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
                  onClick={() => setShowCompletionModal(true)}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Mark Session Concluded & Release Payout &rarr;
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
              <span>Platform Escrow Protection:</span>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>
            <button
              onClick={() => setShowCompletionModal(true)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete & Release Escrow</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Completion & Escrow Release Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl p-6 text-white space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <Building className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-white">Conclude Session & Add to Mentor Account</h3>
              <p className="text-xs text-slate-400">
                Confirming completion commands the Escrow Bank to execute an automated IMPS transfer directly into <span className="text-white font-semibold">{currentBooking.mentorName}</span>'s bank account.
              </p>
            </div>

            {/* Payout Breakdown */}
            <div className="p-4 rounded-xl bg-slate-950 border border-white/10 text-xs space-y-2.5">
              <div className="flex justify-between text-slate-400">
                <span>Money Held In:</span>
                <span className="text-blue-400 font-mono font-medium">ICICI Bank Escrow (••••9182)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Destination Bank:</span>
                <span className="text-white font-semibold">HDFC Bank A/C (••••4892)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Prepaid by Student:</span>
                <span className="text-white font-semibold">₹{(currentBooking.amountInr || 2499).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Platform Commission (10%):</span>
                <span className="text-white font-semibold">₹{Math.round((currentBooking.amountInr || 2499) * 0.1).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 font-bold">
                <span className="text-emerald-400">Direct Deposit to Mentor Account:</span>
                <span className="text-emerald-400 text-sm">₹{(currentBooking.mentorPayoutInr || 2250).toLocaleString('en-IN')} (IMPS)</span>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="space-y-1.5 text-center">
              <label className="text-xs font-semibold text-slate-300">How was the session experience?</label>
              <div className="flex justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSessionRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= sessionRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback note */}
            <div>
              <textarea
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                rows={2}
                placeholder="Leave a brief review for the mentor..."
                className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                onClick={handleConfirmCompletion}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Add ₹{(currentBooking.mentorPayoutInr || 2250).toLocaleString('en-IN')} to Mentor Bank</span>
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Release Celebratory Toast */}
      {isEscrowReleased && !showCompletionModal && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-2xl text-white space-y-2 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Money Added to Mentor's Bank Account!</span>
          </div>
          <p className="text-[11px] text-slate-300">
            ₹{(currentBooking.mentorPayoutInr || 2250).toLocaleString('en-IN')} has been transferred via IMPS into mentor's HDFC Bank A/C (••••4892). Bank UTR Ref: {currentBooking.bankTransferUtr || 'UTR-SB-90281'}.
          </p>
          <div className="pt-1 flex gap-2">
            <Link
              to="/student"
              className="text-[11px] font-bold text-blue-400 hover:text-blue-300"
            >
              Back to Student Hub &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionRoomPage;
