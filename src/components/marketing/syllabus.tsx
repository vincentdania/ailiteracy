"use client";

import { useState } from "react";
import { ChevronDown, LockKeyhole } from "lucide-react";
import { Check } from "lucide-react";

const modules = [
  {
    title: "Start: Your First Win",
    days: "Days 1–2",
    start: 1,
    lessons: ["Rough Notes to Finished Report", "Talking to AI — and Checking When It Lies"],
  },
  {
    title: "The Documents of Your Job",
    days: "Days 3–5",
    start: 3,
    lessons: ["Reports, Memos and Templates", "Emails, Customer Replies and a Month of Posts", "Long Documents and Spreadsheets Without Formulas"],
  },
  {
    title: "Your Role, Your Playbook",
    days: "Days 6–7",
    start: 6,
    lessons: ["Your Role Branch: Jobseeker, Programme Staff or Teacher", "Your Personal AI Playbook"],
  },
  {
    title: "Agents Week",
    days: "Days 8–10",
    start: 8,
    lessons: ["What an Agent Actually Is — No Code", "Build Your First Agent: Instructions, Memory, Trigger", "Your Agent's Routine — and Pass It On"],
  },
];

export function Syllabus() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-[#dce2dd] border-y border-[#dce2dd]">
      {modules.map((module, index) => (
        <div key={module.title}>
          <button
            className="focus-ring flex w-full items-center gap-4 py-5 text-left"
            onClick={() => setOpen(open === index ? -1 : index)}
            aria-expanded={open === index}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e6efdf] font-black text-[#123c31]">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold">{module.title}</span>
              <span className="text-sm text-[#5f6f67]">{module.days} · {module.lessons.length} lessons</span>
            </span>
            <ChevronDown className={`shrink-0 transition ${open === index ? "rotate-180" : ""}`} />
          </button>
          {open === index && (
            <div className="grid gap-2 pb-6 pl-14">
              {module.lessons.map((lesson, lessonIndex) => (
                <div key={lesson} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm">
                  <span className="font-mono text-xs text-[#839189]">{String(module.start + lessonIndex).padStart(2, "0")}</span>
                  <span className="flex-1 font-medium">{lesson}</span>
                  {index === 0 && lessonIndex === 0 ? (
                    <span className="flex items-center gap-1 rounded-full bg-[#d9f99d] px-2 py-1 text-[10px] font-black uppercase text-[#123c31]">
                      <Check size={11} strokeWidth={3} />Free
                    </span>
                  ) : (
                    <LockKeyhole size={14} className="shrink-0 text-[#9aa69f]" />
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
