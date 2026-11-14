'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { NeonCard } from '@/components/atoms/NeonCard';

interface LandingFeatureCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
}

export function LandingFeatureCard({
  icon: Icon,
  iconColor,
  title,
  description,
}: LandingFeatureCardProps) {
  return (
    <NeonCard
      variant="default"
      className="flex flex-col justify-between space-y-4 cursor-default transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]"
    >
      <div className="space-y-3.5">
        {/* Icona con Glow distintivo */}
        <div
          className="flex size-11 items-center justify-center rounded-xl border border-white/10"
          style={{
            backgroundColor: `${iconColor}15`,
            boxShadow: `0 0 15px ${iconColor}25`,
          }}
        >
          <Icon className="size-5" style={{ color: iconColor }} />
        </div>

        {/* Titolo e descrizione */}
        <div>
          <h3 className="text-base font-bold text-white sm:text-lg">{title}</h3>
          <p className="mt-2 text-xs leading-relaxed text-gray-400 sm:text-sm">
            {description}
          </p>
        </div>
      </div>
    </NeonCard>
  );
}
