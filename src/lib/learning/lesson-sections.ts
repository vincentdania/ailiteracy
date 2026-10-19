/**
 * Splits lesson Markdown into short "beats" for the step-by-step reader, and
 * pulls the task and output sections out so the player can show them in the
 * Master step. Headings inside fenced code blocks are ignored.
 */
export type LessonBeat = { title: string; markdown: string };

const TASK = /^🎯\s*Task/i;
const OUTPUT = /^📤\s*Output/i;

export function splitLesson(markdown: string) {
  const lines = markdown.split("\n");
  const head = { title: "", lines: [] as string[] };
  const sections: { title: string; lines: string[] }[] = [head];
  let current = head;
  let fenced = false;
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    const heading = !fenced && line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      current = { title: heading[1] ?? "", lines: [] };
      sections.push(current);
    } else current.lines.push(line);
  }
  const body = (lines: string[]) => lines.join("\n").replace(/^\s*---\s*$/gm, "").trim();
  // The H1 repeats the page title and the read-time line is shown in the header.
  const intro = body(head.lines.filter((line) => !/^#\s+/.test(line) && !/^\*\*Read time:/.test(line)));
  const beats: LessonBeat[] = [];
  let task: string | null = null;
  let output: string | null = null;
  let afterOutput = "";
  for (const section of sections.slice(1)) {
    if (TASK.test(section.title)) task = body(section.lines);
    else if (OUTPUT.test(section.title)) {
      // Anything after a closing rule in the output section is a footnote (privacy card etc.).
      const [main, ...rest] = section.lines.join("\n").split(/^\s*---\s*$/m);
      output = (main ?? "").trim();
      afterOutput = rest.join("\n").trim();
    } else beats.push({ title: section.title, markdown: body(section.lines) });
  }
  return { intro, beats, task, output, footnote: afterOutput || null };
}

export function readTime(markdown: string) {
  return markdown.match(/\*\*Read time:\s*([^*·]+?)\s*(?:·|\*\*)/)?.[1]?.trim() ?? null;
}
