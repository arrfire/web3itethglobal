import {
  useEffect, RefObject,
} from 'react';

type OutsideClickProps = {
  isVisible: boolean;
  ref: RefObject<HTMLElement>;
  callback: () => void;
}

export const useOutsideClick = ({
  isVisible, ref, callback,
}: OutsideClickProps) => {
  const handleClick = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as Element)) {
      callback();
    }
  };

  useEffect(() => {
    if (isVisible) { document.addEventListener('mousedown', handleClick); }

    return () => document.removeEventListener('mousedown', handleClick);
  });
};
