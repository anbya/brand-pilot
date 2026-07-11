"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export function BrandBrainDrawer({
  children,
  description,
  footer,
  onClose,
  title,
}: {
  children: ReactNode;
  description?: string;
  footer?: ReactNode;
  onClose: () => void;
  title: string;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const isClosingRef = useRef(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const requestClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHasEntered(true));
    return () => {
      window.cancelAnimationFrame(frame);
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      const dialogs = document.querySelectorAll<HTMLElement>('[role="dialog"]');
      if (dialogs.item(dialogs.length - 1) === panelRef.current) requestClose();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [requestClose]);

  function trapFocus(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');
    if (!focusable?.length) return event.preventDefault();
    const first = focusable.item(0);
    const last = focusable.item(focusable.length - 1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  return (
    <div className={`fixed inset-0 z-[75] flex justify-end backdrop-blur-[1px] transition-colors duration-200 ${isClosing ? "bg-[#071b33]/0" : "bg-[#071b33]/55"}`} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && requestClose()}>
      <aside ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} tabIndex={-1} onKeyDown={trapFocus} onMouseDown={(event) => event.stopPropagation()} className={`flex h-full w-[96vw] max-w-[820px] flex-col border-l border-[#bfd3f2] bg-white text-[#0b1c30] shadow-[-24px_0_70px_rgba(7,27,51,.2)] outline-none transition-transform duration-200 ease-out sm:w-[88vw] ${hasEntered && !isClosing ? "translate-x-0" : "translate-x-full"}`}>
        <header className="flex shrink-0 items-start justify-between gap-5 border-b border-[#d3e4fe] bg-white px-5 py-5 sm:px-7">
          <div><h2 id={titleId} className="text-xl font-extrabold tracking-[-.02em] sm:text-2xl">{title}</h2>{description ? <p id={descriptionId} className="mt-1.5 max-w-2xl text-sm leading-6 text-[#657080]">{description}</p> : null}</div>
          <button type="button" aria-label="Close drawer" onClick={requestClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#c8d8ef] text-[#526174] transition hover:bg-[#eff4ff] hover:text-[#0058bc] focus:outline-none focus:ring-2 focus:ring-[#78aef5]"><svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg></button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        {footer ? <footer className="flex shrink-0 justify-end gap-3 border-t border-[#d3e4fe] bg-[#f8faff] px-5 py-4 sm:px-7">{footer}</footer> : null}
      </aside>
    </div>
  );
}
