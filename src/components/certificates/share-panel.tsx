"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, Copy, Download, Eye, EyeOff, Linkedin, Printer, Share2 } from "lucide-react";
import { setCertificateVisibilityAction } from "@/app/actions/preferences";

type Props = {
  id: string;
  kind: "module" | "course";
  url: string;
  pdfHref: string;
  pngHref: string;
  shareText: string;
  linkedInAdd: string;
  links: { linkedin: string; facebook: string; whatsapp: string };
  showName: boolean;
};

export function SharePanel({ id, kind, url, pdfHref, pngHref, shareText, linkedInAdd, links, showName }: Props) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(showName);
  const [, startTransition] = useTransition();
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare(typeof navigator.share === "function"), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("textarea");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }
  async function nativeShare() {
    try {
      await navigator.share({ title: "My Hyrax certificate", text: shareText, url });
    } catch {
      // Cancelled or unsupported: the explicit buttons below remain available.
    }
  }
  const button = "tap inline-flex items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition";
  return <div className="no-print grid gap-4">
    <div className="grid gap-2 sm:grid-cols-2">
      <a href={pngHref} className={`${button} bg-[#0058be] py-3 text-white hover:bg-[#00479b]`}><Download size={17} />Download image (PNG)</a>
      <a href={linkedInAdd} target="_blank" rel="noreferrer" className={`${button} bg-[#0a66c2] py-3 text-white hover:bg-[#004182]`}><Linkedin size={17} />Add to LinkedIn profile</a>
    </div>
    <a href={pdfHref} className="-mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-[#0058be] hover:underline"><Download size={15} />Download PDF for printing</a>
    <p className="text-xs leading-5 text-[#677284]">“Add to LinkedIn profile” opens LinkedIn’s Licences &amp; Certifications form with the name, issuer, date, credential ID and verification URL filled in. You review and save it on LinkedIn.</p>
    <div>
      <p className="text-sm font-bold text-[#0b1c30]">Share</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <a href={links.linkedin} target="_blank" rel="noreferrer" className={`${button} border border-[#cbd5e1] text-[#0b1c30] hover:bg-[#f6f8fb]`}>LinkedIn post</a>
        <a href={links.facebook} target="_blank" rel="noreferrer" className={`${button} border border-[#cbd5e1] text-[#0b1c30] hover:bg-[#f6f8fb]`}>Facebook</a>
        <a href={links.whatsapp} target="_blank" rel="noreferrer" className={`${button} border border-[#cbd5e1] text-[#0b1c30] hover:bg-[#f6f8fb]`}>WhatsApp</a>
        <button type="button" onClick={copy} className={`${button} border border-[#cbd5e1] text-[#0b1c30] hover:bg-[#f6f8fb]`} aria-live="polite">{copied ? <><Check size={16} className="text-[#146c43]" />Link copied</> : <><Copy size={16} />Copy link</>}</button>
        {canShare && <button type="button" onClick={nativeShare} className={`${button} border border-[#cbd5e1] text-[#0b1c30] hover:bg-[#f6f8fb]`}><Share2 size={16} />More…</button>}
        <button type="button" onClick={() => window.print()} className={`${button} border border-[#cbd5e1] text-[#0b1c30] hover:bg-[#f6f8fb]`}><Printer size={16} />Print</button>
      </div>
    </div>
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#dfe5ee] p-4">
      <input type="checkbox" checked={visible} onChange={(e) => { const next = e.target.checked; setVisible(next); startTransition(async () => { await setCertificateVisibilityAction({ id, kind, showName: next }); }); }} className="mt-1 size-4 accent-[#0058be]" />
      <span className="text-sm leading-6"><strong className="flex items-center gap-2 text-[#0b1c30]">{visible ? <Eye size={15} /> : <EyeOff size={15} />}Show my name on the public verification page</strong><span className="text-[#4d5768]">When this is off, anyone with the link can still confirm the certificate is genuine, but your name is hidden. Your email address is never shown.</span></span>
    </label>
  </div>;
}
