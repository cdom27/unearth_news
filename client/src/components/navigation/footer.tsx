import { Link, NavLink } from "react-router";
import { navLinks } from "../../utils/nav-links";

const Footer = () => {
  return (
    <footer className="px-5 lg:px-30 2xl:px-0 py-10 bg-bg-dark text-fg-light">
      <div className="2xl:w-[1350px] 2xl:mx-auto">
        <p className="text-fg-dark-secondary">
          Unearth is currently under development, some features may only be
          available to{" "}
          <Link
            to="/subscribe"
            className="text-fg-dark-tertiary underline underline-offset-2 decoration-dotted hover:text-brand-primary"
          >
            subscribers
          </Link>
        </p>

        <div className="flex justify-between items-center py-5 mb-10 border-b-1 border-fg-dark-secondary">
          <Link to="/" className="text-xl font-medium">
            Unearth
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 pb-10">
          {navLinks.map((category) => (
            <section key={category.name} className="py-2">
              <h2 className="text-xl text-fg-dark-secondary border-b-1 border-fg-dark-secondary">
                {category.name}
              </h2>

              <ul className="flex flex-col py-3 gap-1">
                {category.links.map((link) => (
                  <li key={link.href}>
                    <NavLink
                      to={link.href}
                      className={({ isActive }) =>
                        isActive
                          ? "text-brand-primary/90 underline underline-offset-4 decoration-dotted"
                          : "hover:underline hover:decoration-dotted underline-offset-4"
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

        <p className="pt-5 text-fg-dark-tertiary text-right">
          &#169; 2025 Unearth. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
