import { cn } from '../lib/utils';

interface AuroraProps {
  className?: string;
}

export function Aurora({ className }: AuroraProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className
      )}
    >
      <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sky-500/40 blur-[140px]" />
      <div className="absolute top-1/3 -left-32 h-[420px] w-[420px] rounded-full bg-indigo-500/30 blur-[160px]" />
      <div className="absolute bottom-0 right-0 h-[360px] w-[360px] translate-x-16 translate-y-16 rounded-full bg-cyan-400/25 blur-[160px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.08)_0%,rgba(15,23,42,0.9)_60%)]" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 200\'%3E%3Cdefs%3E%3ClinearGradient id=\'g\' gradientTransform=\'rotate(45)\'%3E%3Cstop offset=\'0%25\' stop-color=\'%231e293b\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%23122c42\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill=\'url(%23g)\' d=\'M0 0h200v200H0z\'/%3E%3Cpath d=\'M0 20h200M0 60h200M0 100h200M0 140h200M0 180h200M20 0v200M60 0v200M100 0v200M140 0v200M180 0v200\' stroke=\'rgba(148,163,184,0.08)\' stroke-width=\'0.5\'/%3E%3C/svg%3E")' }} />
    </div>
  );
}
