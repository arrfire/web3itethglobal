import type { SVGProps } from "react";
export const UploadIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      stroke="url(#a_upload)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"
    />
    <path
      stroke="url(#b_upload)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 13v8"
    />
    <path
      stroke="url(#c_upload)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m8 17 4-4 4 4"
    />
    <defs>
      <linearGradient
        id="a_upload"
        x1={12.002}
        x2={12.002}
        y1={3.003}
        y2={16.242}
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id="b_upload"
        x1={12.5}
        x2={12.5}
        y1={13}
        y2={21}
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id="c_upload"
        x1={12}
        x2={12}
        y1={13}
        y2={17}
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={1} />
      </linearGradient>
    </defs>
  </svg>
)
    