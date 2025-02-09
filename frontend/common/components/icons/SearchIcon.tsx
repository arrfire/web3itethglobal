import type { SVGProps } from "react";

export const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a_search)">
      <path
        fill="url(#b_search)"
        d="M23.356 23.356a2.153 2.153 0 0 1-3.076 0L16.625 19.7a12.127 12.127 0 0 0 3.077-3.076l3.654 3.654a2.156 2.156 0 0 1 0 3.077Z"
      />
      <path
        className="group-hover:fill-white fill-black"
        fillRule="evenodd"
        d="M6.733 6.732a4.364 4.364 0 0 1 3.085-1.278 1.091 1.091 0 0 0 0-2.182 6.552 6.552 0 0 0-6.545 6.546 1.091 1.091 0 0 0 2.182 0c0-1.157.46-2.267 1.278-3.086Z"
        clipRule="evenodd"
      />
      <path
        fill="url(#c_search)"
        d="M9.818 0a9.818 9.818 0 1 0 0 19.636A9.818 9.818 0 0 0 9.818 0Zm0 5.455a4.364 4.364 0 0 0-4.363 4.363 1.091 1.091 0 0 1-2.182 0 6.552 6.552 0 0 1 6.545-6.545 1.091 1.091 0 0 1 0 2.182Z"
      />
    </g>
    <defs>
      <linearGradient
        id="b_search"
        x1={12.001}
        x2={12.001}
        y1={0}
        y2={24.002}
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id="c_search"
        x1={12.001}
        x2={12.001}
        y1={0}
        y2={24.003}
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={1} />
      </linearGradient>
    </defs>
  </svg>
)
