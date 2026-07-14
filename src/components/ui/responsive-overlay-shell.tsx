"use client";

import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode, type RefObject } from "react";

type ResponsiveOverlayShellProps = {
  open?: boolean;
  variant?: "dialog" | "drawer";
  role?: "dialog" | "alertdialog";
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  headerAside?: ReactNode;
  initialFocusRef?: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
  maxWidth?: string;
  bodyClassName?: string;
  bodyScrollable?: boolean;
  footerClassName?: string;
  overlayClassName?: string;
  panelClassName?: string;
  closeLabel?: string;
  showClose?: boolean;
  showHeader?: boolean;
  onClose: () => void;
};

let scrollLockCount = 0;
let previousBodyOverflow = "";
let previousBodyOverscroll = "";
let previousHtmlOverflow = "";

function lockPageScroll() {
  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    previousBodyOverscroll = document.body.style.overscrollBehavior;
    previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "contain";
    document.documentElement.style.overflow = "hidden";
  }
  scrollLockCount += 1;
}

function unlockPageScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
    document.body.style.overscrollBehavior = previousBodyOverscroll;
    document.documentElement.style.overflow = previousHtmlOverflow;
  }
}

export function ResponsiveOverlayShell({
  open = true,
  variant = "dialog",
  role = "dialog",
  title,
  description,
  eyebrow,
  children,
  footer,
  headerAside,
  initialFocusRef,
  returnFocusRef,
  maxWidth = "max-w-[720px]",
  bodyClassName = "p-4 sm:p-6",
  bodyScrollable = true,
  footerClassName = "",
  overlayClassName = "",
  panelClassName = "",
  closeLabel,
  showClose = true,
  showHeader = true,
  onClose,
}: ResponsiveOverlayShellProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const explicitReturnTarget = returnFocusRef?.current;
    lockPageScroll();
    (initialFocusRef?.current ?? headingRef.current)?.focus();

    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      const panels = document.querySelectorAll<HTMLElement>('[data-responsive-overlay-panel="true"]');
      if (panels.item(panels.length - 1) === panelRef.current) onCloseRef.current();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      unlockPageScroll();
      const returnTarget = explicitReturnTarget ?? trigger;
      if (returnTarget?.isConnected) returnTarget.focus();
    };
  }, [initialFocusRef, open, returnFocusRef]);

  if (!open) return null;

  function trapFocus(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [contenteditable="true"], [tabindex]:not([tabindex="-1"])');
    if (!focusable?.length) return event.preventDefault();
    const first = focusable.item(0);
    const last = focusable.item(focusable.length - 1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  const isDrawer = variant === "drawer";
  const overlayLayout = isDrawer ? "justify-end p-0" : "items-center justify-center p-2 sm:p-4";
  const panelLayout = isDrawer
    ? `h-[100dvh] max-h-[100dvh] w-full ${maxWidth} rounded-none border-l sm:w-[min(88vw,820px)]`
    : `max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] ${maxWidth} rounded-xl border sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)]`;

  return <div role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()} className={`fixed inset-0 z-[95] flex overflow-hidden bg-[#071b33]/60 backdrop-blur-[2px] ${overlayLayout} ${overlayClassName}`}>
    <section
      ref={panelRef}
      data-responsive-overlay-panel="true"
      role={role}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      tabIndex={-1}
      onKeyDown={trapFocus}
      onMouseDown={(event) => event.stopPropagation()}
      className={`flex min-w-0 flex-col overflow-hidden border-[#bfd3f2] bg-white text-[#0b1c30] shadow-[0_24px_80px_rgba(7,27,51,.28)] outline-none ${panelLayout} ${panelClassName}`}
    >
      {showHeader ? <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[#d3e4fe] bg-white px-4 py-4 sm:gap-5 sm:px-6">
        <div className="min-w-0 flex-1">
          {eyebrow ? <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[.16em] text-[#717786]">{eyebrow}</p> : null}
          <h2 ref={headingRef} tabIndex={-1} id={titleId} className="break-words text-lg font-extrabold tracking-[-.02em] outline-none sm:text-2xl">{title}</h2>
          {description ? <p id={descriptionId} className="mt-1 break-words text-sm leading-5 text-[#657080] sm:leading-6">{description}</p> : null}
        </div>
        {headerAside ? <div className="shrink-0">{headerAside}</div> : null}
        {showClose ? <button type="button" aria-label={closeLabel ?? `Close ${typeof title === "string" ? title : "dialog"}`} onClick={onClose} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#c8d8ef] text-xl text-[#526174] outline-none transition hover:bg-[#eff4ff] hover:text-[#0058bc] focus-visible:ring-2 focus-visible:ring-[#0058bc]">×</button> : null}
      </header> : <h2 ref={headingRef} tabIndex={-1} id={titleId} className="sr-only outline-none">{title}</h2>}
      {children !== undefined && children !== null ? <div className={`min-h-0 min-w-0 flex-1 overscroll-contain overflow-x-hidden ${bodyScrollable ? "overflow-y-auto" : "overflow-y-hidden"} ${bodyClassName}`}>{children}</div> : null}
      {footer ? <footer className={`flex shrink-0 flex-col-reverse gap-2 border-t border-[#d3e4fe] bg-[#f8faff] px-4 py-3 [&>*]:w-full min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:justify-end min-[480px]:gap-3 min-[480px]:px-6 min-[480px]:py-4 min-[480px]:[&>*]:w-auto ${footerClassName}`}>{footer}</footer> : null}
    </section>
  </div>;
}
