const coreClasses =
  "font-semibold cursor-pointer rounded-full px-5 py-2 border-1";

const variantClasses: Record<string, string> = {
  primary: "",
  secondary:
    "bg-bg-light border-bg-light hover:bg-bg-dark-secondary text-fg-dark hover:text-fg-light",
  outline:
    "border-fg-dark-tertiary hover:border-fg-dark-secondary active:border-fg-dark-secondary",
  brand:
    "bg-brand-primary border-1 border-brand-primary hover:bg-yellow-500 active:bg-yellow-500",
};

export { coreClasses, variantClasses };
