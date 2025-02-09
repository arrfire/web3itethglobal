import React, {
  InputHTMLAttributes,
} from 'react';
  
export type TextAreaProps = Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'id'> & {
    /** The id of the input. */
    id: string;
    /** The label text of the input */
    labelText?: string;
    /** The width of the input */
    width?: string;
    /** The name of the checkbox */
    name: string;
    /** The value of the input */
    value: string | undefined;
    /** Whether the checkbox is disabled or not */
    disabled?: boolean;
    /** The placeholder for the input */
    placeholder?: string;
    /** The error state of the input */
    error?: boolean | undefined;
    /** The error text of the input */
    errorMessage?: string;
    /** The onChange handler of the input */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /** The onFocus handler of the input */
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** The data-cy attribute of the input */
    'data-cy'?: string;
    /** Whether the input is readonly or not */
}
  