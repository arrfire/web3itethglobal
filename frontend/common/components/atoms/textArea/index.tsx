import {
  useEffect, useMemo, useRef,
} from "react";
import autosize from 'autosize';
import { TextAreaProps } from "./types"

const getErrorClasses = (error: boolean | undefined) => error ? '!shadow-red-300 pr-10' : '';

export const TextArea = (props : TextAreaProps) => {
  const {
    name = 'input-name',
    id = 'input-id',
    placeholder = 'input placeholder',
    value = '',
    disabled = false,
    error = false,
    errorMessage = '',
    labelText = '',
    width = 'w-60',
    onChange = () => null,
    ...rest
  } = props;
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textAreaRef?.current) {
      autosize(textAreaRef.current);
    }
  }, [])
  useEffect(() => {
    if (textAreaRef?.current) {
      autosize.update(textAreaRef.current)
    }
  }, [value])
  const computedClasses = useMemo(() => {
    return getErrorClasses(error);
  }, [error]);
  return (
    <div className={width}>
      <div className={`flex`}>
        {labelText && (
          <label htmlFor={id} className={`block text-sm font-medium text-white`}>
            {labelText}
          </label>
        )}
      </div>
      <div className="mt-2 relative">
        <textarea
          ref={textAreaRef}
          name={name}
          id={id}
          disabled={disabled}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...rest}
          className={`w-full text-white disabled:bg-white/15 disabled:shadow-white/50 disabled:text-neutral-200 disabled:cursor-not-allowed placeholder:text-gray-600 bg-white/5 backdrop-blur-sm text-sm border-none focus:!outline-none shadow-sm shadow-white hover:shadow-violets-are-blue focus:shadow-violets-are-blue py-3 px-4 rounded-2xl resize-none ${computedClasses}`}
        />
      </div>
      {error && (
        <p className="mt-0.5 text-sm text-red-300" data-cy={`${name}-error`}>
          {errorMessage}
        </p>
      )}
    </div>
  )
}
