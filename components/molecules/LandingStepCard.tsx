'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { NeonCard } from '@/components/atoms/NeonCard';
import { BRAND_COLORS } from '@/lib/theme/colors';

interface LandingStepCardProps {
  stepNumber: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
}

export function LandingStepCard({
  stepNumber,
  title,
  description,
  icon: Icon,
  color = BRAND_COLORS.cyan,
}: LandingStepCardProps) {
  return (
    <NeonCard
      variant="default"
      className="relative flex flex-col justify-between transition-all duration-300"
    >
      <div className="space-y-4">
        {/* Numero Step e Icona */}
        <div className="flex items-center justify-between">
          <div
            className="flex size-10 items-center justify-center rounded-xl font-black text-sm text-black shadow-lg"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 15px ${color}50`,
            }}
          >
            {stepNumber}
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-gray-300">
            <Icon className="size-5" />
          </div>
        </div>

        {/* Titolo e Spiegazione */}
        <div>
          <h4 className="text-base font-bold text-white sm:text-lg">{title}</h4>
          <p className="mt-2 text-xs leading-relaxed text-gray-400 sm:text-sm">
            {description}
          </p>
        </div>
      </div>
    </NeonCard>
  );
}
