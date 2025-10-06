import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export default function Card({ children, hover = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm ${
        hover ? 'transition-all duration-300 hover:shadow-lg hover:scale-[1.02]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
