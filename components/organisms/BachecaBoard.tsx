'use client';

import React, { useState, useTransition } from 'react';
import { Send, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DailyNoteDTO } from '@/lib/types/notes';
import { createNoteAction } from '@/app/actions/notes';
import { NoteCard } from '@/components/molecules/NoteCard';
import { NeonButton } from '@/components/atoms/NeonButton';

interface BachecaBoardProps {
  notes: DailyNoteDTO[];
  currentUserId?: string;
  isAdmin?: boolean;
  className?: string;
}

const MAX_CHARS = 500;

export function BachecaBoard({
  notes,
  currentUserId,
  isAdmin = false,
  className,
}: BachecaBoardProps) {
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    if (trimmed.length > MAX_CHARS) {
      setErrorMsg(`Il messaggio non può superare i ${MAX_CHARS} caratteri.`);
      return;
    }

    setErrorMsg(null);
    startTransition(async () => {
      const res = await createNoteAction(trimmed);
      if (res.success) {
        setContent('');
      } else {
        setErrorMsg(res.error || 'Impossibile pubblicare il messaggio.');
      }
    });
  };

  const remainingChars = MAX_CHARS - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <div className={cn('space-y-8', className)}>
      {/* Box di Inserimento Nuovo Messaggio */}
      <div className="glass-card relative overflow-hidden rounded-3xl border border-white/10 p-5 sm:p-6 shadow-[0_0_25px_rgba(6,182,212,0.1)]">
        <form onSubmit={handleCreateNote} className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="note-input"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400"
            >
              <Sparkles className="size-3.5" />
              <span>Scrivi sulla Bacheca</span>
            </label>

            <span
              className={cn(
                'text-[11px] font-semibold transition-colors',
                isOverLimit
                  ? 'text-red-400 font-bold'
                  : remainingChars <= 50
                    ? 'text-amber-400'
                    : 'text-muted-foreground'
              )}
            >
              {remainingChars} car. rimasti
            </span>
          </div>

          <textarea
            id="note-input"
            rows={3}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setErrorMsg(null);
            }}
            placeholder="Lascia un commento, prendi in giro il perdente di oggi o incita il gruppo per le prossime sfide..."
            className="glass-card w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-xs sm:text-sm text-white placeholder:text-muted-foreground outline-none transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />

          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/15 p-3 text-xs font-semibold text-red-300">
              <AlertCircle className="size-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-end">
            <NeonButton
              type="submit"
              variant="primary"
              size="md"
              disabled={!content.trim() || isOverLimit || isPending}
              className="gap-2 text-xs sm:text-sm font-bold"
            >
              <Send className="size-3.5" />
              <span>{isPending ? 'Pubblicazione...' : 'Pubblica Messaggio'}</span>
            </NeonButton>
          </div>
        </form>
      </div>

      {/* Feed dei Messaggi Pubblicati */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Messaggi Recenti ({notes.length})
          </h2>
          <span className="text-xs text-muted-foreground">
            Ultimi 7 giorni
          </span>
        </div>

        {notes.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center rounded-3xl border border-white/5 p-10 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-muted-foreground">
              <MessageSquare className="size-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              Bacheca ancora vuota
            </h3>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Nessuno ha ancora lasciato un messaggio negli ultimi 7 giorni. Sii
              il primo a scrivere qualcosa o a sfottere il perdente del giorno!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
