'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeSelectorProps } from '@atoms/ThemeSelector/index.types';

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const { setTheme, systemTheme, theme } = useTheme();

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className={'border-none shadow-sm shadow-border/40'}
        >
          <Button
            variant="outline"
            size="icon"
            className={
              'border-b border-muted hover:scale-105 hover:bg-background/80 hover:text-foreground/80'
            }
          >
            {theme === 'jemore-theme-light' ||
            (theme === systemTheme && systemTheme === 'light') ? (
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
            ) : (
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={
            'rounded border-none bg-background text-foreground shadow-sm shadow-border/40'
          }
        >
          <DropdownMenuItem
            className={'bg-background text-foreground'}
            onClick={() => setTheme('jemore-theme-light')}
          >
            Light
          </DropdownMenuItem>
          <DropdownMenuItem
            className={'bg-background text-foreground'}
            onClick={() => setTheme('jemore-theme-dark')}
          >
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem
            className={'bg-background text-foreground'}
            onClick={() =>
              systemTheme === 'light'
                ? setTheme('jemore-theme-light')
                : setTheme('jemore-theme-dark')
            }
          >
            System = {systemTheme === 'dark' ? 'Dark' : 'Light'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
