import React from 'react';

interface RatingStarsProps {
  rating: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  onRate,
  readonly = false,
  size = 'medium',
}) => {
  const stars = [1, 2, 3, 4, 5];

  const sizeClasses = {
    small: 'text-base',
    medium: 'text-2xl',
    large: 'text-[2.5rem]',
  };

  return (
    <div className={`inline-flex gap-1 ${sizeClasses[size]}`}>
      {stars.map((star) => (
        <span
          key={star}
          className={`transition-colors ${
            star <= rating ? 'text-amber-400' : 'text-gray-300'
          } ${!readonly ? 'cursor-pointer hover:text-amber-400 hover:scale-110' : ''}`}
          onClick={() => !readonly && onRate && onRate(star)}
          role={readonly ? undefined : 'button'}
          tabIndex={readonly ? undefined : 0}
          onKeyDown={(e) => {
            if (!readonly && onRate && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onRate(star);
            }
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingStars;
