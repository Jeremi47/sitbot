import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', required, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            {label}
            {required && <span className="text-[#EF4444] ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 text-base border ${
            error ? 'border-[#EF4444]' : 'border-[#E5E7EB]'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent disabled:bg-[#F9FAFB] disabled:opacity-60 transition-all ${className}`}
          required={required}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-[#EF4444]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
