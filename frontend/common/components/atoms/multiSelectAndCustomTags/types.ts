import { CategoryType } from "@/app/new/types";
import { MultiValue } from "react-select";

export type MultiSelectAndCustomTagsProps = {
  id: string;
  labelText?: string;
  value?: Array<CategoryType> | null;
  isLoading: boolean;
  options: Array<CategoryType>;
  placeholder?: string;
  error?: boolean | undefined;
  errorMessage?: string;
 	onChange: (option:  MultiValue<CategoryType> | null) => void;
	onCreateOption? : (e: string) => void;
  disabled: boolean;
}
