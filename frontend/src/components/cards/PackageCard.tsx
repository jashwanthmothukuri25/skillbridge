import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { MentorPackage } from '../../types';

interface PackageCardProps {
  pkg: MentorPackage;
  mentorName?: string;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, mentorName }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-bold text-gray-900 text-sm leading-snug">{pkg.title}</h4>
          <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            ₹{pkg.priceInr.toLocaleString('en-IN')}
          </span>
        </div>

        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
          {pkg.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>{pkg.durationMinutes} mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>{pkg.sessionsCount} {pkg.sessionsCount === 1 ? 'Session' : 'Sessions'}</span>
          </div>
        </div>

        {/* Deliverables / Key Topics */}
        {pkg.deliverables && pkg.deliverables.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-gray-100">
            {pkg.deliverables.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-gray-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
        {mentorName && (
          <span className="text-[11px] text-gray-600 truncate max-w-[120px]">
            By {mentorName}
          </span>
        )}
        <Link
          to={`/book/${pkg.id}`}
          className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
        >
          Book Slot <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default PackageCard;
