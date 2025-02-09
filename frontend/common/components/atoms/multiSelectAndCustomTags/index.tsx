import {
  useMemo,
} from "react";
import Select from "react-select/creatable"
import { ChevronDown } from "lucide-react";
import lang from '@/common/lang';
import {
  MultiValue,
  components,
} from "react-select";
import { CategoryType } from "@/app/new/types";
import { FilterOptionOption } from "react-select/dist/declarations/src/filters";
import { MultiSelectAndCustomTagsProps } from "./types"

const {
  createIdea: {
    categories: categoriesCopy,
  },
} = lang

const getErrorClasses = (error: boolean | undefined) => error ? '!shadow-red-300' : '';

export const MultiSelectAndCustomTags = (props : MultiSelectAndCustomTagsProps) => {
  const {
    placeholder = 'input placeholder',
    value,
    isLoading,
    error = false,
    disabled = false,
    options,
    errorMessage = '',
    labelText = '',
    id,
    onChange,
    ...rest
  } = props;
  const computedClasses = useMemo(() => {
    return getErrorClasses(error);
  }, [error]);

  const handleChange = (newValue: MultiValue<CategoryType>) => {
    onChange(newValue);
  };

  const caseInsensitiveFilterOption = (option: FilterOptionOption<CategoryType>, inputValue: string) => {
    return (
      option.data.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  return (
    <div>
      <div className={`flex`}>
        {labelText && (
          <label htmlFor={id} className={`block text-sm font-medium text-white`}>
            {labelText}
          </label>
        )}
      </div>
      <div className="mt-2 relative">
        <Select
          id={id}
          placeholder={placeholder}
          components={{
            IndicatorSeparator: () => <span></span>,
            DropdownIndicator: (state) => {
              if (disabled) {
                return <></>
              }
              return <span className={`text-violets-are-blue cursor-pointer ${state.selectProps.menuIsOpen ? "rotate-180" : ""}`}><ChevronDown/></span>
            },
            MultiValue: (props) => {
              return (
                <div className="bg-gradient-to-tl from-han-purple to-tulip rounded-lg text-xs px-2 py-1 font-medium">
                  <span className="text-white">
                    <components.MultiValueContainer {...props} />
                  </span>
                </div>
              )
            },
            ValueContainer: (props) => {
              return (
                <components.ValueContainer className="flex gap-1" {...props}>{props.children}</components.ValueContainer>
              )
            },
            ClearIndicator: () => null,
          }}
          isDisabled={disabled}
          options={options}
          theme={(theme) => ({
            ...theme,
            borderRadius: 6,
            colors: {
              ...theme.colors,
              primary25: '#f6f6f6',
              primary: '#f6f6f6',
            },
          })}
          isLoading={isLoading}
          value={value}
          noOptionsMessage={() => categoriesCopy.noTagsFound}
          onChange={handleChange}
          isMulti={true}
          filterOption={caseInsensitiveFilterOption}
          classNames={{
            container: () => "!text-sm",
            control: () => `!rounded-xl py-2 ${disabled ? "!bg-white/15 !shadow-white/50" : "!bg-white/5 shadow-white"} backdrop-blur-sm shadow-sm hover:shadow-violets-are-blue active:shadow-violets-are-blue !pr-3 !pl-1 !border-0 !ring-0 ${computedClasses}`,
            placeholder: () => '!text-gray-600',
            input: () => '!ring-0 !my-0 cursor-text !text-white',
            menu: () => '!rounded-xl overflow-hidden !bg-white/5 backdrop-blur-sm !shadow-sm !shadow-white',
            menuList: () => '!py-0',
            option: (state) => `${state.isFocused ? "!text-black" : "!text-neutral-400"} transition-all duration-200 ease-in-out active:!bg-[#f6f6f6] !cursor-pointer capitalize active:!text-black`,
          }}
          {...rest}
        />
      </div>
      {error && (
        <p className="mt-0.5 text-sm text-red-300">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
