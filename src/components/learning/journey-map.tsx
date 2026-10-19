import Link from "next/link";
import { Award, Check, LockKeyhole, Play, Sparkles, Star } from "lucide-react";
import type { CourseState } from "@/lib/learning/progress";

type Module = CourseState["modules"][number];

/** The course as a series of levels (modules) made of stages (lessons). */
export function JourneyMap({ modules, compact = false }: { modules: Module[]; compact?: boolean }) {
  const currentId = modules.flatMap((m) => m.lessons).find((l) => l.unlocked && !l.completed && !l.isBonus)?.id;
  return <ol className="grid gap-6">
    {modules.map((courseModule, moduleIndex) => {
      const lessons = courseModule.lessons.filter((l) => !l.isBonus || l.unlocked);
      const started = lessons.some((l) => l.unlocked);
      const status = courseModule.certificate ? "mastered" : lessons.some((l) => l.id === currentId) ? "current" : started ? "open" : "locked";
      return <li key={courseModule.id} className={`surface overflow-hidden ${status === "current" ? "ring-2 ring-[#0058be]" : ""}`}>
        <div className={`flex items-center gap-4 p-5 sm:p-6 ${status === "mastered" ? "bg-[#fff9e8]" : status === "current" ? "bg-[#eef4fd]" : "bg-[#f6f8fb]"}`}>
          <span className={`grid size-14 shrink-0 place-items-center rounded-2xl font-display text-xl font-bold ${status === "mastered" ? "bg-[#f2b01e] text-[#0b1c30]" : status === "locked" ? "bg-[#dfe5ee] text-[#677284]" : "bg-[#0b1c30] text-white"}`}>{status === "mastered" ? <Award size={26} /> : status === "locked" ? <LockKeyhole size={20} /> : moduleIndex + 1}</span>
          <div className="min-w-0 flex-1">
            <p className="eyebrow">Level {moduleIndex + 1}{status === "mastered" ? " · Mastered" : status === "current" ? " · You are here" : status === "locked" ? " · Coming up" : ""}</p>
            <h3 className="mt-0.5 font-display text-xl font-bold leading-tight text-[#0b1c30] sm:text-2xl">{courseModule.title}</h3>
            <div className="mt-3 flex items-center gap-3"><div className={`xp-bar flex-1 ${status === "mastered" ? "gold-bar" : ""}`}><span style={{ width: `${courseModule.progress}%` }} /></div><span className="text-xs font-bold text-[#4d5768]">{courseModule.progress}%</span></div>
          </div>
        </div>
        {!compact && <div className="relative px-5 pb-5 pt-3 sm:px-6">
          <ol className="grid gap-1">
            {lessons.map((lesson, i) => {
              const isCurrent = lesson.id === currentId;
              const solved = lesson.missions.filter((m) => m.solved).length;
              const row = <div className={`relative flex items-center gap-4 rounded-2xl p-3 transition ${isCurrent ? "bg-[#0b1c30] text-white" : lesson.unlocked ? "hover:bg-[#f6f8fb]" : "opacity-60"}`}>
                {i < lessons.length - 1 && <span aria-hidden className={`absolute left-[1.9rem] top-12 h-[calc(100%-1.5rem)] w-[3px] rounded ${lesson.completed ? "bg-[#0058be]" : "bg-[#dfe5ee]"}`} />}
                <span className={`relative z-10 grid size-9 shrink-0 place-items-center rounded-full ${lesson.completed ? "bg-[#0058be] text-white" : isCurrent ? "bg-[#f2b01e] text-[#0b1c30]" : lesson.unlocked ? "border-2 border-[#0058be] bg-white text-[#0058be]" : "bg-[#edf1f6] text-[#97a3b6]"}`}>{lesson.completed ? <Check size={17} /> : lesson.unlocked ? <Play size={13} fill="currentColor" /> : <LockKeyhole size={14} />}</span>
                <div className="min-w-0 flex-1">
                  <p className={`text-[11px] font-bold uppercase tracking-[.12em] ${isCurrent ? "text-[#ffd36b]" : "text-[#677284]"}`}>{lesson.isBonus ? "Bonus" : `Day ${String(lesson.dayNumber).padStart(2, "0")}`}{lesson.isCapstone ? " · Capstone" : ""}{isCurrent ? " · Next up" : ""}</p>
                  <p className="truncate font-semibold">{lesson.title}</p>
                </div>
                <span className="hidden shrink-0 items-center gap-2 sm:flex">
                  {lesson.missions.length > 0 && <span className={`chip ${isCurrent ? "bg-white/10 text-white" : "bg-[#eaf2ff] text-[#0058be]"}`} title="Missions solved">{solved}/{lesson.missions.length} missions</span>}
                  {lesson.quiz?.passed && <Star size={16} className={isCurrent ? "text-[#ffd36b]" : "text-[#f2b01e]"} fill="currentColor" aria-label="Knowledge check mastered" />}
                  {lesson.advanced?.solved && <Sparkles size={16} className="text-[#f2b01e]" aria-label="Advanced mission solved" />}
                </span>
              </div>;
              return <li key={lesson.id}>{lesson.unlocked ? <Link href={`/challenge/${lesson.slug}`} className="block rounded-2xl">{row}</Link> : row}</li>;
            })}
          </ol>
          {courseModule.certificate ? <Link href={`/verify/${courseModule.certificate.credentialId}`} className="mt-3 flex items-center gap-3 rounded-2xl border border-[#f2b01e]/50 bg-[#fff9e8] p-3 text-sm font-bold text-[#8a5300]"><Award size={18} />Module certificate earned. View and share it.</Link>
            : <details className="mt-3 rounded-2xl border border-dashed border-[#cbd5e1] p-3 text-sm"><summary className="cursor-pointer font-bold text-[#4d5768]">What this level’s certificate needs</summary><ul className="mt-3 grid gap-2">{courseModule.requirements.map((r) => <li key={r.key} className="flex items-center gap-2"><span className={`grid size-5 place-items-center rounded-full ${r.met ? "bg-[#146c43] text-white" : "border border-[#cbd5e1]"}`}>{r.met && <Check size={12} />}</span>{r.label}<span className="ml-auto text-xs text-[#677284]">{r.done}/{r.total}</span></li>)}</ul></details>}
        </div>}
      </li>;
    })}
  </ol>;
}
