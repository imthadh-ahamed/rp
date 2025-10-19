import { InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  children?: React.ReactNode;
}

export default function Checkbox({ label, children, className = '', ...props }: CheckboxProps) {
  return (
    <label className="flex items-start cursor-pointer">
      <input
        type="checkbox"
        className={`w-4 h-4 mt-1 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2 ${className}`}
        {...props}
      />
      {(label || children) && (
        <span className="ml-2 text-sm text-gray-700">
          {children || label}
        </span>
      )}
    </label>
  );
}
