"use client";

import { useState } from "react";
import Link from "next/link";
import LogoIcon from "../icons/logo";
import MenuIcon from "../icons/menu";
import { links } from "@/app/_lib/static/links";
import XIcon from "../icons/x";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header>
      <div className="m-4 pb-4 flex justify-between items-center border-b border-clay-200">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-serif text-3xl"
        >
          <LogoIcon className="size-9" /> <span>Unearth</span>
        </Link>

        <button
          className="hover:cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MenuIcon className="w-9" />
        </button>
      </div>

      <div
        className={`bg-clay-900 text-clay-50 fixed w-[320px] p-4 flex flex-col gap-4 inset-0 z-10 transition-transform duration-500 ${isOpen ? "translate-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center pb-4 border-b border-clay-800">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-semibold"
          >
            <LogoIcon className="size-9 bg-clay-50 text-clay-900 p-1 rounded-xs" />{" "}
            <span>Home</span>
          </Link>

          <button
            onClick={() => setIsOpen(false)}
            className="hover:cursor-pointer"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        <nav>
          <ul className="flex flex-col gap-4">
            {links.map((cat) => (
              <li key={cat.name}>
                <ul>
                  <li className="text-lg font-semibold pb-2">{cat.name}</li>

                  {cat.links.map((link) => (
                    <li key={link.label} className="flex">
                      <Link
                        href={link.href}
                        className="text-2xl w-full p-2 border-b border-clay-800 hover:bg-clay-800 transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
