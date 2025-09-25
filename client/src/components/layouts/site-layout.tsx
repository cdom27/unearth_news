import type { ReactNode } from "react";

interface SiteLayoutProps {
  children: ReactNode;
}

const SiteLayout = ({ children }: SiteLayoutProps) => {
  return (
    <>
      <header>nav</header>
      <main className="min-h-screen flex flex-col items-center justify-center">
        {children}
      </main>
      <footer>footer</footer>
    </>
  );
};

export default SiteLayout;
