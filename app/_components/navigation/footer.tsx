"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoIcon from "../icons/logo";
import { links } from "@/app/_lib/static/links";

export default function Footer() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <footer>
      <div className="m-4 sm:my-6 md:mb-0 md:mt-10 xl:mt-16 2xl:mt-22 sm:mx-12 pt-4 pb-18 sm:py-6 md:py-10 xl:py-16 2xl:py-22 lg:mx-18 xl:mx-24 2xl:mx-auto 2xl:max-w-325 flex flex-col gap-6 items-center border-t border-clay-200">
        <Link
          href="/"
          className="flex flex-col items-center gap-2.5 font-serif text-7xl"
        >
          <span className="text-center">Unearth News</span>
          <LogoIcon className="size-9" />
        </Link>

        <p className="text-lg">Restoring trust in journalism</p>

        <nav>
          <ul className="grid grid-cols-2 gap-12">
            {links.map((category) => (
              <li key={category.name}>
                <ul className="gap-1">
                  <li className="text-xl font-semibold pb-2">
                    {category.name}
                  </li>

                  {category.links.map((link) => {
                    const isActive = pathname === link.href;
                    const isHovered = hoveredLink === link.href;

                    return (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          onMouseEnter={() => setHoveredLink(link.href)}
                          onMouseLeave={() => setHoveredLink(null)}
                          className={`text-lg decoration-clay-50 underline-offset-4 transition-colors duration-300 ${
                            isHovered
                              ? "underline decoration-clay-400"
                              : isActive && hoveredLink === null
                                ? "underline decoration-clay-900"
                                : "decoration-50"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
