import { NextFontWithVariable } from 'next/dist/compiled/@next/font';
import {
  Lato,
  Merriweather,
  Nunito,
  Open_Sans,
  Poppins,
  Raleway,
} from 'next/font/google';

// This file defines the fonts used in the application, allowing for easy import and use across components. -> scalable
// To add a new font, import it from 'next/font/google' create a new constant with the desired configuration, and ADD it to the `fonts` object.
// do not forget to modify tailwind.config.js to include the new font variable in the `fontFamily` section.

const merriweather: NextFontWithVariable = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-merriweather',
  display: 'swap',
});

const opensans: NextFontWithVariable = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-opensans',
  display: 'swap',
});

const poppins: NextFontWithVariable = Poppins({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

const lato: NextFontWithVariable = Lato({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato',
});

const raleway: NextFontWithVariable = Raleway({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
});

const nunito: NextFontWithVariable = Nunito({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});

export const fonts = {
  merriweather,
  opensans,
  poppins,
  lato,
  raleway,
  nunito,
};
