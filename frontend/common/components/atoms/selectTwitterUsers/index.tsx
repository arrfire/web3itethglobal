import Select from "react-select/creatable";
import { 
  ChevronDown, X,
} from "lucide-react";
import { 
  MultiValue, components,
} from "react-select";
import { CategoryType } from "@/app/new/types";
import { SelectUsersProps } from "./types";

export const SelectTwitterUsers = (props: SelectUsersProps) => {
  const {
    placeholder = "input placeholder",
    value,
    disabled = false,
    options,
    labelText = "",
    id,
    onChange,
    ...rest
  } = props;

  const handleChange = (newValue: MultiValue<CategoryType>) => {
    onChange(newValue);
  };

  return (
    <div>
      <div className={`flex`}>
        {labelText && (
          <label
            htmlFor={id}
            className={`block text-sm font-medium text-white`}
          >
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
                return <></>;
              }
              return (
                <span
                  className={`text-violets-are-blue cursor-pointer ${
                    state.selectProps.menuIsOpen ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown />
                </span>
              );
            },
            MultiValue: (props) => {
              return (
                <div className="bg-gradient-to-tl from-han-purple to-tulip rounded-lg text-xs px-2 py-1 font-medium flex items-center gap-1">
                  <span className="text-white">
                    <components.MultiValueContainer {...props} />
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const currentValues = value as CategoryType[];
                      const newValues = currentValues.filter(
                        item => item.value !== props.data.value,
                      );
                      handleChange(newValues);
                    }}
                    className="text-white/80 hover:text-white transition-colors duration-200 ml-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            },
            ValueContainer: (props) => {
              return (
                <components.ValueContainer className="flex gap-1" {...props}>
                  {props.children}
                </components.ValueContainer>
              );
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
              primary25: "#f6f6f6",
              primary: "#f6f6f6",
            },
          })}
          value={value}
          noOptionsMessage={() => "Add accounts by typing"}
          onChange={handleChange}
          formatCreateLabel={(inputValue) => `Add @${inputValue.replace(/@/g, "")}`}
          isMulti={true}
          classNames={{
            container: () => "!text-sm",
            control: () =>
              `!rounded-xl py-2 ${
                disabled
                  ? "!bg-white/15 !shadow-white/50"
                  : "!bg-white/5 shadow-white"
              } backdrop-blur-sm shadow-sm hover:shadow-violets-are-blue active:shadow-violets-are-blue !pr-3 !pl-1 !border-0 !ring-0`,
            placeholder: () => "!text-gray-600",
            input: () => "!ring-0 !my-0 cursor-text !text-white",
            menu: () =>
              "!rounded-xl overflow-hidden !bg-white/5 backdrop-blur-sm !shadow-sm !shadow-white",
            menuList: () => "!py-0",
            option: (state) =>
              `${
                state.isFocused ? "!text-black" : "!text-neutral-400"
              } transition-all duration-200 ease-in-out active:!bg-white/5 !cursor-pointer active:!text-black`,
          }}
          {...rest}
        />
      </div>
    </div>
  );
};
