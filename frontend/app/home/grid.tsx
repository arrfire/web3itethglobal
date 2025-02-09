import { 
  useState, useMemo, useEffect, useCallback,
  useRef,
} from 'react';
import { Masonry } from 'masonic';
import { Token } from '@/common/components/molecules';
import { IdeaTypeWithDomains } from '@/common/types';
import { useWindowDimensions } from '@/common/hooks/useWindowDimensions';

const shuffleArray = <T, >(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface RenderComponentProps {
  data: IdeaTypeWithDomains[number];
  index: number;
  width: number;
}


export const Grid = ({
  ideas,
} : {
  ideas: IdeaTypeWithDomains,
}) => {
  const [shuffledIdeas, setShuffledIdeas] = useState(ideas);
  const [isShuffling, setIsShuffling] = useState(false);
  const {
    windowSize,
  } = useWindowDimensions()
  const cardPositions = useRef(new Map());

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

  const shuffle = useCallback(() => {
    if (isShuffling) {
      return;
    }
    
    setIsShuffling(true);

    const elements = document.querySelectorAll('[data-card-id]');
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      cardPositions.current.set(el.getAttribute('data-card-id'), {
        left: rect.left,
        top: rect.top,
      });
    });

    const newOrder = shuffleArray([...shuffledIdeas]);
    setShuffledIdeas(newOrder);

    requestAnimationFrame(() => {
      const cards = document.querySelectorAll('[data-card-id]');
      cards.forEach(card => {
        const id = card.getAttribute('data-card-id');
        const oldPosition = cardPositions.current.get(id);
        
        if (oldPosition) {
          const newPosition = card.getBoundingClientRect();
          const deltaX = oldPosition.left - newPosition.left;
          const deltaY = oldPosition.top - newPosition.top;

          // Apply initial position
          (card as HTMLElement).style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          (card as HTMLElement).style.transition = 'none';

          // Trigger animation to new position
          requestAnimationFrame(() => {
            (card as HTMLElement).style.transition = 'transform 1000ms cubic-bezier(0.4, 0, 0.2, 1)';
            (card as HTMLElement).style.transform = 'translate(0, 0)';
          });
        }
      });
    });

    // Reset shuffle state after animation
    setTimeout(() => {
      setIsShuffling(false);
      cardPositions.current.clear();
    }, 1000);
  }, [shuffledIdeas, isShuffling]);

  useEffect(() => {
    if (windowSize === 'mobile') {
      return
    }
    const intervalId = setInterval(shuffle, 15000);
    return () => clearInterval(intervalId);
  }, [shuffle, windowSize]);

  const renderAnimatedToken = useCallback((props: RenderComponentProps) => {
    const { data } = props;
    return (
      <div 
        data-card-id={data.subdomain}
        className="will-change-transform"
      >
        <Token {...props} />
      </div>
    );
  }, []);
  return (
    <div className="relative">
      <Masonry
        columnCount={columnCount}
        columnGutter={16}
        rowGutter={16}
        items={shuffledIdeas}
        render={renderAnimatedToken}
      />
    </div>
  )
}