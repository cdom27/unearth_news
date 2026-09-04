import type { IconProps } from "@/app/_lib/types/icon-props";

export default function MenuIcon({ className = "size-8" }: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 32 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="31.3903" height="1.55556" fill="currentColor" />
      <rect y="6.22217" width="31.3903" height="1.55556" fill="currentColor" />
      <rect y="12.4443" width="31.3903" height="1.55556" fill="currentColor" />
    </svg>
  );
}
