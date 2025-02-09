import React, { 
  forwardRef, useCallback, ChangeEvent,
} from 'react';
import { 
  Minus, Plus,
} from 'lucide-react';

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  width?: string;
  setValue: (value: number) => void;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  onChange?: (value: number) => void;
}

const baseInputClasses = `flex w-full rounded-full border-0 text-sm font-bold py-1.5 text-white shadow-sm shadow-white
placeholder:text-gray-600 outline-none leading-tight
px-4 disabled:cursor-not-allowed bg-white/5 backdrop-blur-sm disabled:bg-white/15 disabled:shadow-white/50 disabled:text-neutral-200`;

const buttonClasses = `flex items-center justify-center p-1 shadow-sm top-1/2 -translate-y-1/2 h-[calc(100%px)] aspect-square rounded-full bg-gradient-to-tr from-han-purple to-tulip
 text-white disabled:opacity-50 disabled:cursor-not-allowed`;

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(({
  min = 0,
  max = Infinity,
  step = 30,
  value,
  onChange,
  setValue,
  width = 'w-20',
  disabled = false,
  error = false,
  errorMessage,
  ...props
}, ref) => {

  const handleIncrement = useCallback((): void => {
    const newValue = Math.min(value + step, max);
    setValue(newValue);
    onChange?.(newValue);
  }, [value, step, max, onChange, setValue]);

  const handleDecrement = useCallback((): void => {
    const newValue = Math.max(value - step, min);
    setValue(newValue);
    onChange?.(newValue);
  }, [value, step, min, onChange, setValue]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(e.target.value) || min;
    const clampedValue = Math.max(min, Math.min(newValue, max));
    setValue(clampedValue);
    onChange?.(clampedValue);
  }, [min, max, onChange, setValue]);

  return (
    <div className='flex flex-col gap-1 items-end'>
      <div className={`${width} flex flex-col gap-2 relative`}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`${buttonClasses} absolute left-0.5 top-0 z-50`}
            onClick={handleDecrement}
            disabled={disabled || value <= min}
            aria-label="Decrease value"
          >
            <Minus size={16} strokeWidth={2} />
          </button>
            
          <input
            {...props}
            ref={ref}
            type="number"
            className={`${baseInputClasses} text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            aria-invalid={error}
            aria-describedby={error && errorMessage ? `${props.name}-error` : undefined}
          />
            
          <button
            type="button"
            className={`${buttonClasses} absolute right-0.5 top-0 z-50`}
            onClick={handleIncrement}
            disabled={disabled || value >= max}
            aria-label="Increase value"
          >
            <Plus size={16} strokeWidth={2} />
          </button>
        </div>
        
        {error && errorMessage && (
          <p 
            className="text-sm text-red-300" 
            id={`${props.name}-error`}
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </div>
      <div className='text-neutral-400 text-xs'>{value > 1 ? "hours" : "hour"}</div>
    </div>
  );
});

NumberInput.displayName = "NumberInput";

export default NumberInput;