import { Metadata } from 'next';

import Hero from '@molecules/Hero';

export const metadata: Metadata = {
  title: 'JEMORE ti vuole bene',
  description: 'anche se non ti paga',
};

export default function Home() {
  return <Hero></Hero>;
}
