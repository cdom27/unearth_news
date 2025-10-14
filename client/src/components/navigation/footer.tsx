import { Link, NavLink } from "react-router";
import { navLinks } from "../../utils/nav-links";

const Footer = () => {
  return (
    <footer className="px-5 py-10 bg-bg-dark text-fg-light">
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
                      ? "text-brand-primary/90 underline decoration-dotted"
                      : "hover:underline hover:decoration-dotted") + " text-2xl"
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="pt-5 text-fg-dark-tertiary">
        &#169; 2025 Unearth. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
