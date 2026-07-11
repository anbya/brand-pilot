"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

export function BrandBrainDialog({
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
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-[#071b33]/60 p-3 backdrop-blur-[2px] sm:p-6"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className="my-auto flex max-h-[calc(100vh-1.5rem)] w-full max-w-[720px] flex-col overflow-hidden rounded-xl border border-[#bfd3f2] bg-white text-[#0b1c30] shadow-[0_24px_80px_rgba(7,27,51,.24)] outline-none sm:max-h-[calc(100vh-3rem)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-5 border-b border-[#d3e4fe] px-5 py-5 sm:px-7">
          <div>
            <h2 id={titleId} className="text-xl font-extrabold tracking-[-0.02em] sm:text-2xl">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1.5 text-sm leading-6 text-[#657080]">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#c8d8ef] text-[#526174] transition hover:bg-[#eff4ff] hover:text-[#0058bc] focus:outline-none focus:ring-2 focus:ring-[#78aef5]"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">{children}</div>

        {footer ? (
          <footer className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-[#d3e4fe] bg-[#f8faff] px-5 py-4 sm:px-7">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
