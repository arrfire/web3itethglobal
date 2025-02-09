import Link from "next/link"
import { ReactNode } from "react";

export const LinkStyled = ({
  href,
  target = "",
  children,
  className,
} : {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
}) => {
  return (
    <Link target={target} href={href} onClick={(e) => e.stopPropagation()} className={`text-gray-300 hover:text-white md:text-lg font-medium px-4 ${className}`}>{children}</Link>
  )
}
