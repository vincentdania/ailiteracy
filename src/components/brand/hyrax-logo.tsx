/** The official HYRAX wordmark and mark (from hyrax.ng brand assets), drawn in currentColor. */
export const HYRAX_WORDMARK_PATHS = [
  "M102.79,35.42h-43.07c-4.32,0-7.82.67-10.31,2.16-2.66,1.5-4.82,3.49-6.49,5.65-1.83,2.16-3.33,4.49-4.66,6.99q0,.17-.17.33h-13.47V1.66H2v117.42h22.62v-62.7h78.17v62.7h22.79V1.66h-22.79v33.76Z",
  "M225.88,98.12h-54.38c-4.32,0-7.98-3.49-7.98-7.98v-54.72h-22.62v67.69c0,8.81,7.15,15.97,15.97,15.97h32.93c13.14,0,17.63-7.98,21.79-15.14h14.3v20.13c0,4.32-3.66,7.82-7.98,7.82h-27.11v20.96h41.75c8.81,0,15.97-6.99,15.97-15.64V35.42h-22.62v62.7Z",
  "M339.82,35.42v20.96h-53.39v62.71h-22.62V35.42h22.62v15.13h8.52c4.16-7.15,8.65-15.13,21.63-15.13h23.24Z",
  "M446.78,35.42h-75.84c-8.65,0-15.8,7.15-15.8,15.97v51.73c0,8.65,7.15,15.97,15.8,15.97h34.09c12.97,0,17.46-7.98,21.62-15.14h13.3v15.14h22.79V51.39c0-8.81-7.15-15.97-15.97-15.97ZM439.95,98.12h-54.22c-4.32,0-7.98-3.49-7.98-7.98v-25.95c0-4.32,3.66-7.82,7.98-7.82h46.24c4.49,0,7.98,3.49,7.98,7.82v33.93Z",
  "M589.19 35.42 L563.86 35.42 545.2 74.25 522.1 74.25 503.44 35.42 478.11 35.42 498.61 77.08 477.94 119.08 503.28 119.08 522.1 79.92 545.2 79.92 564.03 119.08 589.36 119.08 568.19 77.08 589.19 35.42Z",
  "M621.95,14.21c.51-.71.77-1.49.77-2.35,0-1.14-.41-2.11-1.21-2.91-.81-.8-1.78-1.2-2.92-1.2h-5.31v13.27h1.76v-5.08h3.13l2.97,5.08h1.95l-3.13-5.31c.81-.29,1.47-.79,1.98-1.5ZM615.04,14.34v-4.95h3.54c.66,0,1.22.24,1.68.72.46.48.69,1.06.69,1.74s-.23,1.27-.69,1.75c-.46.49-1.02.73-1.68.73h-3.54Z",
  "M617.28,1.66c-7.01,0-12.72,5.71-12.72,12.72s5.71,12.72,12.72,12.72,12.72-5.71,12.72-12.72-5.71-12.72-12.72-12.72ZM617.28,25.8c-6.3,0-11.42-5.12-11.42-11.42s5.12-11.42,11.42-11.42,11.42,5.12,11.42,11.42-5.12,11.42-11.42,11.42Z",
];
export const HYRAX_WORDMARK_VIEWBOX = "0 0 632 154.5";
export const HYRAX_MARK_PATH = "M222.76,3.15H3.86v218.04l109.22,109.65h217.37V113.26L222.76,3.15ZM242.85,238.92h-27.91v-76.81h-95.76v76.81h-27.71V95.08h27.71v59.9h16.5q.2-.2.2-.41c1.63-3.06,3.46-5.91,5.7-8.56,2.04-2.65,4.69-5.09,7.95-6.93,3.06-1.83,7.33-2.65,12.63-2.65h52.77v-41.36h27.91v143.85Z";
export const HYRAX_MARK_VIEWBOX = "0 0 334.31 334";

export function HyraxWordmark({ className, title = "HYRAX" }: { className?: string; title?: string }) {
  return <svg viewBox={HYRAX_WORDMARK_VIEWBOX} className={className} role="img" aria-label={title} fill="currentColor">{HYRAX_WORDMARK_PATHS.map((d, i) => <path key={i} d={d} />)}</svg>;
}

export function HyraxMark({ className, title = "HYRAX" }: { className?: string; title?: string }) {
  return <svg viewBox={HYRAX_MARK_VIEWBOX} className={className} role="img" aria-label={title} fill="currentColor"><path d={HYRAX_MARK_PATH} /></svg>;
}

/** Wordmark plus the Academy name: the lockup used across the learning platform. */
export function AcademyLockup({ className = "", inverse = false }: { className?: string; inverse?: boolean }) {
  return <span className={`inline-flex items-center gap-2.5 ${inverse ? "text-white" : "text-[#214889]"} ${className}`}>
    <HyraxWordmark className="h-[1.15em] w-auto" />
    <span aria-hidden className={`h-[1.1em] w-px ${inverse ? "bg-white/35" : "bg-[#214889]/30"}`} />
    <span className={`font-display whitespace-nowrap text-[.82em] font-semibold tracking-[-.01em] ${inverse ? "text-white/90" : "text-[#0b1c30]"}`}>AI Academy</span>
  </span>;
}
