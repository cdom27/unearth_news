import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants: Record<string, string> = {
  primary:
    "bg-clay-800 text-clay-50 hover:bg-brand-500 hover:text-clay-900 disabled:bg-clay-600 disabled:text-clay-50",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", children, ...props }, ref) => {
    const variantClasses = buttonVariants[variant];

    return (
      <button
        ref={ref}
        className={`rounded-md hover:cursor-pointer py-2 px-6 transition-colors duration-250 disabled:cursor-not-allowed ${variantClasses} ${className}`.trim()}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
