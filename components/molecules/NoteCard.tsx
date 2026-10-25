'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { Trash2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DailyNoteDTO } from '@/lib/types/notes';
import { PlayerAvatar } from '@/components/atoms/PlayerAvatar';
import { deleteNoteAction } from '@/app/actions/notes';

interface NoteCardProps {
  note: DailyNoteDTO;
  isAdmin?: boolean;
  className?: string;
}

export function NoteCard({ note, isAdmin = false, className }: NoteCardProps) {
  const [isPending, startTransition] = useTransition();

  const canDelete = note.isAuthor || isAdmin;

  const handleDelete = () => {
    if (!confirm('Vuoi davvero eliminare questo messaggio dalla bacheca?')) {
      return;
    }
    startTransition(async () => {
      await deleteNoteAction(note.id);
    });
  };

  return (
    <div
      className={cn(
        'glass-card group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-200 hover:border-cyan-500/30 hover:bg-white/[0.05] hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] sm:p-5',
        isPending && 'pointer-events-none opacity-50',
        className
      )}
    >
      <div>
        {/* Header con Autore e Data */}
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/profile/${note.author.id}`}
            className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-85"
          >
            <PlayerAvatar
              name={note.author.name}
              image={note.author.image}
              color={note.author.color}
              size="sm"
            />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-bold text-white transition-colors hover:text-cyan-400 sm:text-sm">
                {note.author.name}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="size-2.5" />
                <span>{note.createdAt}</span>
              </div>
            </div>
          </Link>

          {/* Tasto elimina per l'autore o l'admin */}
          {canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              title="Elimina messaggio"
              className="flex size-7 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-all hover:border-red-500/40 hover:bg-red-500/15 hover:text-red-400 active:scale-95"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>

        {/* Testo del messaggio */}
        <p className="mt-3.5 whitespace-pre-wrap break-words text-xs leading-relaxed text-zinc-200 sm:text-sm">
          {note.content}
        </p>
      </div>
    </div>
  );
}
