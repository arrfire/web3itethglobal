import type { SVGProps } from "react";

export const TwitterIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="currentColor"
    {...props}
  >
    <path d="M32 16C32 7.16938 24.8306 0 16 0C7.16938 0 0 7.16938 0 16C0 24.8306 7.16938 32 16 32C24.8306 32 32 24.8306 32 16Z" fill="url(#paint0_linear_619_377)"/>
    <path className="group-hover:fill-white fill-black" d="M21.153 8H23.7139L18.119 14.3946L24.7009 23.0961H19.5473L15.5109 17.8187L10.8923 23.0961H8.32979L14.314 16.2564L8 8H13.2844L16.933 12.8238L21.153 8ZM20.2542 21.5633H21.6732L12.5133 9.45232H10.9906L20.2542 21.5633Z" />
    <defs>
      <linearGradient id="paint0_linear_619_377" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
        <stop />
        <stop offset="1" />
      </linearGradient>
    </defs>
  </svg>
)
