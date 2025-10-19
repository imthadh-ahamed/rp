import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export default function Card({ children, hover = false, className = '', ...props }: CardProps) {
  const hoverClass = hover ? 'hover:shadow-lg' : '';
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-md p-6 border border-gray-100 transition ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
