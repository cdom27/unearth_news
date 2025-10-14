import { XIcon } from "@phosphor-icons/react";
import { useState, type ReactNode } from "react";

interface BannerProps {
  children?: ReactNode;
  label?: string;
}

const BannerBody = ({ children }: BannerProps) => {
  return <div className="text-fg-dark-secondary">{children}</div>;
};

const BannerFooter = ({ children }: BannerProps) => {
  return <div className="text-fg-dark-tertiary">{children}</div>;
};

const Banner = ({ children, label }: BannerProps) => {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`${
        open
          ? "flex flex-col px-5 py-2.5 gap-2.5 bg-bg-dark text-fg-light"
          : "hidden"
      }`}
    >
      <div className="flex items-center justify-between">
        <span>{label}</span>

        <button className="hover:cursor-pointer" onClick={() => setOpen(false)}>
          <XIcon className="size-5 fill-fg-light" />
        </button>
      </div>

      {children}
    </div>
  );
};

export { Banner, BannerBody, BannerFooter };
