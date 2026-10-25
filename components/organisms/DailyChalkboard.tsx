'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button, Avatar } from '@/components/atoms';
import { apiFetch } from '@/lib/utils';
import { MessageSquare, Send, Sparkles, Trash2, LogIn } from 'lucide-react';

export interface ChalkboardNote {
  id: string;
  content: string;
  dateLabel: string;
  time: string;
  author: {
    name: string;
    initials: string;
    color: string;
    image?: string | null;
  };
}

export function DailyChalkboard() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<ChalkboardNote[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await apiFetch('/api/notes');
      if (res.ok) {
        const json = await res.json();
        setNotes(json.notes || []);
      }
    } catch (err) {
      console.error('Errore recupero messaggi bacheca:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSubmitting || !session) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await apiFetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: inputText }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Impossibile inviare il messaggio.');
      } else {
        setInputText('');
        setNotes((prev) => [json.note, ...prev]);
      }
    } catch (err) {
      console.error('Errore invio messaggio bacheca:', err);
      setError('Errore di connessione.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-xs border-amber-500/20 bg-gradient-to-br from-card via-card to-amber-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-amber-500" />
            <CardTitle>Bacheca del Gruppo</CardTitle>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-500">
            <Trash2 className="size-3" /> Auto-pulizia 7 gg
          </span>
        </div>
        <CardDescription>
          Lavagna riservata ai giocatori per sfottò e commenti della settimana.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Form Invio Messaggio (Disponibile SOLO se AUTENTICATO) */}
        {session ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                maxLength={280}
                placeholder="Scrivi qualcosa sulla lavagna..."
                className="flex-1 rounded-xl border bg-background/80 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <Button
                type="submit"
                disabled={!inputText.trim() || isSubmitting}
                className="cursor-pointer bg-amber-500 text-white hover:bg-amber-600"
              >
                <Send className="mr-1.5 size-4" />
                Invia
              </Button>
            </div>
            {error && (
              <p className="text-xs font-medium text-destructive">{error}</p>
            )}
          </form>
        ) : (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2 font-medium text-foreground">
              <LogIn className="size-4 text-amber-500" />
              Accedi con Google per pubblicare messaggi sulla lavagna.
            </span>
          </div>
        )}

        {/* Lista dei Messaggi della Settimana */}
        <div className="flex max-h-[260px] flex-col gap-2.5 overflow-y-auto pr-1 pt-1">
          {isLoading ? (
            <div className="h-16 w-full animate-pulse rounded-xl bg-muted/20" />
          ) : notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note.id}
                className="shadow-2xs backdrop-blur-xs flex items-start gap-3 rounded-xl border bg-card/80 p-3 transition-all hover:border-amber-500/30"
              >
                <Avatar
                  initials={note.author.initials}
                  className={`size-8 text-xs font-bold ${note.author.color} shrink-0 text-white`}
                >
                  {note.author.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={note.author.image}
                      alt={note.author.name}
                      className="size-full rounded-full object-cover"
                    />
                  )}
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-semibold">
                      {note.author.name}
                    </span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {note.dateLabel} · {note.time}
                    </span>
                  </div>
                  <p className="mt-0.5 break-words text-xs text-foreground/90">
                    {note.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5 py-6 text-center text-muted-foreground">
              <MessageSquare className="size-7 opacity-30" />
              <p className="text-xs font-medium">
                La lavagna è vuota questa settimana.
              </p>
              <p className="text-[11px]">Accedi e scrivi il primo messaggio!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
