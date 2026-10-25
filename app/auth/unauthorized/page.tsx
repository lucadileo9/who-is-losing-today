import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0b14] px-4 text-center text-white">
      <div className="relative max-w-md rounded-2xl border border-red-500/30 bg-[#121526]/90 p-8 shadow-[0_0_30px_rgba(239,68,68,0.2)] backdrop-blur-xl">
        <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-red-500/15 text-red-400">
          <ShieldAlert className="size-8" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Accesso Riservato
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-gray-400">
          Questa applicazione è privata e accessibile esclusivamente su invito.
          L&apos;indirizzo email con cui hai tentato l&apos;accesso non risulta
          attualmente registrato nella lista degli utenti autorizzati.
        </p>

        <div className="mt-6 rounded-xl border border-white/5 bg-white/5 p-3 text-xs text-gray-300">
          💡 Chiedi a un amministratore del gruppo di aggiungere la tua email
          Google alla Whitelist per accedere.
        </div>

        <div className="mt-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/20"
          >
            <ArrowLeft className="size-4" />
            Torna alla Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
