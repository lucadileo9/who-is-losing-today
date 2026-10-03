import Link from 'next/link';
import React, { FC } from 'react';

import ButtonContattaciProps from './index.types';

const ButtonContattaci: FC<ButtonContattaciProps> = ({ href }) => {
  return (
    <>
      <Link
        href={href}
        className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-300 hover:scale-105 hover:text-popover"
      >
        Contattaci
      </Link>
    </>
  );
};

export default ButtonContattaci;
