import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant: "primary" | "secondary" | "outline";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
}

const coreClasses =
  "font-semibold cursor-pointer rounded-full px-5 py-2 border-1";

const variantClasses: Record<string, string> = {
  primary: "",
  secondary:
    "bg-bg-light border-bg-light hover:bg-bg-dark-secondary text-fg-dark hover:text-fg-light",
  outline:
    "border-fg-dark-tertiary hover:border-fg-dark-secondary active:border-fg-dark-secondary",
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  disabled = false,
  type = "button",
}: ButtonProps) => {
  const computedClasses = `${className} ${
    variantClasses[variant] || variantClasses["primary"]
  }`;

  return (
    <button
      className={`${coreClasses} ${computedClasses}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
