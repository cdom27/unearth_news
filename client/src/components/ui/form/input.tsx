import { forwardRef } from "react";
import type { FieldError } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  className?: string;
  error?: FieldError;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, type, placeholder, className = "", error, ...rest }, ref) => {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <label htmlFor={id} className="font-medium text-lg">
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          className="px-5 py-2 rounded-full border-1 focus:outline-none focus:border-fg-dark placeholder:text-fg-dark-secondary border-fg-dark-tertiary bg-bg-light-secondary"
          {...rest}
        />
        {error && <span className="text-red-500 text-sm">{error.message}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
