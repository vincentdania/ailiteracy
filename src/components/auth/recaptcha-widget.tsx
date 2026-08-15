"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        "expired-callback": () => void;
        "error-callback": () => void;
      }) => number;
    };
  }
}

export function RecaptchaWidget({ siteKey }: { siteKey?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<HTMLInputElement>(null);
  const renderedRef = useRef(false);

  const renderWidget = useCallback(() => {
    if (!siteKey || renderedRef.current || !containerRef.current || !window.grecaptcha) return;
    window.grecaptcha.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token) => { if (tokenRef.current) tokenRef.current.value = token; },
      "expired-callback": () => { if (tokenRef.current) tokenRef.current.value = ""; },
      "error-callback": () => { if (tokenRef.current) tokenRef.current.value = ""; },
    });
    renderedRef.current = true;
  }, [siteKey]);

  useEffect(() => { renderWidget(); }, [renderWidget]);
  if (!siteKey) return null;

  return <div className="overflow-hidden rounded-xl border border-[#dce2dd] bg-white p-3">
    <Script src="https://www.google.com/recaptcha/api.js?render=explicit" strategy="afterInteractive" onReady={renderWidget} />
    <div ref={containerRef} className="min-h-[78px]" />
    <input ref={tokenRef} type="hidden" name="recaptchaToken" />
  </div>;
}
