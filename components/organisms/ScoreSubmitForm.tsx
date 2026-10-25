'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ClipboardPaste,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Game,
  GAME_CONFIG,
  games,
  parseScore,
  calculateNormalizedScore,
} from '@/lib/game-data';
import { submitScoreAction } from '@/app/actions/scores';
import { NeonButton } from '@/components/atoms/NeonButton';
import { GameBadge } from '@/components/atoms/GameBadge';

interface ScoreSubmitFormProps {
  defaultDate?: string;
  defaultGame?: Game;
  className?: string;
}

export function ScoreSubmitForm({
  defaultDate,
  defaultGame = 'Krilion',
  className,
}: ScoreSubmitFormProps) {
  const router = useRouter();
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  })();

  const [selectedGame, setSelectedGame] = useState<Game>(defaultGame);
  const [scoreDate, setScoreDate] = useState<string>(defaultDate || todayStr);
  const [rawInputText, setRawInputText] = useState<string>('');
  const [rawScore, setRawScore] = useState<string>('');
  const [detectedScore, setDetectedScore] = useState<number | null>(null);

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    game: Game;
    score: number;
    normalized: number;
  } | null>(null);

  // Gestione del testo incollato con parsing automatico
  const handleRawTextChange = (text: string) => {
    setRawInputText(text);
    setErrorMsg(null);
    if (!text.trim()) {
      setDetectedScore(null);
      return;
    }

    const parsed = parseScore(text, selectedGame);
    if (parsed !== null && !isNaN(parsed)) {
      setDetectedScore(parsed);
      setRawScore(parsed.toString());
    } else {
      setDetectedScore(null);
    }
  };

  // Cambio gioco: ricalcola eventuale testo incollato
  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    setErrorMsg(null);
    if (rawInputText.trim()) {
      const parsed = parseScore(rawInputText, game);
      if (parsed !== null && !isNaN(parsed)) {
        setDetectedScore(parsed);
        setRawScore(parsed.toString());
      } else {
        setDetectedScore(null);
      }
    }
  };

  const parsedNumericScore = parseInt(rawScore, 10);
  const isValidScore = !isNaN(parsedNumericScore) && parsedNumericScore >= 0;
  const normalizedPreview = isValidScore
    ? calculateNormalizedScore(selectedGame, parsedNumericScore)
    : 0;

  const currentGameConfig = GAME_CONFIG[selectedGame];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidScore) {
      setErrorMsg('Inserisci un punteggio numerico valido.');
      return;
    }

    setErrorMsg(null);
    startTransition(async () => {
      const res = await submitScoreAction({
        gameId: selectedGame,
        rawScore: parsedNumericScore,
        scoreDate,
        rawInputText: rawInputText.trim() || undefined,
      });

      if (res.success) {
        setSuccessInfo({
          game: selectedGame,
          score: parsedNumericScore,
          normalized: normalizedPreview,
        });
      } else {
        setErrorMsg(res.error || 'Impossibile registrare il punteggio.');
      }
    });
  };

  const resetForm = () => {
    setSuccessInfo(null);
    setRawInputText('');
    setRawScore('');
    setDetectedScore(null);
    setErrorMsg(null);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Schermata di Successo */}
      {successInfo ? (
        <div className="glass-card relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/15 via-transparent to-transparent p-6 text-center sm:p-10 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl border border-emerald-500/50 bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <CheckCircle2 className="size-8" />
          </div>

          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-300">
            Partita Registrata!
          </span>

          <h3 className="mt-4 text-2xl font-black text-white sm:text-3xl">
            Punteggio Salvato con Successo
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            La tua prestazione per{' '}
            <span className="font-bold text-white">{successInfo.game}</span> è
            stata inserita nel calcolo della classifica giornaliera.
          </p>

          {/* Dettaglio punteggi */}
          <div className="mx-auto my-6 flex max-w-sm items-center justify-around rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="text-center">
              <span className="text-[11px] font-bold uppercase text-muted-foreground">
                Punteggio Grezzo
              </span>
              <p className="text-2xl font-black text-white">
                {successInfo.score.toLocaleString('it-IT')}{' '}
                <span className="text-xs font-normal text-muted-foreground">
                  {currentGameConfig.unit}
                </span>
              </p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-center">
              <span className="text-[11px] font-bold uppercase text-cyan-400">
                Punti Normalizzati
              </span>
              <p className="text-2xl font-black text-cyan-300">
                {successInfo.normalized}{' '}
                <span className="text-xs font-normal text-muted-foreground">
                  / 1000 pt
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <NeonButton
              variant="outline"
              onClick={resetForm}
              className="gap-2"
            >
              <RotateCcw className="size-4" />
              <span>Inserisci un&apos;altra partita</span>
            </NeonButton>

            <Link href={`/dashboard?date=${scoreDate}`}>
              <NeonButton variant="primary" className="gap-2">
                <span>Vai alla Dashboard</span>
                <ArrowRight className="size-4" />
              </NeonButton>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selettore del Gioco */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              1. Scegli il Gioco
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {games.map((g) => {
                const isSelected = selectedGame === g;
                const info = GAME_CONFIG[g];
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleGameSelect(g)}
                    className={cn(
                      'glass-card relative flex cursor-pointer flex-col justify-between rounded-2xl p-4 text-left transition-all duration-200 active:scale-[0.98]',
                      isSelected
                        ? 'border-cyan-400 bg-white/[0.08] shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                        : 'border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <GameBadge gameId={g} size="md" />
                      <span className="text-[11px] font-bold uppercase text-muted-foreground">
                        {info.unit}
                      </span>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground">
                        {g === 'Metazooa' && 'Indovina in meno tentativi (1-20)'}
                        {g === 'Krilion' && 'Scala fino a 700 punti max'}
                        {g === 'Chronophoto' && 'Scala fino a 5.000 punti max'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selezione Data */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                2. Data della Partita
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setScoreDate(todayStr)}
                  className={cn(
                    'rounded-lg px-2.5 py-1 text-xs font-bold transition-all',
                    scoreDate === todayStr
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                  )}
                >
                  Oggi
                </button>
                <button
                  type="button"
                  onClick={() => setScoreDate(yesterdayStr)}
                  className={cn(
                    'rounded-lg px-2.5 py-1 text-xs font-bold transition-all',
                    scoreDate === yesterdayStr
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                  )}
                >
                  Ieri
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                <Calendar className="size-4 text-cyan-400" />
              </div>
              <input
                type="date"
                value={scoreDate}
                onChange={(e) => setScoreDate(e.target.value)}
                required
                className="glass-card w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-4 text-sm font-semibold text-white outline-none transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>

          {/* Incolla Messaggio / Condivisione (Smart Parser) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <ClipboardPaste className="size-3.5 text-cyan-400" />
                <span>3. Incolla Risultato (Opzionale con Auto-Parser)</span>
              </label>
              {detectedScore !== null && (
                <span className="flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300 animate-in fade-in">
                  <Sparkles className="size-3" />
                  Rilevato: {detectedScore} {currentGameConfig.unit}
                </span>
              )}
            </div>

            <textarea
              rows={3}
              value={rawInputText}
              onChange={(e) => handleRawTextChange(e.target.value)}
              placeholder={`Incolla qui il testo di condivisione di ${selectedGame} (es. WhatsApp o clipboard). Il punteggio verrà estratto automaticamente!`}
              className="glass-card w-full rounded-2xl border border-white/10 bg-black/40 p-3.5 text-xs text-white placeholder:text-muted-foreground outline-none transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          {/* Punteggio Effettivo (Manuale o Estratto) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                4. Punteggio ({currentGameConfig.unit})
              </label>
              <span className="text-[11px] text-muted-foreground">
                {currentGameConfig.isLowerBetter
                  ? 'Più basso è, migliore è il punteggio'
                  : 'Più alto è, migliore è il punteggio'}
              </span>
            </div>

            <input
              type="number"
              min={0}
              max={100000}
              required
              value={rawScore}
              onChange={(e) => {
                setRawScore(e.target.value);
                setErrorMsg(null);
              }}
              placeholder={`Es. ${selectedGame === 'Metazooa' ? '4' : selectedGame === 'Krilion' ? '620' : '3450'}`}
              className="glass-card w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-lg font-black tracking-tight text-white outline-none transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          {/* Anteprima Punti Normalizzati in tempo reale */}
          {isValidScore && (
            <div className="glass-card flex items-center justify-between rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    Punteggio Normalizzato Previsto
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Valore equiparato calcolato per la classifica generale
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-cyan-300">
                  {normalizedPreview}
                </span>
                <span className="ml-1 text-xs font-bold text-muted-foreground">
                  / 1000 pt
                </span>
              </div>
            </div>
          )}

          {/* Alert di Errore */}
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/15 p-3.5 text-xs font-semibold text-red-300">
              <AlertCircle className="size-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Pulsante di Invio */}
          <NeonButton
            type="submit"
            variant="primary"
            size="lg"
            disabled={!isValidScore || isPending}
            className="w-full text-base font-black tracking-wide"
          >
            {isPending ? 'Salvataggio in corso...' : 'Registra Partita'}
          </NeonButton>
        </form>
      )}
    </div>
  );
}
