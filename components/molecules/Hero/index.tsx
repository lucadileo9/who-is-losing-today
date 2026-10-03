import React from 'react';

import HeroProps from './index.types';

const Hero: React.FC<HeroProps> = () => {
  return (
    <section className="px-4 py-20 text-center">
      <div className="container mx-auto">
        <h1 className="mb-6 text-5xl font-bold">Template Frontend JEMORE</h1>
        <p className="mb-10 px-20 text-lg">
          JEMORE è l&apos;acronimo di Junior Enterprise dell&apos;Università di
          Modena e Reggio Emilia, una delle realtà più dinamiche nel panorama
          italiano delle Junior Enterprise. Offriamo servizi di consulenza
          strategica in ambito marketing e IT, supportando startup, PMI ed enti
          pubblici con soluzioni su misura per accelerare il loro business. Nati
          nel 2017, siamo un team di studenti universitari che mette in pratica
          le conoscenze accademiche per fornire servizi di alta qualità,
          contribuendo allo sviluppo del tessuto economico locale.
        </p>
        <a
          href="https://jemore.it/"
          className="inline-block rounded-full bg-[var(--blu)] px-8 py-4 text-lg font-semibold text-muted underline"
        >
          Scopri di più
        </a>
      </div>
    </section>
  );
};

export default Hero;
