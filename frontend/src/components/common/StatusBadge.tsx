import React from 'react';
import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

type StatusType = 'upcoming' | 'pending' | 'completed' | 'cancelled' | 'active' | 'inactive';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const statusStyles: Record<StatusType, { bg: string; text: string; border: string; icon: React.FC<{ className?: string }> }> = {
    upcoming: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: Clock
    },
    pending: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: AlertCircle
    },
    completed: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: CheckCircle2
    },
    cancelled: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: XCircle
    },
    active: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: CheckCircle2
    },
    inactive: {
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      border: 'border-gray-200',
      icon: XCircle
    }
  };

  const style = statusStyles[status] || statusStyles.pending;
  const IconComponent = style.icon;
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}
    >
      <IconComponent className="w-3 h-3" />
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
