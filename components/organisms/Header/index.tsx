'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { FC } from 'react';

import { useMobile } from '@/lib/hooks/useMobile';
import { websiteConfig } from '@/website.config';
import DesktopNav from '@molecules/DesktopNav';
import MobileNav from '@molecules/MobileNav';

import HeaderProps, { Route } from './index.types';

const Header: FC<HeaderProps> = () => {
  const pathname: string = usePathname();
  const isMobile: boolean = useMobile();

  const routes: Route[] = websiteConfig.menuItems.map((item) => ({
    href: item.href,
    text: item.text,
    active: pathname === item.href,
  }));

  return (
    <>
      <header className="sticky top-0 z-50 shadow-sm shadow-border/40">
        <div className="container mx-auto flex h-16 max-w-4xl items-center justify-between px-4 py-6">
          <Link href="/public" className="flex items-center space-x-2">
            <Image
              src={websiteConfig.logo_img}
              alt="Logo"
              width={60}
              height={60}
              className="item-start cursor-pointer justify-center"
            />
          </Link>
          {isMobile ? (
            <MobileNav routes={routes} />
          ) : (
            <DesktopNav routes={routes} />
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
