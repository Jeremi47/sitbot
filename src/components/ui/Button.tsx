import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'medium', className = '', children, disabled, ...props }, ref) => {
    const baseStyles = 'font-semibold rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary: 'bg-[#0066FF] text-white hover:bg-[#0052CC] active:shadow-inner',
      secondary: 'bg-transparent border-2 border-[#0066FF] text-[#0066FF] hover:bg-[#E6F0FF]',
      ghost: 'bg-transparent text-[#4A4A4A] hover:bg-[#F9FAFB]',
      danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626]',
      outline: 'bg-white border border-[#E5E7EB] text-[#4A4A4A] hover:bg-[#F9FAFB]'
    };

    const sizeStyles = {
      small: 'px-4 py-2 text-sm',
      medium: 'px-6 py-3 text-base',
      large: 'px-8 py-4 text-lg'
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
