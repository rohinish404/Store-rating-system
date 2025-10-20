import React from 'react';

interface InputProps {
  label: string;
  type?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  multiline = false,
  rows = 4,
}) => {
  const inputClasses = `w-full px-2.5 py-2.5 border rounded-md text-base transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 ${
    error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
  }`;

  return (
    <div className="mb-4">
      <label className="block font-medium mb-2 text-slate-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={inputClasses}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputClasses}
        />
      )}
      {error && <span className="block text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};

export default Input;
