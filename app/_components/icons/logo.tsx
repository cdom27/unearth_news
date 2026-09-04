import type { IconProps } from "@/app/_lib/types/icon-props";

export default function LogoIcon({ className = "size-8" }: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 51 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25.4999 0C11.4165 0 0 11.1081 0 24.8107C0 38.5133 11.4165 49.6215 25.4999 49.6215C39.5833 49.6215 51 38.5135 51 24.8107C51 11.108 39.5832 0 25.4999 0ZM25.4999 32.0721C18.3748 32.0721 12.365 28.8633 10.4919 24.4778C12.3651 20.0925 18.3749 16.8835 25.4999 16.8835C32.6249 16.8835 38.635 20.0924 40.5079 24.4778C38.6349 28.8631 32.6249 32.0721 25.4999 32.0721Z"
        fill="currentColor"
      />
      <path
        d="M25.5 29.5147C28.1701 29.5147 30.3346 27.4087 30.3346 24.8107C30.3346 22.2127 28.1701 20.1067 25.5 20.1067C22.8298 20.1067 20.6653 22.2127 20.6653 24.8107C20.6653 27.4087 22.8298 29.5147 25.5 29.5147Z"
        fill="currentColor"
      />
    </svg>
  );
}
