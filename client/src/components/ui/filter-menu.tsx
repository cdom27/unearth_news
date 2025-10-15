import { useState, useEffect } from "react";
import Button from "./button";
import { FunnelSimpleIcon, XIcon } from "@phosphor-icons/react";

interface FilterMenuProps {
  setOpen: (action: boolean) => void;
  open: boolean;
  sourceOptions: string[];
  biasOptions: string[];
  selectedSources: string[];
  selectedBiases: string[];
  onApply: (sources: string[], biases: string[]) => void;
  onClear: () => void;
}

const FilterMenu = ({
  setOpen,
  open,
  sourceOptions,
  biasOptions,
  selectedSources,
  selectedBiases,
  onApply,
  onClear,
}: FilterMenuProps) => {
  const [stagedSources, setStagedSources] = useState<string[]>(selectedSources);
  const [stagedBiases, setStagedBiases] = useState<string[]>(selectedBiases);

  // reset staged fitlers on open
  useEffect(() => {
    if (open) {
      setStagedSources(selectedSources);
      setStagedBiases(selectedBiases);
    }
  }, [open, selectedSources, selectedBiases]);

  // disable document scrolling when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSourceChange = (source: string, checked: boolean) => {
    setStagedSources((prev) =>
      checked ? [...prev, source] : prev.filter((s) => s !== source)
    );
  };

  const handleBiasChange = (bias: string, checked: boolean) => {
    setStagedBiases((prev) =>
      checked ? [...prev, bias] : prev.filter((b) => b !== bias)
    );
  };

  const handleApply = () => {
    onApply(stagedSources, stagedBiases);
    setOpen(false);
  };

  const handleClear = () => {
    setStagedSources([]);
    setStagedBiases([]);
    onClear();
    setOpen(false);
  };

  return (
    <div>
      <Button
        className="flex gap-2 items-center"
        variant="outline"
        onClick={() => setOpen(!open)}
      >
        <FunnelSimpleIcon className="size-6 fill-fg-dark" />
        <span>Filters</span>
      </Button>

      <div
        className={`fixed inset-0 sm:w-full md:w-[450px] z-10 p-5 transition-transform duration-500 ease-in-out bg-bg-dark-secondary text-fg-light
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-screen">
          <div className="sticky top-0 flex justify-between pb-5 border-b-1 border-fg-dark-secondary">
            <h3 className="text-xl font-medium">Filter Stories</h3>
            <button onClick={() => setOpen(false)}>
              <XIcon className="size-6 fill-fg-light" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-3">
            <section className="py-2 border-b-1 border-fg-dark-secondary">
              <h2 className="text-xl text-fg-dark-secondary">Political Bias</h2>

              <ul className="grid grid-cols-2 pt-3 gap-1">
                {biasOptions.map((bias) => (
                  <li key={bias}>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={stagedBiases.includes(bias)}
                        onChange={(e) =>
                          handleBiasChange(bias, e.target.checked)
                        }
                      />
                      <span className="text-lg capitalize">
                        {bias.replace("-", " ")}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>

            <section className="py-2 border-b-1 border-fg-dark-secondary">
              <h2 className="text-xl text-fg-dark-secondary">
                Available Sources
              </h2>

              <ul className="grid grid-cols-1 sm:grid-cols-2 pt-3 gap-1">
                {sourceOptions.map((source) => (
                  <li key={source}>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={stagedSources.includes(source)}
                        onChange={(e) =>
                          handleSourceChange(source, e.target.checked)
                        }
                      />
                      <span className="text-lg capitalize">
                        {source.replace("-", " ")}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <div className="sticky bottom-0 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button variant="outline" onClick={handleClear} className="w-full">
              Clear All
            </Button>

            <Button
              variant="secondary"
              onClick={handleApply}
              className="w-full"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterMenu;
