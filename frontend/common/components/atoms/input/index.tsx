import {
  forwardRef, useMemo,
} from 'react';
import { InputProps } from './types';

const baseInputClasses = `flex w-full rounded-xl border-0 text-sm py-3 text-white shadow-sm shadow-white
placeholder:text-gray-600 outline-none hover:shadow-violets-are-blue focus:shadow-violets-are-blue leading-tight
px-4 disabled:cursor-not-allowed bg-white/5 backdrop-blur-sm disabled:bg-white/15 disabled:shadow-white/50 disabled:text-neutral-200`;
const getErrorClasses = (error: boolean | undefined) => error ? '!shadow-red-300 pr-10' : '';

export const Input = forwardRef<HTMLInputElement | null, InputProps>((props, ref) => {
  const {
    type = 'text',
    name = 'input-name',
    id = 'input-id',
    placeholder = 'input placeholder',
    value = '',
    disabled = false,
    error = false,
    onChange = () => null,
    ...rest
  } = props;
  const computedClasses = useMemo(() => {
    return getErrorClasses(error);
  }, [error]);

  return (
    <input
      type={type}
      ref={ref}
      name={name}
      id={id}
      value={value}
      className={`${baseInputClasses} ${computedClasses}`}
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChange}
      {...rest}
    />
  )
});
Input.displayName = "Input";
