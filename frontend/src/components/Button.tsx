import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  fullWidth = false,
}) => {
  const baseClasses = 'px-5 py-2.5 rounded-md text-base font-medium cursor-pointer transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:hover:bg-blue-600',
    secondary: 'bg-slate-600 text-white hover:bg-slate-700 disabled:hover:bg-slate-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:hover:bg-red-600',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass}`}
    >
      {children}
    </button>
  );
};

export default Button;
