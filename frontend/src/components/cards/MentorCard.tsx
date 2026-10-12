
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { Mentor } from '../../types';

interface MentorCardProps {
  mentor: Mentor;
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-lg hover:border-blue-200 transition-all flex flex-col justify-between group">
      <div className="space-y-3.5">
        <div className="flex items-start gap-3.5">
          <img
            src={mentor.avatar}
            alt={mentor.name}
            className="w-14 h-14 rounded-2xl object-cover border border-gray-100 group-hover:scale-105 transition-transform"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-gray-900 text-sm truncate">{mentor.name}</h3>
              <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
            </div>
            <p className="text-xs text-gray-600 truncate">{mentor.title}</p>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <span className="font-semibold text-blue-600">{mentor.company}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500">{mentor.experienceYears}+ yrs</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {mentor.bio}
        </p>

        {/* Skill Pills */}
        <div className="flex flex-wrap gap-1.5">
          {mentor.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded-md bg-gray-100 text-[11px] font-medium text-gray-700"
            >
              {skill}
            </span>
          ))}
          {mentor.skills.length > 3 && (
            <span className="px-2 py-0.5 rounded-md bg-gray-50 text-[11px] text-gray-600 font-medium">
              +{mentor.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-amber-500 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{mentor.rating.toFixed(2)}</span>
            <span className="text-gray-600 font-normal">({mentor.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{mentor.nextAvailableSlot}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-600 uppercase block font-semibold">
              Package from
            </span>
            <span className="text-base font-bold text-gray-900">
              ₹{mentor.hourlyRateInr.toLocaleString('en-IN')}
            </span>
          </div>
          <Link
            to={`/mentor/${mentor.id}`}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold text-xs transition-colors"
          >
            View Profile <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
