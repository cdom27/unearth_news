import type { ReactNode } from "react";
import type { Variant } from "src/lib/types/variant";
import { coreClasses, variantClasses } from "../../utils/button-classes";

interface ButtonProps {
  children: ReactNode;
  variant: Variant;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
}

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
