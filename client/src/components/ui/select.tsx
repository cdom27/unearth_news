import { CaretDownIcon } from "@phosphor-icons/react";

interface SelectProps {
  name: string;
  options: { value: string; label: string }[];
  handleChange: (value: string) => void;
  value: string;
}

const Select = ({ name, options, handleChange, value }: SelectProps) => {
  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        id={name}
        className="appearance-none font-semibold rounded-full pl-3.5 pr-10 py-2 cursor-pointer focus:outline-none border-1 border-fg-dark-tertiary bg-transparent hover:border-fg-dark-secondary active:border-fg-dark-secondary"
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value} className="">
            {label}
          </option>
        ))}
      </select>

      <CaretDownIcon className="size-6 fill-fg-dark pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
    </div>
  );
};

export default Select;
