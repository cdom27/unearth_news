"use client";

import { useState } from "react";
import FiltersIcon from "../../icons/filters";
import Button from "../button/button";
import SideMenu from "../side-menu/side-menu";

export default function Filters() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full md:w-auto">
      <SideMenu setOpen={setIsOpen} open={isOpen}>
        <div className="flex flex-col gap-3">
          <label htmlFor="sorting" className="text-sm font-bold">
            Sort by
          </label>

          <select
            name="sorting"
            id="sorting"
            className="min-h-11 bg-clay-600 border-r-[1.25rem] border-clay-600 rounded-md hover:cursor-pointer py-2 px-6 transition-colors duration-250 "
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="factualScore">Factual Score</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto">
          filter options here in the future
        </div>

        <div className="sticky bottom-0 flex flex-col gap-3">
          <Button type="button" variant="secondary">
            <span>Clear Filters</span>
          </Button>

          <Button type="button" variant="brand">
            <span>Apply Changes</span>
          </Button>
        </div>
      </SideMenu>

      <Button
        type="button"
        variant="secondary"
        className="flex items-center gap-2 w-full justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiltersIcon /> <span>Filters</span>
      </Button>
    </div>
  );
}
