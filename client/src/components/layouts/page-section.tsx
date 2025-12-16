import type { ReactNode } from "react";

interface PageSectionProps {
  children: ReactNode;
  className?: string;
}

const PageSection = ({ children, className = "" }: PageSectionProps) => {
  return <section className={className}>{children}</section>;
};

export default PageSection;
