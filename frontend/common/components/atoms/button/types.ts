import {
  ButtonHTMLAttributes, ReactNode, SVGProps, ReactElement,
} from "react";

export type ButtonType = 'button' | 'submit';
export type Variants = 'primary' | 'secondary';
export type Sizes = 'sm' | 'md' | 'lg';
export const TVariants = {
  primary: 'primary',
  secondary: 'secondary',
}
export const TSizes = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
}
export type IconComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;
export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  variant: Variants;
  size: Sizes;
  width?: string;
  type?: ButtonType;
  disabled?: boolean;
  icon?: IconComponent;
  children?: ReactNode;
  className?: string;
  "aria-label"?: string;
}
