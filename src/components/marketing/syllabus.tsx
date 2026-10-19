"use client";

import { useState } from "react";
import { ChevronDown, LockKeyhole } from "lucide-react";
import { Check } from "lucide-react";
import type { OutlineModule } from "@/lib/course-outline";

function dayRange(lessons: OutlineModule["lessons"]) {
  const first = lessons[0]?.day;
  const last = lessons[lessons.length - 1]?.day;
  return first === last ? `Day ${first}` : `Days ${first}–${last}`;
}

export function Syllabus({ modules }: { modules: OutlineModule[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-[#dfe5ee] border-y border-[#dfe5ee]">
      {modules.map((module, index) => (
        <div key={module.title}>
          <button
            className="focus-ring flex w-full items-center gap-4 py-5 text-left"
            onClick={() => setOpen(open === index ? -1 : index)}
            aria-expanded={open === index}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eaf2ff] font-black text-[#214889]">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold">{module.title}</span>
              <span className="text-sm text-[#4d5768]">{dayRange(module.lessons)} · {module.lessons.length} lessons</span>
            </span>
            <ChevronDown className={`shrink-0 transition ${open === index ? "rotate-180" : ""}`} />
          </button>
          {open === index && (
            <div className="grid gap-2 pb-6 pl-14">
              {module.lessons.map((lesson) => (
                <div key={lesson.day} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm">
                  <span className="font-mono text-xs text-[#8a94a6]">{String(lesson.day).padStart(2, "0")}</span>
                  <span className="flex-1 font-medium">{lesson.title}</span>
                  {lesson.day === 1 ? (
                    <span className="flex items-center gap-1 rounded-full bg-[#bcd6ff] px-2 py-1 text-[10px] font-black uppercase text-[#214889]">
                      <Check size={11} strokeWidth={3} />Free
                    </span>
                  ) : (
                    <LockKeyhole size={14} className="shrink-0 text-[#97a3b6]" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
