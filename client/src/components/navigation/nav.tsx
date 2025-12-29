import { XIcon } from "@phosphor-icons/react";
import { Link, NavLink } from "react-router";
import { navLinks } from "../../utils/nav-links";
import { quickLinks } from "../../utils/quick-links";

interface NavProps {
  setOpen: (action: boolean) => void;
  open: boolean;
}

const Nav = ({ setOpen, open }: NavProps) => {
  return (
    <nav className="flex">
      <ul className="hidden sm:flex gap-4">
        {quickLinks.map((link) => (
          <li key={link.href}>
            <NavLink
              to={link.href}
              className={({ isActive }) =>
                isActive
                  ? "underline decoration-dotted underline-offset-4 text-fg-dark"
                  : "hover:underline hover:decoration-dotted underline-offset-4 text-fg-dark-tertiary hover:text-fg-dark-secondary"
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div
        className={`fixed inset-0 sm:w-[320px] xl:w-[400px] z-10 p-5 transition-transform duration-500 ease-in-out bg-bg-dark-secondary text-fg-light
    ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between pb-5 border-b-1 border-fg-dark-secondary">
          <Link to="/" className="text-xl font-medium">
            Unearth
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="hover:cursor-pointer"
            aria-label="Close menu"
          >
            <XIcon className="size-6 fill-fg-light" />
          </button>
        </div>

        {navLinks.map((category) => (
          <section
            key={category.name}
            className="py-2 border-b-1 border-fg-dark-secondary"
          >
            <h2 className="text-xl text-fg-dark-secondary">{category.name}</h2>

            <ul className="flex flex-col pt-3 gap-1">
              {category.links.map((link) => (
                <li key={link.href}>
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      (isActive
                        ? "text-brand-primary/90 underline decoration-dotted underline-offset-4"
                        : "hover:underline hover:decoration-dotted underline-offset-4") +
                      " text-2xl"
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </nav>
  );
};

export default Nav;
