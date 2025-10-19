import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  fullWidth = false, 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = "py-3 px-4 rounded-lg font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-[#0891b2] to-[#06b6d4] text-white hover:from-[#0e7490] hover:to-[#0891b2] shadow-lg hover:shadow-xl",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300",
    outline: "border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
