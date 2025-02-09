import { Masonry } from 'masonic';
import { Token } from '@/common/components/molecules';
import { IdeaTypeWithDomains } from '@/common/types';
import { useWindowDimensions } from '@/common/hooks/useWindowDimensions';
import { useMemo } from 'react';

export const Grid = ({
  ideas,
} : {
  ideas: IdeaTypeWithDomains,
}) => {
  const {
    windowSize,
  } = useWindowDimensions()
  const columnCount = useMemo(() => {
    if (windowSize === 'desktop') {
      return 4
    }
    if (windowSize === 'desktopHighRes') {
      return 3
    }
    if (windowSize === 'desktopLowRes') {
      return 2
    }
    if (windowSize === 'tablet') {
      return 2
    }
    return 1
  }, [windowSize])
  return (
    <Masonry
      columnCount={columnCount}
      columnGutter={16}
      rowGutter={16}
      items={ideas}
      render={Token}
    />
  )
}