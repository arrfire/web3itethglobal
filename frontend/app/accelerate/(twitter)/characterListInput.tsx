import { 
  Control, useFieldArray,
  UseFormRegister,
} from "react-hook-form";
import {
  MutableRefObject,
  useCallback,
  useEffect, useRef,
} from "react";
import autosize from 'autosize';
import { 
  CharacterFormType, 
  CharacterListType,
} from "../types";

export const CharacterListInput = ({
  control,
  register,
  name,
} : {
  control: Control<CharacterFormType, any>;
  register: UseFormRegister<CharacterFormType>;
  name: CharacterListType;
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null) as MutableRefObject<HTMLTextAreaElement | null>;

  const assignRef = useCallback(
    (element: HTMLTextAreaElement | null) => {
      if (textAreaRef) {
        textAreaRef.current = element;
      }
      
      if (element) {
        autosize(element);
      }
    },
    [],
  );
  useEffect(() => {
    if (textAreaRef?.current) {
      autosize.update(textAreaRef.current);
    }
  }, [control, control._formValues, name]);
  const {
    fields,
  } = useFieldArray({
    control,
    name,
  });
  return (
    <div className="w-full flex flex-col gap-2">
      {fields.map((field, index) => {
        const { 
          ref: registerRef, 
          ...registerRest
        } = register(`${name}.${index}.value`);
        
        return (
          <textarea
            ref={(element) => {
              registerRef(element);
              assignRef(element);
            }}
            rows={1}
            className={`w-full text-white disabled:bg-white/15 disabled:shadow-white/50 disabled:text-neutral-200 disabled:cursor-not-allowed placeholder:text-gray-600 bg-white/5 backdrop-blur-sm text-sm border-none focus:!outline-none shadow-sm shadow-white hover:shadow-violets-are-blue focus:shadow-violets-are-blue py-3 px-4 rounded-2xl resize-none`}
            key={field.id}
            id={field.id}
            {...registerRest}
            placeholder="...."
          />
        );
      })}
    </div>
  )
}