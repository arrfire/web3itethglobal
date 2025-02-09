import { CategoryType } from "@/app/new/types";
import { MultiValue } from "react-select";

export type SelectUsersProps = {
  id: string;
  labelText?: string;
  value?: Array<CategoryType> | null;
  options: Array<CategoryType>;
  placeholder?: string;
  onChange: (option:  MultiValue<CategoryType> | null) => void;
  onCreateOption? : (e: string) => void;
  disabled: boolean;
}
