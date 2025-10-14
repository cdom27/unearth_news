import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import Nav from "../navigation/nav";
import { Banner, BannerBody, BannerFooter } from "../ui/banner";
import Footer from "../navigation/footer";

interface SiteLayoutProps {
  children: ReactNode;
}

const SiteLayout = ({ children }: SiteLayoutProps) => {
  const [open, setOpen] = useState(false);
  const now = new Date().toDateString();

  return (
    <div className={`grainy-bg ${open ? "h-screen overflow-hidden" : ""}`}>
      <header>
        <Banner label="Announcement">
          <BannerBody>
            Unearth is currently under development, some features may only be
            available to{" "}
            <Link
              to="/subscribe"
              className="text-fg-dark-tertiary underline underline-offset-2 decoration-dotted hover:text-brand-primary"
            >
              subscribers
            </Link>
          </BannerBody>

          <BannerFooter>{now}</BannerFooter>
        </Banner>

        <div className="flex p-5 justify-between items-center">
          <Link to="/" className="text-xl font-medium">
            Unearth
          </Link>

          <Nav onClick={() => setOpen(!open)} open={open} />
        </div>
      </header>

      <main className="min-h-screen flex flex-col items-center justify-center">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default SiteLayout;
