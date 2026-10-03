import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';

import { cn } from '@/lib/utils';
import { websiteConfig } from '@/website.config';
import ButtonContattaci from '@atoms/ButtonContattaci';
import { ThemeSelector } from '@atoms/ThemeSelector';
import { Button } from '@components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@components/ui/sheet';
import { NavProps } from '@organisms/Header/index.types';

const MobileNav: FC<NavProps> = ({ routes }: NavProps) => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-background md:hidden"
        >
          <Menu className="h-8 w-8" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[65%] border-border/40">
        <SheetHeader className="border-b border-border/40 pb-4">
          <SheetTitle>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={websiteConfig.logo_img}
                alt="Logo"
                width={40}
                height={40}
                className="h-8 w-auto"
              />
              {websiteConfig.title}
            </Link>
          </SheetTitle>
        </SheetHeader>

        <SheetDescription className={'sr-only'}>
          Navigazione mobile e opzioni di contatto.
        </SheetDescription>

        <div className="my-6 px-1">
          <nav className="flex flex-col space-y-3">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-md px-3 py-2 text-base font-bold transition-colors hover:bg-primary/50 hover:text-primary-foreground',
                  route.active
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted'
                )}
              >
                {route.text}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto flex w-full flex-row gap-8 border-t border-border/40 pb-4 pl-4 pt-4">
          <ThemeSelector />
          <ButtonContattaci href={'https://jemore.it/contattaci/'} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default MobileNav;
