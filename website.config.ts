import { NextFontWithVariable } from 'next/dist/compiled/@next/font';

import { fonts } from '@/lib/fonts';

const font_variables = Object.values(fonts).map(
  (font: NextFontWithVariable) => {
    return font.variable;
  }
);

export const websiteConfig = {
  logo_img: '/images/logo_jemore.png',
  menuItems: [
    { text: 'Chi Siamo', href: 'https://jemore.it/chisiamo/' },
    { text: 'Servizi', href: 'https://jemore.it/servizi-offerti/' },
    { text: 'Unisciti a Noi', href: 'https://jemore.it/unisciti-a-noi/' },
  ],
  title: 'JEMORE - frontend template',
  description:
    'template di base per siti web JEMORE, con configurazione di base, header, footer e navigazione.',
  font_variables: font_variables,
  color_themes: ['system', 'jemore-theme-light', 'jemore-theme-dark'],
};
