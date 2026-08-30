import Link from "next/link";
import LogoIcon from "../../icons/logo";
import XIcon from "../../icons/x";
import { ReactNode, useEffect } from "react";

interface SideMenuProps {
  setOpen: (action: boolean) => void;
  open: boolean;
  children: ReactNode;
}

export default function SideMenu({ open, setOpen, children }: SideMenuProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div>
      <div
        className={`fixed inset-0 bg-clay-900 transition-opacity duration-400 ${open ? "opacity-50 z-10" : "opacity-0 -z-50"}`}
      />
      <div
        className={`bg-clay-900 text-clay-50 fixed w-[320px] p-4 sm:py-6 flex flex-col gap-4 inset-0 z-20 transition-transform duration-500 ${open ? "translate-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center pb-4 border-b border-clay-800">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-semibold"
          >
            <LogoIcon className="size-9 bg-clay-50 text-clay-900 p-1 rounded-xs" />{" "}
            <span className="font-serif text-3xl">Unearth</span>
          </Link>

          <button
            onClick={() => setOpen(false)}
            className="hover:cursor-pointer"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
