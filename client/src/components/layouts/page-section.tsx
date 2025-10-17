import type { ReactNode } from "react";

interface PageSectionProps {
  children: ReactNode;
  className?: string;
}

const PageSection = ({ children, className = "" }: PageSectionProps) => {
  return (
    <section
      className={`px-5 lg:px-30 2xl:px-0 2xl:w-[1350px] 2xl:mx-auto ${className}`}
    >
      {children}
    </section>
  );
};

export default PageSection;
