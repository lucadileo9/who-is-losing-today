import Link from 'next/link';
import { FC } from 'react';

import { cn } from '@/lib/utils';
import ButtonContattaci from '@atoms/ButtonContattaci';
import { ThemeSelector } from '@atoms/ThemeSelector';
import { NavProps, Route } from '@organisms/Header/index.types';

const DesktopNav: FC<NavProps> = ({ routes }: NavProps) => {
  return (
    <nav className="container mx-auto flex items-center justify-center space-x-16">
      <div className="flex items-center space-x-8">
        {routes.map((route: Route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'transition-colors hover:text-secondary',
              route.active ? 'text-accent' : 'text-muted'
            )}
          >
            {route.text}
          </Link>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <ThemeSelector />
        <ButtonContattaci href="https://jemore.it/contattaci/" />
      </div>
    </nav>
  );
};
export default DesktopNav;
