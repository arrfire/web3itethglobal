'use client';

import { ReactNode } from "react";
import {
  Carousel as Slider,
  CarouselContent,
  CarouselItem,
} from "./CarouselContainer"

const Carousel = ({
  items,
}: {
  items: ReactNode[];
}) => {
  return (
    <Slider className="w-full" opts={{
      loop: true,
      align: 'center',
      dragFree: true,
    }}>
      <CarouselContent>
        {
          items.map((item, index) => (
            <CarouselItem key={index}>
              {item}
            </CarouselItem>
          ))
        }
      </CarouselContent>
    </Slider>
  );
};

export default Carousel;
