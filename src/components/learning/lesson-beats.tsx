"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, List, Rows3 } from "lucide-react";

type Beat = { title: string; content: React.ReactNode };

const MODE_KEY = "hyrax-reader-mode";

/** Short, one-idea-at-a-time reading with a "show everything" option. */
export function LessonBeats({ beats, nextHref, nextLabel }: { beats: Beat[]; nextHref: string; nextLabel: string }) {
  const [index, setIndex] = useState(0);
  const [all, setAll] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try {
      if (localStorage.getItem(MODE_KEY) === "all") setAll(true);
    } catch {
      // Storage can be unavailable (private mode); the stepped reader is the default.
    }
  }, []);
  function setMode(value: boolean) {
    setAll(value);
    try { localStorage.setItem(MODE_KEY, value ? "all" : "steps"); } catch { /* ignore */ }
  }
  function go(next: number) {
    setIndex(next);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    top.current?.focus({ preventScroll: true });
  }
  const beat = beats[index];
  if (!beat) return null;
  const last = index === beats.length - 1;

  return <div ref={top} tabIndex={-1} className="scroll-mt-28 outline-none">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      {!all ? <div className="flex items-center gap-1.5" aria-label={`Idea ${index + 1} of ${beats.length}`}>{beats.map((beat, i) => <button key={beat.title + i} type="button" onClick={() => go(i)} aria-label={`Go to idea ${i + 1}: ${beat.title}`} aria-current={i === index ? "step" : undefined} className={`h-2 rounded-full transition-all ${i === index ? "w-7 bg-[#10294f]" : i < index ? "w-2.5 bg-[#c8742b]" : "w-2.5 bg-[#dfe5ee]"}`} />)}</div> : <span className="text-sm font-semibold text-[#4d5768]">{beats.length} ideas</span>}
      <button type="button" onClick={() => setMode(!all)} className="tap inline-flex items-center gap-2 rounded-full px-3 text-sm font-semibold text-[#4d5768] hover:bg-white">{all ? <><Rows3 size={15} />One idea at a time</> : <><List size={15} />Show all</>}</button>
    </div>
    {all ? <div className="grid gap-5">{beats.map((beat, i) => <article key={beat.title + i} className="surface p-5 sm:p-8"><p className="eyebrow">Idea {i + 1}</p><h3 className="mt-1 font-display text-2xl font-semibold text-[#10294f]">{beat.title}</h3><div className="lesson-prose mt-2">{beat.content}</div></article>)}</div>
      : <article key={index} className="surface anim-rise p-5 sm:p-8" aria-live="polite">
        <p className="eyebrow">Idea {index + 1} of {beats.length}</p>
        <h3 className="mt-1 font-display text-2xl font-semibold text-[#10294f] sm:text-[1.75rem]">{beat.title}</h3>
        <div className="lesson-prose mt-2">{beat.content}</div>
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#dfe5ee] pt-5">
          <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="tap inline-flex items-center gap-2 rounded-full px-4 text-sm font-bold text-[#4d5768] hover:bg-[#faf7f2] disabled:invisible"><ArrowLeft size={16} />Back</button>
          {last ? <a href={nextHref} className="tap inline-flex items-center gap-2 rounded-full bg-[#10294f] px-6 py-3 text-sm font-bold text-white hover:bg-[#00479b]">{nextLabel}<ArrowDown size={16} /></a>
            : <button type="button" onClick={() => go(index + 1)} className="tap inline-flex items-center gap-2 rounded-full bg-[#10294f] px-6 py-3 text-sm font-bold text-white hover:bg-[#10294f]">Next idea<ArrowRight size={16} /></button>}
        </div>
      </article>}
  </div>;
}
