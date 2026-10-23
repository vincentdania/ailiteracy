import type { ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyCode } from "@/components/learning/copy-code";

/**
 * Lesson Markdown with the build-along helpers. A blockquote that opens with one of
 * these bold labels becomes a styled box, e.g. `> **You should now see:** ...`.
 */
const CALLOUTS: { label: RegExp; className: string }[] = [
  { label: /^you should now see/i, className: "callout callout-check" },
  { label: /^if it didn.t work/i, className: "callout callout-fix" },
  { label: /^stay safe/i, className: "callout callout-safe" },
  { label: /^new word/i, className: "callout callout-word" },
  { label: /^try it/i, className: "callout callout-try" },
];

type HastNode = { type: string; tagName?: string; value?: string; children?: HastNode[] };

function text(node: HastNode | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(text).join("");
}

function calloutClass(node: HastNode | undefined) {
  const paragraph = node?.children?.find((child) => child.type === "element");
  const lead = paragraph?.children?.find((child) => child.type === "element" || (child.type === "text" && child.value?.trim()));
  if (lead?.tagName !== "strong") return null;
  const label = text(lead);
  return CALLOUTS.find((callout) => callout.label.test(label))?.className ?? null;
}

const components: Components = {
  blockquote({ node, children }) {
    const className = calloutClass(node as HastNode | undefined);
    return className ? <aside className={className}>{children}</aside> : <blockquote>{children}</blockquote>;
  },
  pre({ children }) {
    return <CopyCode>{children}</CopyCode>;
  },
  img({ src, alt, title }) {
    if (typeof src !== "string") return null;
    // eslint-disable-next-line @next/next/no-img-element -- lesson images are static SVG/PNG files of known size
    const image = <img src={src} alt={alt ?? ""} loading="lazy" />;
    // Figures open full size in a new tab so screenshots can be zoomed on a phone.
    const zoomable = <a href={src} target="_blank" rel="noreferrer" className="lesson-zoom">{image}</a>;
    return title ? <span className="lesson-figure">{zoomable}<span className="lesson-caption">{title} <span className="lesson-zoom-hint">Open full size.</span></span></span> : zoomable;
  },
  a({ href, children }) {
    const external = typeof href === "string" && /^https?:/.test(href);
    return <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{children}</a>;
  },
};

export function LessonMarkdown({ children }: { children: string }): ReactNode {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{children}</ReactMarkdown>;
}
