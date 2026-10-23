"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/** A code block with a Copy button, for the copy-and-paste templates in lessons. */
export function CopyCode({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(ref.current?.innerText ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused; the text is still selectable.
    }
  }
  return <div className="copy-block">
    <button type="button" onClick={copy} className="copy-button">{copied ? <><Check size={15} />Copied</> : <><Copy size={15} />Copy</>}</button>
    <pre ref={ref}>{children}</pre>
  </div>;
}
