import type { SVGProps } from "react";

export const TelegramMainIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="currentColor"
    {...props}
  >
    <path
      fill="url(#a_tele)"
      d="M32 16c0-8.83-7.17-16-16-16S0 7.17 0 16s7.17 16 16 16 16-7.17 16-16Z"
    />
    <path
      className="group-hover:fill-[#C8DAEA] fill-white"
      d="m10.253 17.15 2.196 6.08s.275.568.569.568c.294 0 4.666-4.55 4.666-4.55l4.863-9.392-12.216 5.726-.078 1.569Z"
    />
    <path
      className="group-hover:fill-[#A9C6D8] fill-white"
      d="m13.165 18.71-.422 4.48s-.176 1.373 1.196 0c1.373-1.373 2.686-2.431 2.686-2.431"
    />
    <path
      className="group-hover:fill-white fill-zinc-800"
      d="m10.293 17.368-4.517-1.472s-.54-.22-.367-.716c.036-.102.108-.19.324-.34 1.001-.697 18.527-6.996 18.527-6.996s.495-.167.787-.056a.427.427 0 0 1 .29.317c.032.13.045.265.04.399-.002.116-.016.223-.027.392-.106 1.722-3.3 14.575-3.3 14.575s-.192.753-.876.778a1.252 1.252 0 0 1-.914-.353c-1.344-1.156-5.988-4.277-7.014-4.963a.195.195 0 0 1-.085-.14c-.014-.072.065-.161.065-.161s8.086-7.188 8.302-7.943c.016-.058-.047-.087-.131-.062-.537.198-9.848 6.078-10.876 6.727a.494.494 0 0 1-.228.014Z"
    />
    <defs>
      <linearGradient
        id="a_tele"
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
