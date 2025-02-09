import {
  SVGProps, ReactElement,
  ReactNode,
} from "react";
import { InputProps } from "@/common/components/atoms/input/types";

type IconComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;

export type MoleculeInputProps = InputProps & {
  /** The label text of the input */
  labelText?: string;
  /** The width of the input */
  width?: string;
  /** The optional text of the input */
  optionalText?: string | ReactNode;
  /** The error text of the input */
  errorMessage?: string;
  /** The data-cy value of the input */
  'data-cy'?: string;
  /** The icon of the input */
  icon?: IconComponent;
  /** The ref for DefaultInput */
  inputRef?: React.Ref<HTMLInputElement>;
};
