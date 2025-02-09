import type { SVGProps } from "react";

export const LinkedInIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="currentColor"
    {...props}
  >
    <g fillRule="evenodd" clipPath="url(#a_linkedin)" clipRule="evenodd">
      <path
        fill="url(#b_linkedin)"
        d="M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16Z"
      />
      <path
        className="group-hover:fill-white fill-black"
        d="M11.671 23.372v-9.76H8.655v9.76h3.016Zm0-13.218c-.018-.874-.6-1.539-1.546-1.539-.945 0-1.563.665-1.563 1.539 0 .854.6 1.538 1.527 1.538h.018c.964 0 1.564-.684 1.564-1.538Zm4.921 13.218v-5.56c0-.298.021-.595.109-.808.24-.594.784-1.21 1.698-1.21 1.198 0 1.949.68 1.949 2.018v5.56h3.037v-5.709c0-3.058-1.633-4.482-3.81-4.482-1.786 0-2.57.999-3.005 1.678l.022-1.305H13.56c.044.934 0 9.818 0 9.818h3.032Z"
      />
    </g>
    <defs>
      <linearGradient
        id="b_linkedin"
        x1={16}
        x2={16}
        y1={0}
        y2={32}
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={1} />
      </linearGradient>
    </defs>
  </svg>
)
