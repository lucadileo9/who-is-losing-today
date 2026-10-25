import Image from 'next/image';
import { BugReportModal } from '@/components/molecules/BugReportModal';

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-white/10 bg-[#0a0b14]/70 backdrop-blur-md py-6 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="relative size-6 shrink-0 overflow-hidden rounded-lg border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <Image
              src="/logo.jpeg"
              alt="Who Is Losing Today"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-bold text-white">
            Who Is Losing Today?
          </span>
          <span className="text-xs">· Sfida tra amici</span>
        </div>

        <div className="flex items-center gap-4">
          <BugReportModal />
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Krilion · Metazooa · Chronophoto
          </span>
        </div>
      </div>
    </footer>
  );
}
