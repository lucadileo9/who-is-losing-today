import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';
import { FaEnvelope, FaInstagram, FaLinkedin } from 'react-icons/fa';

import FooterProps from './index.types';

const Footer: FC<FooterProps> = () => {
  const links1 = [
    { text: 'Home', href: '/' },
    { text: 'Contatti', href: 'https://jemore.it/contattaci/' },
    { text: 'Aree', href: 'https://jemore.it/chisiamo/' },
    { text: 'Candidati', href: 'https://jemore.it/unisciti-a-noi/' },
  ];

  const link2 = [
    { text: 'Privacy Policy', href: '#' },
    { text: 'Terms & Conditions', href: '#' },
    { text: 'Cookies', href: '#' },
    { text: 'FAQ', href: '#' },
  ];

  return (
    <>
      <footer className="jemore-theme-variant-1 px-8 sm:px-4 md:px-32 md:py-8">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-4">
            {/* Logo */}
            <div className="flex justify-center md:justify-start">
              <div className="flex flex-col items-center">
                <div className="relative h-20 w-20">
                  <Link href="/">
                    <Image
                      src="/images/bianco_verticale_scritta.png"
                      alt="Logo"
                      fill
                      style={{ objectFit: 'contain' }}
                      className="rounded-full"
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              {links1.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="block text-xs hover:text-primary-foreground"
                >
                  {link.text}
                </Link>
              ))}
            </div>
            <div className="space-y-1">
              {link2.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="block text-xs hover:text-primary-foreground"
                >
                  {link.text}
                </Link>
              ))}
            </div>

            {/* Right Logo */}
            <div className="flex justify-center md:justify-end">
              <div className="rounded p-2">
                <Link href="https://jeitaly.org/">
                  <Image
                    src="/images/JE_Italy_Logo_Bianco.png"
                    alt="Logo"
                    width={50}
                    height={50}
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="mt-8" />

          {/* Bottom Section */}
          <div className="mt-2 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-xs">©2024 Powered by Jemore</div>

            <div className="text-center text-xs">
              Contattaci, siamo sempre aperti a nuove proposte e collaborazioni.
            </div>

            <div className="flex space-x-4">
              <Link
                href="https://www.instagram.com/jemore_consulting/"
                className="rounded-full p-2 hover:bg-primary hover:text-primary-foreground"
              >
                {FaInstagram({})}
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://www.linkedin.com/company/jemore/posts/?feedView=all"
                className="rounded-full p-2 hover:bg-primary hover:text-primary-foreground"
              >
                {FaLinkedin({})}
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://jemore.it/contattaci/"
                className="rounded-full p-2 hover:bg-primary hover:text-muted-foreground"
              >
                {FaEnvelope({})}
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
