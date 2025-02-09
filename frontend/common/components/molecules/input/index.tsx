import {
  ReactNode,
  useMemo,
} from 'react';
import { Input as DefaultInput } from '../../atoms'
import { MoleculeInputProps } from "@/common/components/molecules/input/types";
import { ExclamationErrorIcon } from "@/common/components/icons";

const getOptionalTextPlacingClass = (optionalText: string | ReactNode | undefined, labelText: string | undefined) => {
  return optionalText && !labelText ? 'justify-end' : 'justify-between';
}

export const Input = ({
  id = 'input-id',
  name = 'input-name',
  width = 'w-60',
  optionalText = '',
  labelText = '',
  error = false,
  errorMessage = '',
  inputRef,
  ...rest
}: MoleculeInputProps) => {
  const optionalTextPlacingClass = useMemo(() => {
    return getOptionalTextPlacingClass(optionalText, labelText)
  }, [optionalText, labelText]);
  const input = useMemo(() => {
    const inputProps = {
      id,
      name,
      error,
      ...rest,
    }
    return (
      <>
        <DefaultInput {...inputProps} ref={inputRef} />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-red-300">
          {error && <ExclamationErrorIcon />}
        </div>
      </>
    )
  }, [error, id, name, rest, inputRef]);

  if (!labelText && !optionalText) {
    return (
      <div className={width}>
        <div className="relative">
          {input}
        </div>
        {error && (
          <p className="mt-0.5 text-sm text-red-300" data-cy={`${name}-error`}>
            {errorMessage}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={width}>
      <div className={`flex ${optionalTextPlacingClass} items-center`}>
        {labelText && (
          <label htmlFor={id} className={`block text-sm font-medium text-white`}>
            {labelText}
          </label>
        )}
        {optionalText && (
          optionalText
        )}
      </div>
      <div className="mt-2 relative">
        {input}
      </div>
      {error && (
        <p className="mt-0.5 text-sm text-red-300" data-cy={`${name}-error`}>
          {errorMessage}
        </p>
      )}
    </div>
  )
}
