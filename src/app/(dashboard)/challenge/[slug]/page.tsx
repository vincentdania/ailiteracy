import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Award, Brain, Check, Clock3, Compass, ExternalLink, Hammer, Laptop, Lightbulb, LockKeyhole, MapPin, Smartphone, Sparkles, Target, Trophy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCaseStudy } from "@/lib/personalization/case-studies";
import { parseActivities, parseQuiz, quizPassMark, toPublicMission } from "@/lib/learning/activities";
import { lessonBlockers } from "@/lib/learning/mastery";
import { loadCourseState } from "@/lib/learning/progress";
import { readTime, splitLesson } from "@/lib/learning/lesson-sections";
import { XP } from "@/lib/learning/rewards";
import { CompleteButton } from "@/components/challenge/complete-button";
import { PracticeSubmission } from "@/components/challenge/practice-submission";
import { LessonQuiz } from "@/components/challenge/lesson-quiz";
import { MissionCard } from "@/components/learning/mission-card";
import { LessonBeats } from "@/components/learning/lesson-beats";

export const dynamic = "force-dynamic";

const md = (markdown: string) => <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>;

function Stage({ id, step, icon, title, lead, children }: { id: string; step: string; icon: ReactNode; title: string; lead?: string; children: ReactNode }) {
  return <section id={id} className="scroll-mt-28 pt-12" aria-labelledby={`${id}-title`}>
    <div className="mb-5 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#0b1c30] text-white">{icon}</span><div><p className="eyebrow">{step}</p><h2 id={`${id}-title`} className="font-display text-2xl font-bold tracking-[-.02em] text-[#0b1c30] sm:text-3xl">{title}</h2></div></div>
    {lead && <p className="-mt-1 mb-5 max-w-2xl leading-7 text-[#4d5768]">{lead}</p>}
    {children}
  </section>;
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  const { slug } = await params;
  const lesson = await db.lesson.findFirst({ where: { slug }, include: { module: { include: { course: true } } } });
  if (!lesson) notFound();
  const sections = splitLesson(lesson.contentMarkdown);
  const activities = parseActivities(lesson.activitiesJson);
  const minutes = readTime(lesson.contentMarkdown);

  // Public free preview (e.g. Day 1) for visitors who are not signed in.
  if (!session?.user.id) {
    if (!lesson.isFreePreview) redirect("/login");
    const courseLessonCount = await db.lesson.count({ where: { module: { courseId: lesson.module.courseId }, isBonus: false } });
    const freeEnrollment = process.env.FREE_ENROLLMENT_ENABLED === "true";
    return <article className="mx-auto max-w-3xl">
      <Link href="/" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-[#4d5768]"><ArrowLeft size={17} />Back to home</Link>
      <header className="pb-6"><p className="eyebrow">Free preview · Lesson {String(lesson.dayNumber).padStart(2, "0")} of {courseLessonCount}</p><h1 className="display mt-3 text-4xl text-[#0b1c30] sm:text-5xl">{lesson.title}</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-[#4d5768]">{lesson.summary}</p></header>
      {activities && <div className="surface-dark p-6 sm:p-8"><p className="eyebrow !text-[#ffd36b]">{activities.discover.title}</p><p className="mt-3 text-lg leading-8 text-white/85">{activities.discover.scenario}</p></div>}
      <div className="lesson-prose mt-8">{md([sections.intro, ...sections.beats.map((b) => `## ${b.title}\n\n${b.markdown}`), sections.task ? `## 🎯 Task\n\n${sections.task}` : ""].join("\n\n"))}</div>
      <div className="surface-dark mt-10 p-6 sm:p-8">
        <h2 className="display text-3xl">Missions, XP and a certificate are waiting.</h2>
        <p className="mt-3 leading-7 text-white/75">{freeEnrollment ? "Create your free account" : "Enroll"} to play this lesson’s missions, master the knowledge check, and earn a verifiable certificate for every module you complete.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={freeEnrollment ? "/signup" : "/checkout"} className="tap inline-flex items-center rounded-full bg-[#f2b01e] px-6 py-3 text-sm font-bold text-[#0b1c30]">{freeEnrollment ? "Start learning free" : "Enroll now"}</Link>
          <Link href="/" className="tap inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white">See the course</Link>
        </div>
      </div>
    </article>;
  }

  const state = await loadCourseState(session.user.id, lesson.module.courseId);
  if (!state) redirect("/checkout");
  const courseModule = state.modules.find((m) => m.id === lesson.moduleId)!;
  const mastery = courseModule.lessons.find((l) => l.id === lesson.id)!;
  if (!mastery.unlocked) return <div className="mx-auto grid min-h-[65vh] max-w-xl place-items-center text-center"><div><span className="mx-auto grid size-16 place-items-center rounded-full bg-[#edf1f6]"><LockKeyhole /></span><h1 className="display mt-5 text-4xl">This stage unlocks soon.</h1><p className="my-5 leading-7 text-[#4d5768]">A new lesson opens each day at midnight in your timezone. Meanwhile, you can replay earlier missions to sharpen your skills.</p><Link className="font-bold text-[#0058be] underline" href="/challenge">Back to your journey</Link></div></div>;

  const [plan, submission, quizAttempt] = await Promise.all([
    db.learningPlan.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId: lesson.module.courseId } }, include: { personalizedLessons: { where: { lessonId: lesson.id }, take: 1 } } }),
    db.projectSubmission.findUnique({ where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } } }),
    db.quizAttempt.findUnique({ where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } } }),
  ]);
  const personalized = plan?.personalizedLessons[0];
  const caseStudy = getCaseStudy(personalized?.caseStudySlug);
  const quiz = parseQuiz(lesson.quizJson);
  const ordered = state.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleTitle: m.title })));
  const position = ordered.findIndex((l) => l.id === lesson.id);
  const prevLesson = position > 0 ? ordered[position - 1] : null;
  const nextLesson = position >= 0 && position < ordered.length - 1 ? ordered[position + 1] : null;
  const moduleIndex = state.modules.findIndex((m) => m.id === courseModule.id);
  const stageIndex = courseModule.lessons.findIndex((l) => l.id === lesson.id);
  const missionsDone = mastery.missions.filter((m) => m.solved).length;
  const xpAvailable = XP.lessonComplete + (quiz ? XP.quizPassed + XP.quizPerfect : 0) + mastery.missions.length * XP.missionFirstTry + (mastery.isCapstone ? XP.capstonePassed : XP.practicalPassed);
  const blockers = lessonBlockers(mastery);
  const label = lesson.isBonus ? "Bonus" : `Day ${lesson.dayNumber}`;

  const steps = [
    activities && { id: "discover", label: "Discover", done: true },
    { id: "understand", label: "Understand", done: true },
    activities && { id: "practise", label: "Practise", done: mastery.missions.every((m) => m.solved) },
    quiz && { id: "challenge", label: "Challenge", done: !!mastery.quiz?.passed },
    { id: "master", label: "Master", done: mastery.practical.passed },
    { id: "celebrate", label: "Celebrate", done: mastery.completed },
  ].filter((s): s is { id: string; label: string; done: boolean } => !!s);

  return <article className="mx-auto max-w-3xl">
    <nav className="flex items-center justify-between gap-3 text-sm" aria-label="Breadcrumb"><Link href="/challenge" className="tap inline-flex items-center gap-2 font-bold text-[#4d5768] hover:text-[#0b1c30]"><ArrowLeft size={17} />Journey</Link><span className="truncate text-[#677284]">Level {moduleIndex + 1} · {courseModule.title}</span></nav>

    <header className="pt-4">
      <p className="eyebrow">{label} · Stage {stageIndex + 1} of {courseModule.lessons.length}</p>
      <h1 className="display mt-3 text-[2.2rem] text-[#0b1c30] sm:text-5xl">{lesson.title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-[#4d5768]">{lesson.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {minutes && <span className="chip bg-white text-[#4d5768] ring-1 ring-[#dfe5ee]"><Clock3 size={13} />{minutes}</span>}
        {activities && <span className="chip bg-white text-[#4d5768] ring-1 ring-[#dfe5ee]">{activities.device === "phone" ? <><Smartphone size={13} />Works on your phone</> : <><Laptop size={13} />A computer is recommended</>}</span>}
        <span className="chip bg-[#fff4d6] text-[#8a5300]"><Sparkles size={13} />Up to {xpAvailable} XP</span>
        {mastery.completed && <span className="chip bg-[#e6f4ec] text-[#146c43]"><Check size={13} />Completed</span>}
      </div>
    </header>

    <nav className="no-print sticky top-0 z-20 -mx-4 mt-6 border-b border-[#dfe5ee] bg-[#f6f8fb]/95 px-4 py-2.5 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-3" aria-label="Lesson steps">
      <ol className="flex gap-1 overflow-x-auto">{steps.map((step, i) => <li key={step.id} className="shrink-0"><a href={`#${step.id}`} className="tap flex items-center gap-2 rounded-full px-3 text-xs font-bold text-[#4d5768] hover:bg-white hover:text-[#0b1c30]"><span className={`grid size-5 place-items-center rounded-full text-xs ${step.done && (step.id !== "discover" && step.id !== "understand") ? "bg-[#146c43] text-white" : "bg-[#dfe5ee] text-[#4d5768]"}`}>{step.done && step.id !== "discover" && step.id !== "understand" ? <Check size={11} /> : i + 1}</span>{step.label}</a></li>)}</ol>
    </nav>

    {activities && <Stage id="discover" step="Step 1 · Discover" icon={<Compass size={19} />} title={activities.discover.title.replace(/^Mission briefing:\s*/i, "Mission briefing: ")}>
      <div className="surface-dark p-6 sm:p-8"><p className="text-lg leading-8 text-white/90">{activities.discover.scenario}</p></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{([["Understand", activities.objectives.understand, Brain], ["Do", activities.objectives.do, Hammer], ["Demonstrate", activities.objectives.demonstrate, Target], ["Apply", activities.objectives.apply, Trophy]] as const).map(([title, text, Icon]) => <div key={title} className="surface p-4"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-[#0058be]"><Icon size={14} />You will {title.toLowerCase()}</p><p className="mt-2 text-base leading-6 text-[#26324a]">{text}</p></div>)}</div>
    </Stage>}

    <Stage id="understand" step={`Step ${activities ? 2 : 1} · Understand and explore`} icon={<Lightbulb size={19} />} title="The ideas, one at a time">
      {personalized && <div className="surface mb-5 overflow-hidden"><p className="flex items-center gap-2 border-b border-[#dfe5ee] px-5 py-3 text-sm font-bold text-[#0b1c30]"><Sparkles size={16} className="text-[#0058be]" />Personalised for you</p><div className="grid gap-5 p-5 md:grid-cols-2"><div><h3 className="font-display text-lg font-semibold">Why this matters to you</h3><p className="mt-2 leading-7 text-[#4d5768]">{personalized.whyItMatters}</p></div><div><h3 className="font-display text-lg font-semibold">In your context</h3><p className="mt-2 leading-7 text-[#4d5768]">{personalized.tailoredExample}</p></div></div></div>}
      {sections.intro && <div className="lesson-prose mb-5">{md(sections.intro)}</div>}
      <LessonBeats beats={sections.beats.map((beat) => ({ title: beat.title, content: md(beat.markdown) }))} nextHref={activities ? "#practise" : quiz ? "#challenge" : "#master"} nextLabel={activities ? "Start your missions" : quiz ? "Take the knowledge check" : "Do the real-world task"} />
      {activities && <aside className="mt-5 rounded-2xl border border-[#f2b01e]/50 bg-[#fff9e8] p-5"><p className="flex items-center gap-2 font-display font-bold text-[#8a5300]"><Lightbulb size={17} />Remember these {activities.keyIdeas.length}</p><ul className="mt-3 grid gap-2">{activities.keyIdeas.map((idea) => <li key={idea} className="flex gap-2.5 text-base leading-6 text-[#26324a]"><Check size={16} className="mt-1 shrink-0 text-[#8a5300]" />{idea}</li>)}</ul></aside>}
      {caseStudy && <aside className="surface-dark mt-6 p-6 sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><p className="eyebrow !text-[#ffd36b]">African case study · {caseStudy.sector}</p><span className="flex items-center gap-1 text-xs font-bold text-white/60"><MapPin size={14} />{caseStudy.region}</span></div><h3 className="display mt-3 text-3xl">{caseStudy.name}</h3><p className="mt-4 leading-7 text-white/75">{caseStudy.summary}</p><div className="mt-5 rounded-xl bg-white/10 p-5"><p className="flex items-center gap-2 font-bold text-[#ffd36b]"><Lightbulb size={18} />What to notice</p><p className="mt-2 leading-7 text-white/75">{caseStudy.lesson}</p></div><a href={caseStudy.sourceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white underline decoration-white/40 underline-offset-4">Read the original source: {caseStudy.sourceLabel} <ExternalLink size={15} /></a></aside>}
    </Stage>

    {activities && <Stage id="practise" step="Step 3 · Practise" icon={<Target size={19} />} title={`Your missions · ${missionsDone} of ${activities.missions.length} solved`} lead="Real situations, instant feedback. Get one wrong and you'll get a hint, then a simpler explanation. Every mission must be solved to complete the lesson.">
      <div className="grid gap-5">{activities.missions.map((mission, i) => { const s = mastery.missions.find((m) => m.key === mission.key); return <MissionCard key={mission.key} lessonId={lesson.id} index={i} mission={toPublicMission(lesson.id, mission)} initial={{ solved: !!s?.solved, attempts: s?.attempts ?? 0 }} />; })}</div>
    </Stage>}

    {quiz && <Stage id="challenge" step={`Step ${activities ? 4 : 2} · Challenge`} icon={<Brain size={19} />} title="Knowledge check">
      <LessonQuiz lessonId={lesson.id} quiz={quiz.map(({ q, options }) => ({ q, options }))} bestScore={quizAttempt?.score ?? null} passMark={quizPassMark(quiz.length)} />
      {activities?.advanced && <div className="mt-5"><MissionCard lessonId={lesson.id} index={0} advanced locked={!mastery.advanced?.available} mission={toPublicMission(lesson.id, activities.advanced)} initial={{ solved: !!mastery.advanced?.solved, attempts: mastery.advanced?.solved ? 1 : 0 }} /></div>}
    </Stage>}

    <Stage id="master" step={`Step ${steps.findIndex((s) => s.id === "master") + 1} · Master`} icon={<Hammer size={19} />} title="Apply it to your real work" lead="Missions prove you understand. This proves you can do it, on material from your own job.">
      {(sections.task || personalized) && <div className="surface p-5 sm:p-7">
        {personalized && <><p className="eyebrow">Your personalised brief</p><p className="mt-2 text-lg leading-8 text-[#26324a]">{personalized.practiceBrief}</p>{personalized.successCriteria.length > 0 && <ul className="mt-4 grid gap-2">{personalized.successCriteria.map((c) => <li key={c} className="flex gap-2.5 text-sm leading-6 text-[#4d5768]"><Check size={16} className="mt-0.5 shrink-0 text-[#0058be]" />{c}</li>)}</ul>}</>}
        {sections.task && <div className={personalized ? "mt-6 border-t border-[#dfe5ee] pt-5" : ""}><p className="eyebrow">Today’s task</p><div className="lesson-prose mt-1">{md(sections.task)}</div></div>}
        {sections.output && <div className="mt-4 rounded-2xl bg-[#eef4fd] p-4"><p className="text-xs font-bold uppercase tracking-[.12em] text-[#214889]">What you’ll have at the end</p><div className="lesson-prose mt-1 !text-base">{md(sections.output)}</div></div>}
      </div>}
      <div className="mt-5"><PracticeSubmission lessonId={lesson.id} lessonTitle={lesson.title} isCapstone={mastery.isCapstone} initial={submission} /></div>
      {sections.footnote && <div className="lesson-prose mt-5 rounded-2xl border border-[#dfe5ee] bg-white p-4 !text-sm">{md(sections.footnote)}</div>}
    </Stage>

    <Stage id="celebrate" step={`Step ${steps.length} · Celebrate`} icon={<Award size={19} />} title={mastery.completed ? "Stage complete" : "Finish the stage"}>
      <div className="surface p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3"><p className="font-display font-semibold text-[#0b1c30]">Level {moduleIndex + 1} certificate · {courseModule.title}</p><span className="text-sm font-bold text-[#0058be]">{courseModule.progress}%</span></div>
        <div className="xp-bar mt-3"><span style={{ width: `${courseModule.progress}%` }} /></div>
        <ul className="mt-4 grid gap-2 text-sm">{courseModule.requirements.map((r) => <li key={r.key} className="flex items-center gap-2.5"><span className={`grid size-5 shrink-0 place-items-center rounded-full ${r.met ? "bg-[#146c43] text-white" : "border border-[#cbd5e1]"}`}>{r.met && <Check size={12} />}</span><span className={r.met ? "text-[#0b1c30]" : "text-[#4d5768]"}>{r.label}</span><span className="ml-auto text-xs font-semibold text-[#677284]">{r.done}/{r.total}</span></li>)}</ul>
        {courseModule.certificate && <Link href={`/verify/${courseModule.certificate.credentialId}`} className="tap mt-5 inline-flex items-center gap-2 rounded-full bg-[#fff4d6] px-5 py-2.5 text-sm font-bold text-[#8a5300]"><Award size={16} />View your module certificate</Link>}
      </div>
    </Stage>

    <CompleteButton lessonId={lesson.id} completed={mastery.completed} blockers={blockers} />

    <nav className="no-print mt-8 grid gap-3 sm:grid-cols-2" aria-label="Lesson navigation">
      {prevLesson ? <Link href={`/challenge/${prevLesson.slug}`} className="group flex flex-col gap-1 rounded-2xl border border-[#dfe5ee] bg-white p-4 transition hover:border-[#8fb0e0]"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#677284]">Previous</span><span className="font-bold text-[#0b1c30]">{prevLesson.isBonus ? "Bonus" : `Day ${prevLesson.dayNumber}`}: {prevLesson.title}</span></Link> : <span />}
      {nextLesson ? <Link href={nextLesson.unlocked ? `/challenge/${nextLesson.slug}` : "/challenge"} className="group flex flex-col gap-1 rounded-2xl bg-[#0b1c30] p-4 text-white transition hover:bg-[#214889]"><span className="text-xs font-bold uppercase tracking-[.12em] text-white/60">{nextLesson.unlocked ? "Next stage" : "Next stage · unlocks soon"}</span><span className="flex items-center justify-between gap-2 font-bold">{nextLesson.isBonus ? "Bonus" : `Day ${nextLesson.dayNumber}`}: {nextLesson.title}<ArrowRight size={17} className="shrink-0" /></span></Link> : <span />}
    </nav>
  </article>;
}
