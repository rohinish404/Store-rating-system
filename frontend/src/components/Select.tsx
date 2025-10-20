import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
}) => {
  return (
    <div className="mb-4">
      <label className="block font-medium mb-2 text-slate-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-2.5 py-2.5 border rounded-md text-base transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
            : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="block text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};

export default Select;
