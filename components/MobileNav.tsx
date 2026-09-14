"use client";

import { Menu, User, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type MobileNavLink = {
  label: string;
  href: string;
};

export type MobileNavAction = {
  label: string;
  /** Presente → renderiza como link; ausente → botão visual (login único ainda não implementado). */
  href?: string;
  variant: "solid" | "outline";
};

type MobileNavProps = {
  links: readonly MobileNavLink[];
  actions?: readonly MobileNavAction[];
};

export default function MobileNav({ links, actions }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha com a tecla Esc
  useEffect(() => {
    if (!open) {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Fecha ao clicar fora do menu
  useEffect(() => {
    if (!open) {
      return;
    }
    function onPointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={containerRef} className="relative md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={
          open ? "Fechar menu de navegação" : "Abrir menu de navegação"
        }
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-phiq-dark/15 text-phiq-dark transition-colors hover:bg-phiq-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phiq-primary focus-visible:ring-offset-2"
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {open ? (
        <div
          id="mobile-nav-panel"
          className="absolute right-0 top-12 w-64 rounded-3xl border border-phiq-dark/10 bg-white p-3 shadow-2xl shadow-phiq-dark/20"
        >
          {actions && actions.length > 0 ? (
            <div className="flex flex-col gap-2 p-1">
              {actions.map((action) => {
                const styles =
                  action.variant === "solid"
                    ? "bg-phiq-primary text-white shadow-md shadow-phiq-primary/25 hover:bg-phiq-dark"
                    : "border border-phiq-dark/15 bg-white text-phiq-dark hover:border-phiq-primary/40 hover:text-phiq-primary";
                const className = `inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phiq-primary focus-visible:ring-offset-2 ${styles}`;

                return action.href ? (
                  <Link
                    key={action.label}
                    href={action.href}
                    onClick={() => setOpen(false)}
                    className={className}
                  >
                    {action.label}
                  </Link>
                ) : (
                  <button key={action.label} type="button" className={className}>
                    <User className="h-4 w-4" aria-hidden="true" />
                    {action.label}
                  </button>
                );
              })}
              <div
                aria-hidden="true"
                className="mx-1 mt-1 border-t border-phiq-dark/10"
              />
            </div>
          ) : null}

          <nav aria-label="Navegação (mobile)" className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-phiq-dark transition-colors hover:bg-phiq-primary/5 hover:text-phiq-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phiq-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
}