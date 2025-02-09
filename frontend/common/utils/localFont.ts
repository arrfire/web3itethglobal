import localFont from "@next/font/local";

export const primaryFont = localFont({
  src: [
    {
      path: '../../public/fonts/Latinotype-Trenda-Thin.otf',
      weight: '200',
    },
    {
      path: '../../public/fonts/Latinotype-Trenda-Light.otf',
      weight: '300',
    },
    {
      path: '../../public/fonts/Latinotype-Trenda-Regular.otf',
      weight: '400',
    },
    {
      path: '../../public/fonts/Latinotype-Trenda-Semibold.otf',
      weight: '500',
    },
    {
      path: '../../public/fonts/Latinotype-Trenda-Bold.otf',
      weight: '600',
    },
    {
      path: '../../public/fonts/Latinotype-Trenda-Black.otf',
      weight: '700',
    },
    {
      path: '../../public/fonts/Latinotype-Trenda-Heavy.otf',
      weight: '800',
    },
  ],
  variable: '--font-primaryFont',
})


export const secondaryFont = localFont({
  src: [
    {
      path: '../../public/fonts/Chillax-Extralight.ttf',
      weight: '200',
    },
    {
      path: '../../public/fonts/Chillax-Light.ttf',
      weight: '300',
    },
    {
      path: '../../public/fonts/Chillax-Regular.ttf',
      weight: '400',
    },
    {
      path: '../../public/fonts/Chillax-Medium.ttf',
      weight: '500',
    },
    {
      path: '../../public/fonts/Chillax-Semibold.ttf',
      weight: '600',
    },
    {
      path: '../../public/fonts/Chillax-Bold.ttf',
      weight: '700',
    },
    {
      path: '../../public/fonts/Chillax-Variable.ttf',
      weight: '800',
    },
  ],
  variable: '--font-secondaryFont',
})