"use client";

import { useState } from "react";
import { ChevronDown, LockKeyhole } from "lucide-react";

const modules = [
  { title: "AI Foundations", days: "Days 1–4", startDay: 1, lessons: ["What AI can and can’t do", "Choose the right tool", "Write useful prompts", "Verify the output"] },
  { title: "Prompting for Real Work", days: "Days 5–8", startDay: 5, lessons: ["Add the right context", "Draft better work", "Research and summarise", "Structure rough ideas"] },
  { title: "Documents, Decisions & Data", days: "Days 9–12", startDay: 9, lessons: ["Emails and reports", "Meetings and actions", "Spreadsheet thinking", "Decision support"] },
  { title: "Creative and Responsible AI", days: "Days 13–16", startDay: 13, lessons: ["Brainstorm with constraints", "Images and presentations", "Protect privacy", "Spot bias and weak evidence"] },
  { title: "Your AI Operating System", days: "Days 17–20", startDay: 17, lessons: ["Use agentic tools", "Build a workflow", "Set safety rules", "Design your AI routine"] },
  { title: "Build Your Personal AI Agent with Open-Source Tools", days: "Day 21", startDay: 21, lessons: ["Build and test your personal agent"] },
];

export function Syllabus() {
  const [open, setOpen] = useState(0);
  return <div className="mx-auto max-w-3xl divide-y divide-[#dce2dd] border-y border-[#dce2dd]">{modules.map((module, index) => <div key={module.title}><button className="focus-ring flex w-full items-center gap-4 py-5 text-left" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e6efdf] font-black text-[#123c31]">{index + 1}</span><span className="min-w-0 flex-1"><span className="block font-bold">{module.title}</span><span className="text-sm text-[#5f6f67]">{module.days}</span></span><ChevronDown className={`shrink-0 transition ${open === index ? "rotate-180" : ""}`} /></button>{open === index && <div className="grid gap-2 pb-6 pl-14">{module.lessons.map((lesson, lessonIndex) => <div key={lesson} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm"><span className="font-mono text-xs text-[#839189]">{String(module.startDay + lessonIndex).padStart(2, "0")}</span><span className="flex-1 font-medium">{lesson}</span>{index === 0 && lessonIndex === 0 ? <span className="rounded-full bg-[#d9f99d] px-2 py-1 text-[10px] font-black uppercase text-[#123c31]">Free</span> : <LockKeyhole size={14} className="shrink-0 text-[#9aa69f]" />}</div>)}</div>}</div>)}</div>;
}
