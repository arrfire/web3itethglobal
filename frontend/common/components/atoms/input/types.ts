import React, {
  InputHTMLAttributes, SVGProps, ReactElement,
} from 'react';

export type IconComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  /** The id of the input. */
  id: string;
  /** The name of the checkbox */
  name: string;
  /** The value of the input */
  value: string | undefined;
  /** Whether the checkbox is disabled or not */
  disabled?: boolean;
  /** The type of the input */
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'file';
  /** The placeholder for the input */
  placeholder?: string;
  /** The error state of the input */
  error?: boolean | undefined;
  /** The onChange handler of the input */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** The onFocus handler of the input */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** The data-cy attribute of the input */
  'data-cy'?: string;
  /** Whether the input is readonly or not */
  readonly?: boolean;
  /** The icon of the input */
  icon?: IconComponent;
  /** The extra classes of the input */
  extraClasses?: string;
}
