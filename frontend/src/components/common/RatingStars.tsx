import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = 'sm',
  showNumber = false
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, index) => {
          const filled = index + 1 <= Math.round(rating);
          return (
            <Star
              key={index}
              className={`${iconSizes[size]} ${
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          );
        })}
      </div>
      {showNumber && (
        <span className="text-xs font-bold text-gray-800 ml-1">
          {rating.toFixed(2)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
