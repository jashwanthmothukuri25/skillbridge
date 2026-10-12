import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Star,
  Clock,
  Globe,
  Layers,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PackageCard } from '../components/cards/PackageCard';

export const MentorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { mentors } = useApp();

  const mentor = mentors.find((m) => m.id === id) || mentors[0];
  const [activeTab, setActiveTab] = useState<'about' | 'packages' | 'reviews'>('about');

  if (!mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm font-semibold text-gray-600">Mentor not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Header Banner */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-white shadow-md"
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1020] tracking-tight">
                    {mentor.name}
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">{mentor.title}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-1">
                  <span className="font-bold text-blue-600 text-sm">{mentor.company}</span>
                  <span>•</span>
                  <span>{mentor.experienceYears}+ years experience</span>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{mentor.rating.toFixed(2)}</span>
                    <span className="text-gray-400">({mentor.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-center sm:text-left md:text-center">
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">
                  Next Available Slot
                </span>
                <span className="text-xs font-bold text-blue-950 flex items-center justify-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  {mentor.nextAvailableSlot}
                </span>
              </div>
              <a
                href="#packages"
                onClick={() => setActiveTab('packages')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs text-center shadow-md shadow-blue-500/20 transition-all"
              >
                Browse Mentorship Packages
              </a>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="border-b border-gray-200 flex items-center gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 transition-colors ${
              activeTab === 'about'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Overview & Background
          </button>
          <button
            id="packages"
            onClick={() => setActiveTab('packages')}
            className={`pb-3 transition-colors ${
              activeTab === 'packages'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Training Packages ({mentor.packages.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition-colors ${
              activeTab === 'reviews'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Student Feedback ({mentor.reviewCount})
          </button>
        </div>

        {/* Tab 1: About */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 space-y-4 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900">About Mentorship Style</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{mentor.about}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{mentor.bio}</p>
              </div>

              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 space-y-4 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900">Core Technical Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Session Logistics
                </h3>
                <div className="space-y-3 text-xs text-gray-600">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>Languages: {mentor.languages.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Typically available weekday evenings & weekends</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Verified background & company identity</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Packages */}
        {activeTab === 'packages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentor.packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} mentorName={mentor.name} />
            ))}
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-lg font-bold text-gray-900">Recent Student Reviews</h3>
            <div className="divide-y divide-gray-100">
              {[
                {
                  student: 'Naveen K.',
                  role: 'Tier-2 CSE Graduate',
                  rating: 5,
                  comment:
                    'The mock system design round was exceptionally realistic. Aarav pointed out bottlenecks in my sharding approach that textbook courses never mention.'
                },
                {
                  student: 'Sanya Gupta',
                  role: 'Junior Frontend Developer',
                  rating: 5,
                  comment:
                    'Very clear, patient, and methodical. Helped me revamp my portfolio and clear my off-campus Amazon coding round.'
                }
              ].map((rev, i) => (
                <div key={i} className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{rev.student}</p>
                      <p className="text-xs text-gray-400">{rev.role}</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorProfilePage;
