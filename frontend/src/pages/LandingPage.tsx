import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ShieldCheck,
  Building2,
  Video,
  Star,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Code2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { mentors } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const popularSkills = [
    'Java',
    'Spring Boot',
    'React',
    'DSA',
    'System Design',
    'Cloud',
    'Interview Preparation'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/mentors?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/mentors');
    }
  };

  const handleSkillClick = (skill: string) => {
    navigate(`/mentors?skill=${encodeURIComponent(skill)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ========================================================= */}
      {/* 1. HERO SECTION (Dark Midnight Navy #0B1020)              */}
      {/* ========================================================= */}
      <section className="relative bg-[#0B1020] text-white overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline & Search */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wide backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Mentorship for Engineering Placements & Career Shifts</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Bridge the Gap Between{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400">
                  College and Industry.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-gray-300 max-w-2xl font-normal leading-relaxed">
                Learn directly from experienced professionals. Build practical skills, gain industry
                insights, and prepare for your next career opportunity through personalized mentorship.
              </p>

              {/* Search Bar Form */}
              <form onSubmit={handleSearch} className="pt-2">
                <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-2 shadow-2xl focus-within:border-blue-500/60 transition-all">
                  <div className="flex items-center flex-1 px-3 py-2">
                    <Search className="w-5 h-5 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search skills, companies, roles, or topics..."
                      className="w-full bg-transparent border-0 px-3 py-1 text-sm text-white placeholder-gray-400 focus:outline-hidden"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-2 sm:mt-0 sm:shrink-0 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98]"
                  >
                    Explore Mentors
                  </button>
                </div>
              </form>

              {/* Popular Skill Tags */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-400 font-medium">Popular Skills:</span>
                {popularSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillClick(skill)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
                  >
                    {skill}
                  </button>
                ))}
              </div>

              {/* Proof points */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-gray-400 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Verified Engineers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>Mentors from Google, Microsoft, Amazon</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Mockup Card */}
            <div className="lg:col-span-5 relative">
              {/* Highlight Floater badge */}
              <div className="absolute -top-4 -right-2 sm:right-6 z-20 px-3.5 py-1.5 rounded-xl bg-[#111827] border border-blue-500/30 text-white shadow-xl flex items-center gap-2 text-xs font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                <span>89% Off-Campus Placement Rate</span>
              </div>

              {/* Main Interactive Mentor Spotlight Card */}
              <div className="relative rounded-2xl bg-[#111827] border border-white/10 p-6 shadow-2xl space-y-5 text-white">
                <div className="flex items-start gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
                    alt="Aarav Sharma"
                    className="w-14 h-14 rounded-2xl object-cover border border-blue-500/30 shadow-md"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-white">Aarav Sharma</h2>
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                    </div>
                    <p className="text-xs text-gray-300">Sr. Staff Engineer • Google</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>4.95</span>
                      <span className="text-gray-400 font-normal">(84 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300 italic leading-relaxed">
                  "Let's walk through distributed caching bottlenecks and practice live whiteboard
                  problem decomposition."
                </div>

                {/* Sub-card: Live Call Demo preview */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">1:1 Video Mentorship</p>
                      <p className="text-[11px] text-gray-300">Integrated screen & code share</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-blue-300">₹3,499</span>
                    <span className="text-[10px] text-gray-400 block">/ 90 mins</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Available Tomorrow</span>
                  </div>
                  <Link
                    to="/mentors"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View Packages <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. FEATURED MENTORS SECTION                               */}
      {/* ========================================================= */}
      <section className="py-20 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Industry Veterans
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1020] mt-1">
                Featured Mentors Ready to Guide You
              </h2>
              <p className="text-sm text-gray-600 mt-2 max-w-xl">
                Learn from verified engineers at market-leading organizations who provide personalized
                mock interviews, system design blueprints, and portfolio critique.
              </p>
            </div>
            <Link
              to="/mentors"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View All Mentors <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.slice(0, 3).map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-gray-100"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{mentor.name}</h3>
                      <p className="text-xs text-gray-600 line-clamp-1">{mentor.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <span className="font-semibold text-blue-600">{mentor.company}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500">{mentor.experienceYears}+ years exp</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {mentor.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {mentor.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-gray-100 text-[11px] font-medium text-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                    {mentor.skills.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md bg-gray-50 text-[11px] text-gray-600 font-medium">
                        +{mentor.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-gray-600 uppercase block font-semibold">
                      Starting at
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      ₹{mentor.hourlyRateInr.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <Link
                    to={`/mentor/${mentor.id}`}
                    className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold text-xs transition-colors"
                  >
                    View Profile & Packages
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. HOW SKILLBRIDGE WORKS                                  */}
      {/* ========================================================= */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Four Clear Steps
            </span>
            <h2 className="text-3xl font-extrabold text-[#0B1020]">How SkillBridge Works</h2>
            <p className="text-sm text-gray-600">
              A transparent, outcome-oriented workflow from discovery to your private 1-on-1 industry
              mentorship session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Discover Industry Mentors',
                desc: 'Filter mentors by current tech stack, company pedigree, target role, package budget, and real student ratings.',
                icon: Search
              },
              {
                step: '02',
                title: 'Choose a Package',
                desc: 'Pick between mock system design rounds, DSA diagnostics, resume revamps, or full-stack project code reviews.',
                icon: Layers
              },
              {
                step: '03',
                title: 'Book a Slot',
                desc: 'Select an available date and evening time slot directly from the mentor’s synchronized calendar.',
                icon: Calendar
              },
              {
                step: '04',
                title: 'Connect 1-on-1',
                desc: 'Join the built-in online video room, share your terminal or code editor, and receive an actionable written improvement plan.',
                icon: Video
              }
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl bg-[#F7F8FC] border border-gray-100 p-6 space-y-4 hover:border-blue-200 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-gray-300">{item.step}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. VALUE PROPOSITION: STUDENTS & MENTORS                  */}
      {/* ========================================================= */}
      <section className="py-20 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Student Pillar */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-sm space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B1020]">
                Why Students Choose SkillBridge
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                College curriculums often lag behind industry standards. Get direct access to
                engineers currently working with high-scale enterprise architectures.
              </p>

              <div className="space-y-3">
                {[
                  'Practical code critiques instead of theoretical lectures',
                  'Realistic FAANG-grade mock interviews with written scorecards',
                  'Strategic guidance for off-campus placement drives and hackathons',
                  'Pay per session with no long lock-in commitments'
                ].map((text, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/mentors"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                Start Exploring Mentors <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Professional Pillar */}
            <div className="bg-[#0B1020] text-white rounded-3xl p-8 border border-white/10 shadow-xl space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Why Professionals Mentor Here</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Empower ambitious students, give back to the university engineering ecosystem, and
                monetize your architectural expertise on your own schedule.
              </p>

              <div className="space-y-3">
                {[
                  'Set your own hourly prices and structured session duration',
                  'Control availability completely (evenings and weekends only)',
                  'Automated booking management and simulated escrow releases',
                  'Build your personal brand as a distinguished technical leader'
                ].map((text, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/signup?role=mentor"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 hover:bg-gray-100 text-xs font-semibold shadow-sm transition-all"
              >
                Launch Mentor Profile <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. CALL TO ACTION BANNER                                  */}
      {/* ========================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#0B1020] via-[#1E293B] to-[#0B1020] border border-gray-800 p-8 sm:p-12 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Join 180+ Working Tech Leads & Engineers
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto">
              Ready to shape the next generation of engineers?
            </h2>
            <p className="text-sm text-gray-300 max-w-xl mx-auto">
              Create your training packages, set your calendar slots, and start mentoring motivated
              engineering college students.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                to="/signup?role=mentor"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all"
              >
                Set Up Mentor Packages
              </Link>
              <Link
                to="/mentors"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all"
              >
                Browse Student Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
