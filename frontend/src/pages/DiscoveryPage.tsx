import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MentorCard } from '../components/cards/MentorCard';

export const DiscoveryPage: React.FC = () => {
  const { mentors } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParam = searchParams.get('q') || '';
  const skillParam = searchParams.get('skill') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>(skillParam || 'all');
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'priceAsc' | 'priceDesc'>('recommended');

  const companies = ['all', 'Google', 'Microsoft', 'Amazon'];
  const allSkills = ['all', 'Java', 'Spring Boot', 'React', 'DSA', 'System Design', 'Cloud Architecture', 'TypeScript'];

  const filteredMentors = useMemo(() => {
    return mentors
      .filter((mentor) => {
        const matchesQuery =
          !searchQuery.trim() ||
          mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mentor.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCompany =
          selectedCompany === 'all' ||
          mentor.company.toLowerCase() === selectedCompany.toLowerCase();

        const matchesSkill =
          selectedSkill === 'all' ||
          mentor.skills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase());

        return matchesQuery && matchesCompany && matchesSkill;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'priceAsc') return a.hourlyRateInr - b.hourlyRateInr;
        if (sortBy === 'priceDesc') return b.hourlyRateInr - a.hourlyRateInr;
        return 0; // recommended
      });
  }, [mentors, searchQuery, selectedCompany, selectedSkill, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCompany('all');
    setSelectedSkill('all');
    setSortBy('recommended');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#0B1020] tracking-tight">
            Explore Industry Mentors
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl">
            Filter through verified senior engineers and tech leads. Book targeted 1-on-1 sessions for
            system design, DSA, coding interviews, and career roadmaps.
          </p>
        </div>

        {/* Search and Sort Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by mentor name, role, company..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-gray-50/50 hover:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <span>Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="recommended">Recommended</option>
              <option value="rating">Highest Rated</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mr-2">
            Company:
          </span>
          {companies.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCompany(c)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                selectedCompany === c
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {c}
            </button>
          ))}

          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-4 mr-2">
            Skill:
          </span>
          {allSkills.slice(0, 5).map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSkill(s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedSkill === s
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {s}
            </button>
          ))}

          {(selectedCompany !== 'all' || selectedSkill !== 'all' || searchQuery) && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-rose-600 hover:underline ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-gray-500">
              Showing <strong className="text-gray-900">{filteredMentors.length}</strong> matching mentors
            </span>
          </div>

          {filteredMentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
              <p className="text-base font-bold text-gray-900">No mentors match your criteria</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try loosening your filters or search query to explore more verified professionals.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoveryPage;
