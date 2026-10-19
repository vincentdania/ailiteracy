"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Award, Sparkles, X } from "lucide-react";
import type { Celebration } from "@/lib/learning/progress";
import { BadgeIcon } from "@/components/learning/badge-icon";

type Prefs = { effectsEnabled: boolean; soundEnabled: boolean };
type Ctx = { celebrate: (c: Celebration | null | undefined) => void; prefs: Prefs; setPrefs: (p: Prefs) => void };

const CelebrationContext = createContext<Ctx>({ celebrate: () => undefined, prefs: { effectsEnabled: true, soundEnabled: false }, setPrefs: () => undefined });

export function useCelebrate() {
  return useContext(CelebrationContext);
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function chime(big: boolean) {
  try {
    const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = big ? [523.25, 659.25, 783.99, 1046.5] : [659.25, 987.77];
    notes.forEach((frequency, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = frequency;
      const start = ctx.currentTime + i * 0.09;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.12, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.4);
    });
    setTimeout(() => void ctx.close(), 1200);
  } catch {
    // Sound is a nicety; never let it break the lesson.
  }
}

const CONFETTI_COLOURS = ["#0058be", "#214889", "#f2b01e", "#4f8ff0", "#ffd36b", "#9cc3ff"];

function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 70 }, (_, i) => ({ id: i, left: (i * 37) % 100, delay: (i % 10) * 0.07, dur: 2.2 + ((i * 13) % 10) / 10, drift: ((i * 29) % 60) - 30, colour: CONFETTI_COLOURS[i % CONFETTI_COLOURS.length], rotate: (i * 47) % 360 })), []);
  return <div aria-hidden>{pieces.map((p) => <span key={p.id} className="confetti-piece" style={{ left: `${p.left}vw`, background: p.colour, animationDelay: `${p.delay}s`, transform: `rotate(${p.rotate}deg)`, ["--dur" as string]: `${p.dur}s`, ["--drift" as string]: `${p.drift}vw` }} />)}</div>;
}

export function CelebrationProvider({ children, initialPrefs }: { children: React.ReactNode; initialPrefs: Prefs }) {
  const [prefs, setPrefsState] = useState(initialPrefs);
  const [moment, setMoment] = useState<Celebration | null>(null);
  const [toast, setToast] = useState<Celebration | null>(null);
  const [confetti, setConfetti] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.documentElement.dataset.effects = prefs.effectsEnabled ? "on" : "off";
  }, [prefs.effectsEnabled]);

  useEffect(() => {
    if (moment) closeRef.current?.focus();
    if (!moment) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMoment(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moment]);

  const celebrate = useCallback((c: Celebration | null | undefined) => {
    if (!c || (c.xpGained <= 0 && !c.badges.length && !c.certificates.length)) return;
    const big = !!(c.levelUp || c.badges.length || c.certificates.length);
    const motion = prefs.effectsEnabled && !prefersReducedMotion();
    if (prefs.soundEnabled) chime(big);
    if (big) {
      setMoment(c);
      if (motion) setConfetti((n) => n + 1);
    } else {
      setToast(c);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 3800);
    }
  }, [prefs]);

  return <CelebrationContext.Provider value={{ celebrate, prefs, setPrefs: setPrefsState }}>
    {children}
    <div aria-live="polite" className="sr-only">{toast ? `Plus ${toast.xpGained} XP. ${toast.events.map((e) => e.label).join(". ")}` : ""}</div>
    {toast && <div className="no-print pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 lg:bottom-8"><div className="anim-pop flex max-w-md items-center gap-3 rounded-2xl bg-[#0b1c30] px-5 py-3 text-white shadow-2xl"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f2b01e] text-[#0b1c30]"><Sparkles size={18} /></span><div className="min-w-0"><strong className="block font-display text-lg">+{toast.xpGained} XP</strong><span className="block truncate text-sm text-white/75">{toast.events[0]?.label}{toast.events.length > 1 ? ` and ${toast.events.length - 1} more` : ""}</span></div></div></div>}
    {confetti > 0 && moment && <Confetti key={confetti} />}
    {moment && <div className="no-print fixed inset-0 z-[65] grid place-items-center bg-[#07121f]/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="celebration-title" onClick={(e) => e.target === e.currentTarget && setMoment(null)}>
      <div className="anim-pop relative w-full max-w-md overflow-hidden rounded-[1.75rem] bg-white text-center shadow-2xl">
        <button ref={closeRef} onClick={() => setMoment(null)} className="tap absolute right-3 top-3 grid size-11 place-items-center rounded-full text-[#4d5768] hover:bg-[#edf1f6]" aria-label="Close"><X size={20} /></button>
        <div className="surface-dark rounded-none px-6 pb-7 pt-9">
          <span className="anim-glow mx-auto grid size-20 place-items-center rounded-full bg-[#f2b01e] text-[#0b1c30]">{moment.certificates.length ? <Award size={38} /> : moment.badges[0] ? <BadgeIcon icon={moment.badges[0].key} size={36} /> : <Sparkles size={36} />}</span>
          <p className="eyebrow mt-5 !text-[#ffd36b]">{moment.certificates.length ? "Certificate earned" : moment.levelUp ? `Level ${moment.levelUp.level} reached` : "Achievement unlocked"}</p>
          <h2 id="celebration-title" className="display mt-2 text-3xl">{moment.certificates[0] ? moment.certificates[0].moduleTitle : moment.levelUp ? `You're now a ${moment.levelUp.title}` : moment.badges[0]?.title}</h2>
          <p className="mt-3 text-white/75">{moment.certificates[0] ? `You met every requirement of this module in ${moment.certificates[0].courseTitle}. Your certificate is ready to download and share.` : moment.badges[0]?.description ?? "Every point here came from something you can now actually do."}</p>
        </div>
        <div className="grid gap-3 p-6 text-left">
          <div className="flex items-center justify-between rounded-2xl bg-[#f6f8fb] px-4 py-3"><span className="text-sm font-bold text-[#4d5768]">XP earned</span><strong className="font-display text-xl text-[#0058be]">+{moment.xpGained}</strong></div>
          {moment.badges.length > (moment.certificates.length ? 0 : 1) && <ul className="grid gap-2">{moment.badges.slice(moment.certificates.length ? 0 : 1).map((badge) => <li key={badge.key} className="flex items-center gap-3 rounded-2xl border border-[#dfe5ee] px-4 py-3 text-sm"><span className="grid size-8 place-items-center rounded-full bg-[#fff4d6] text-[#8a5300]"><BadgeIcon icon={badge.key} size={16} /></span><span><strong className="block">{badge.title}</strong><span className="text-[#4d5768]">{badge.description}</span></span></li>)}</ul>}
          {moment.certificates[0] ? <Link href={`/verify/${moment.certificates[0].credentialId}`} onClick={() => setMoment(null)} className="tap mt-1 inline-flex items-center justify-center rounded-full bg-[#0058be] px-6 py-3 font-bold text-white hover:bg-[#00479b]">View your certificate</Link> : <button onClick={() => setMoment(null)} className="tap mt-1 rounded-full bg-[#0058be] px-6 py-3 font-bold text-white hover:bg-[#00479b]">Keep going</button>}
        </div>
      </div>
    </div>}
  </CelebrationContext.Provider>;
}
