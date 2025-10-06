import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <path d="M21.5 12c0-5.25-4.25-9.5-9.5-9.5S2.5 6.75 2.5 12s4.25 9.5 9.5 9.5" />
        <path d="M16 16c-1.5-1.5-3-2-4-2s-2.5.5-4 2" />
        <path d="M15 7c-1.5-1-3-1.5-4-1.5S8.5 6 7 7" />
        <path d="M9 12c0-2 1-3.5 3-3.5s3 1.5 3 3.5c0 .71-.18 1.37-.5 2" />
    </svg>
  );
}
