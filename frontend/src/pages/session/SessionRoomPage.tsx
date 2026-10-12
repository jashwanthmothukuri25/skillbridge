
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
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
  Sparkles
} from 'lucide-react';

export const SessionRoomPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useApp();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState<'chat' | 'notes'>('chat');

  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'Mentor',
      text: 'Hi there! Welcome to our 1-on-1 session. Feel free to paste your code or repository link here.',
      time: 'Just now',
    },
  ]);
  const [messageInput, setMessageInput] = useState('');

  // 60-minute countdown simulation
  const [secondsRemaining, setSecondsRemaining] = useState(3600);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setMessages([
      ...messages,
      {
        id: `msg-${Date.now()}`,
        sender: user?.name || 'You',
        text: messageInput.trim(),
        time: 'Just now',
      },
    ]);
    setMessageInput('');
  };

  const handleLeaveSession = () => {
    if (window.confirm('Are you sure you want to end this simulated session?')) {
      navigate('/student');
    }
  };

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="h-14 border-b border-white/10 px-4 md:px-6 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            SB
          </div>
          <div>
            <div className="font-semibold text-xs text-white flex items-center gap-2">
              <span>SkillBridge Encrypted Room</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="text-[10px] text-slate-400">
              Session #{sessionId || 'demo'} • 1-on-1 Direct Video Bridge
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-mono font-medium flex items-center gap-1.5 text-slate-200">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>{formatTime(secondsRemaining)} remaining</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Simulated Escrow Active</span>
          </div>
        </div>
      </header>

      {/* Main Grid: Video Stream + Side Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Video Stage */}
        <div className="flex-1 p-4 flex flex-col justify-between relative bg-slate-950">
          {/* Main Video Tile */}
          <div className="flex-1 rounded-2xl bg-slate-900 border border-white/10 relative overflow-hidden flex items-center justify-center shadow-inner">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-blue-600/20 border-2 border-blue-500/30 flex items-center justify-center mx-auto text-blue-400 text-2xl font-bold">
                M
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">Verified Mentor Stream</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live audio & screen sharing active (Simulated environment)
                </p>
              </div>
            </div>

            {/* Picture-in-Picture Tile (Self) */}
            <div className="absolute bottom-4 right-4 w-40 h-28 rounded-xl bg-slate-800 border border-white/20 shadow-lg overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-1">
                  {user?.name ? user.name.charAt(0) : 'Y'}
                </div>
                <div className="text-[10px] text-slate-300 font-medium">You (Student)</div>
              </div>
            </div>
          </div>

          {/* Bottom Floating Control Bar */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-full border transition-all ${
                isMicOn
                  ? 'bg-slate-800 border-white/20 text-white hover:bg-slate-700'
                  : 'bg-rose-600 border-rose-500 text-white hover:bg-rose-700'
              }`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-full border transition-all ${
                isVideoOn
                  ? 'bg-slate-800 border-white/20 text-white hover:bg-slate-700'
                  : 'bg-rose-600 border-rose-500 text-white hover:bg-rose-700'
              }`}
              title={isVideoOn ? 'Stop Video' : 'Start Video'}
            >
              {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3 rounded-full border transition-all ${
                isScreenSharing
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-800 border-white/20 text-white hover:bg-slate-700'
              }`}
              title="Share Screen"
            >
              <MonitorUp className="w-4 h-4" />
            </button>

            <button
              onClick={handleLeaveSession}
              className="px-5 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave Session</span>
            </button>
          </div>
        </div>

        {/* Right Panel: Chat & Notes */}
        <aside className="w-80 border-l border-white/10 bg-slate-900 flex flex-col justify-between hidden md:flex">
          <div>
            {/* Panel Tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveSideTab('chat')}
                className={`flex-1 py-3 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                  activeSideTab === 'chat'
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-white/5'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Live Chat
              </button>
              <button
                onClick={() => setActiveSideTab('notes')}
                className={`flex-1 py-3 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                  activeSideTab === 'notes'
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-white/5'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Session Notes
              </button>
            </div>

            {/* Chat Body */}
            {activeSideTab === 'chat' ? (
              <div className="p-4 space-y-3 h-[calc(100vh-210px)] overflow-y-auto">
                {messages.map((m) => (
                  <div key={m.id} className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-300">{m.sender}</span>
                      <span>{m.time}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-slate-200">
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 space-y-3">
                <div className="text-[11px] text-slate-400">
                  Shared scratchpad for whiteboard points, architectural links, and action items:
                </div>
                <textarea
                  placeholder="• Review distributed cache invalidation&#10;• Practice LeetCode 208 (Trie)&#10;• Revamp resume system bullets"
                  rows={14}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-white/10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>
            )}
          </div>

          {/* Chat Input */}
          {activeSideTab === 'chat' && (
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type code or message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
};

export default SessionRoomPage;
