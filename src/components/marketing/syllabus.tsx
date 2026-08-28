"use client";

import { useState } from "react";
import { ChevronDown, LockKeyhole } from "lucide-react";
import { Check } from "lucide-react";

const modules = [
  { title: "Foundations", days: "Lessons 1–3", start: 1, lessons: ["What a Personal AI Agent Is", "Why Hermes Agent", "How Hermes Is Put Together"] },
  { title: "Install & Run Everywhere", days: "Lessons 4–6", start: 4, lessons: ["Install Hermes Anywhere", "Connect a Model and Talk to Your Agent", "Run It 24/7 on a VPS"] },
  { title: "The Agent's Brain", days: "Lessons 7–9", start: 7, lessons: ["Tools and Toolsets — Your Agent's Hands", "Skills and the Curator — Your Agent Learns", "Memory, Context Files and Sessions — What Your Agent Remembers"] },
  { title: "Connect & Automate", days: "Lessons 10–12", start: 10, lessons: ["The Messaging Gateway — Telegram and WhatsApp", "Integrate Your Email — Draft, Don't Auto-Send", "Automate — Cron, Delegation, Batch and More"] },
  { title: "Build It Yourself — Labs", days: "Lessons 13–16", start: 13, lessons: ["Your First 7 Days — A Practical Plan", "The Connected Wall — One Agent Everywhere", "Secure and Harden Your Agent", "Capstone — Put Your Personal Agent in Production"] },
  { title: "Advanced & Extend", days: "Lessons 17–19", start: 17, lessons: ["Voice, Code Execution and Local Models", "Plugins, MCP and Extending Hermes", "Your One-Page Cheat Sheet and Next Steps"] },
];

export function Syllabus() {
  const [open, setOpen] = useState(0);
  return <div className="mx-auto max-w-3xl divide-y divide-[#dce2dd] border-y border-[#dce2dd]">{modules.map((module, index) => <div key={module.title}><button className="focus-ring flex w-full items-center gap-4 py-5 text-left" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e6efdf] font-black text-[#123c31]">{index + 1}</span><span className="min-w-0 flex-1"><span className="block font-bold">{module.title}</span><span className="text-sm text-[#5f6f67]">{module.days} · {module.lessons.length} lessons</span></span><ChevronDown className={`shrink-0 transition ${open === index ? "rotate-180" : ""}`} /></button>{open === index && <div className="grid gap-2 pb-6 pl-14">{module.lessons.map((lesson, lessonIndex) => <div key={lesson} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm"><span className="font-mono text-xs text-[#839189]">{String(module.start + lessonIndex).padStart(2, "0")}</span><span className="flex-1 font-medium">{lesson}</span>{index === 0 && lessonIndex === 0 ? <span className="flex items-center gap-1 rounded-full bg-[#d9f99d] px-2 py-1 text-[10px] font-black uppercase text-[#123c31]"><Check size={11} strokeWidth={3} />Free</span> : <LockKeyhole size={14} className="shrink-0 text-[#9aa69f]" />}</div>)}</div>}</div>)}</div>;
}
