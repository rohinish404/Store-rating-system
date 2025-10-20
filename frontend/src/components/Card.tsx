import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm mb-6 ${className}`}>
      {title && <h2 className="text-xl font-semibold mb-4 text-slate-900">{title}</h2>}
      <div className="text-slate-900">{children}</div>
    </div>
  );
};

export default Card;
