import {
  useState, useEffect,
} from 'react';
import {
  UseWindowDimensionsReturn, WindowDimensions, WindowSize,
} from '@/common/hooks/types';
import {
  lowResDeskLimit,
  mobileWidthLimit,
  tabletWidthLimit,
  highResDeskLimit,
} from '../constants';

function getWindowDimensions () {
  if (typeof window === "undefined") {
    return {
      width: 0,
      height: 0,
    }
  }
  const {
    innerWidth: width, innerHeight: height,
  } = window;
  return {
    width,
    height,
  };
}
function getWindowSize (dimensions: WindowDimensions) {
  if (dimensions.width <= mobileWidthLimit) {
    return 'mobile';
  }
  if (dimensions.width <= tabletWidthLimit) {
    return 'tablet';
  }
  if (dimensions.width <= lowResDeskLimit) {
    return 'desktopLowRes';
  }
  if (dimensions.width <= highResDeskLimit) {
    return 'desktopHighRes';
  }
  return 'desktop';
}

export const useWindowDimensions = (): UseWindowDimensionsReturn => {
  const initialDimensions = getWindowDimensions();
  const [windowDimensions, setWindowDimensions] = useState(initialDimensions);
  const [windowSize, setWindowSize] = useState<WindowSize>(getWindowSize(initialDimensions));
  const [isDesktopView, setIsDesktopView] = useState(windowSize === 'desktop');

  useEffect(() => {
    function handleResize () {
      window.requestAnimationFrame(() => {
        const dimensions = getWindowDimensions();
        setWindowDimensions(dimensions);
        const windowSizeUpdated = getWindowSize(dimensions);
        setWindowSize(windowSizeUpdated);
        setIsDesktopView(windowSizeUpdated === 'desktop');
      });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    windowDimensions,
    windowSize,
    isDesktopView,
  };
};
