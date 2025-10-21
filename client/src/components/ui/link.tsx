import type { ReactNode } from "react";
import type { Variant } from "src/lib/types/variant";
import { Link as RLink } from "react-router";
import { coreClasses, variantClasses } from "../../utils/button-classes";

interface LinkProps {
  children: ReactNode;
  variant: Variant;
  className?: string;
  href: string;
}

const Link = ({
  children,
  variant = "primary",
  className = "",
  href = "/",
}: LinkProps) => {
  const computedClasses = `${className} ${variantClasses[variant] || variantClasses["primary"]}`;

  return (
    <RLink
      to={href}
      className={`text-center ${coreClasses} ${computedClasses}`}
    >
      {children}
    </RLink>
  );
};

export default Link;
