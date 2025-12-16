import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import Nav from "../navigation/nav";
import Footer from "../navigation/footer";
import { ListIcon } from "@phosphor-icons/react";

interface SiteLayoutProps {
  children: ReactNode;
}

const SiteLayout = ({ children }: SiteLayoutProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`grainy-bg ${open ? "h-screen overflow-hidden" : ""}`}>
      <header>
        <div className="bg-bg-dark text-fg-light">
          <p className="text-center 2xl:w-[1350px] 2xl:mx-auto px-5 lg:px-30 2xl:px-0 py-2.5 text-fg-dark-secondary">
            Unearth is currently under development, some features may only be
            available to{" "}
            <Link
              to="/subscribe"
              className="text-fg-dark-tertiary underline underline-offset-4 decoration-dotted hover:text-brand-primary"
            >
              subscribers
            </Link>
          </p>
        </div>

        <div className="flex p-5 lg:px-30 2xl:px-0 2xl:w-[1350px] 2xl:mx-auto justify-between items-center border-b-1 border-fg-dark-tertiary">
          <Link to="/" className="text-xl font-medium">
            Unearth
          </Link>

          <Nav setOpen={setOpen} open={open} />

          <button
            onClick={() => setOpen(!open)}
            className="hover:cursor-pointer"
          >
            <ListIcon className="size-6 fill-fg-dark" />
          </button>
        </div>
      </header>

      <main className="flex flex-col min-h-screen py-25 px-5 lg:px-30 2xl:px-0 2xl:w-[1350px] 2xl:mx-auto">
        <div
          onClick={() => setOpen(false)}
          className={`fixed inset-0 transition-opacity duration-500 ease-in-out bg-fg-dark ${
            open ? "opacity-20 z-0" : "opacity-0 -z-10"
          }`}
        />
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default SiteLayout;
