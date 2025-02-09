import { useMemo } from 'react';
import { themeElements } from '@/common/theme/themeElements';
import {
  ButtonProps, TVariants, TSizes,
} from './types';
const getVariantClasses = (variant: keyof typeof TVariants) => themeElements.buttons[variant].style;
const getSizeClasses = (variant: keyof typeof TVariants, size: keyof typeof TSizes) => themeElements.buttons[variant].size[size];

export const Button = ({
  variant = 'primary',
  size = 'md',
  width = 'w-auto',
  type = 'button',
  disabled = false,
  icon: Icon,
  className,
  children,
  ...props
}: ButtonProps) => {

  const computedClasses = useMemo(() => {
    const variantClasses = getVariantClasses(variant);
    const sizeClasses = getSizeClasses(variant, size);
    const extraClasses = className || '';
    return [variantClasses, sizeClasses, extraClasses].join(' ');
  }, [variant, size, className]);

  return (
    <button
      className={`${width} ${computedClasses}`}
      type={type}
      disabled={disabled}
      {...props}
    >
      {!!Icon && <Icon />}
      {children}
    </button>
  );
};
