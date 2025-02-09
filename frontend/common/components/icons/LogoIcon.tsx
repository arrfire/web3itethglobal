import type { SVGProps } from "react";

export const LogoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={45}
    height={48}
    fill="none"
    {...props}
  >
    <path
      fill="url(#animation)"
      fillRule="evenodd"
      d="M32.723 2.61S37.442-1.162 44.568.361a.544.544 0 0 1 .32.209.561.561 0 0 1 .108.37 14.096 14.096 0 0 1-1.38 5.246c-2.154 4.406-6.005 6.262-7.235 6.795a8.8 8.8 0 0 1 2.315-.358 7.846 7.846 0 0 1-1.054 2.503c-.492.758-1.865 2.571-9.135 5.007-1.43.479-2.643.833-3.514 1.072a9.024 9.024 0 0 1 1.23-3.397s-5.27-.357-3.865-5.364l-3.69.18L28.155 2.61h4.568Zm-2.81 3.934a24.058 24.058 0 0 0-3.866 4.291A40.761 40.761 0 0 1 42.035 1.36c-1.984.119-3.938.54-5.798 1.251a20.564 20.564 0 0 0-6.325 3.934Zm-25.65 35.76c1.5 3.765 7.909 5.635 15.81 4.29-9.838 3.577-22.487.358-19.676-10.012 2.811-10.37 18.271-20.025 18.271-20.025l2.108 3.218a74.64 74.64 0 0 0-7.73 6.08c-6.465 5.814-7.73 8.99-8.081 10.012-.703 1.956-1.546 4.32-.703 6.437Z"
      clipRule="evenodd"
    />
    <linearGradient id="animation">
      <stop offset="0" stopColor="white">
        <animate
          dur="1s"
          attributeName="offset"
          fill="freeze"
          begin="0s"
          from="0"
          to="1"
        />
      </stop>
      <stop offset="0" stopColor="transparent">
        <animate
          dur="1s"
          attributeName="offset"
          fill="freeze"
          begin="0s"
          from="0"
          to="1"
        />
      </stop>
    </linearGradient>
  </svg>
)
