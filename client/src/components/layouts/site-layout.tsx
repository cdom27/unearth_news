import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import Nav from "../navigation/nav";

interface SiteLayoutProps {
  children: ReactNode;
}

const SiteLayout = ({ children }: SiteLayoutProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`p-5 grainy-bg ${open ? "h-screen overflow-hidden" : ""}`}>
      <header className="flex justify-between items-center">
        <Link to="/" className="text-xl font-medium">
          Unearth
        </Link>

        <Nav onClick={() => setOpen(!open)} open={open} />
      </header>

      <main className="min-h-screen flex flex-col items-center justify-center">
        {children}
      </main>

      <footer>footer</footer>
    </div>
  );
};

export default SiteLayout;
