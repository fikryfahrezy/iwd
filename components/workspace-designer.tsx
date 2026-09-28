"use client";

import { useCallback, useRef, useState } from "react";
import {
  DEFAULT_SELECTION,
  PRESETS,
  deskById,
  formatUsd,
  itemCount,
  weeklyTotal,
  type Selection,
} from "@/lib/catalog";
import { actions, useSelection } from "@/lib/store";
import { CatalogPanel } from "./catalog-panel";
import { CheckoutDialog } from "./checkout-dialog";
import {
  ArrowRightIcon,
  ArrowsUpDownIcon,
  ResetIcon,
  SparkleIcon,
  TruckIcon,
} from "./icons";
import { Scene } from "./scene";

function sameSetup(a: Selection, b: Selection) {
  const keys = new Set([...Object.keys(a.items), ...Object.keys(b.items)]);
  return (
    a.deskId === b.deskId &&
    a.chairId === b.chairId &&
    a.finish === b.finish &&
    a.chairColor === b.chairColor &&
    [...keys].every(
      (k) =>
        (a.items as Record<string, number>)[k] ===
        (b.items as Record<string, number>)[k],
    )
  );
}

function TotalBlock({ selection }: { selection: Selection }) {
  const n = itemCount(selection);
  return (
    <div className="min-w-0">
      <div className="text-xs font-medium text-muted">
        {n} {n === 1 ? "item" : "items"} · from
      </div>
      <div
        className="text-xl font-semibold tracking-tight tabular-nums"
        aria-live="polite"
      >
        {formatUsd(weeklyTotal(selection))}
        <span className="text-sm font-medium text-muted">/week</span>
      </div>
    </div>
  );
}

export function WorkspaceDesigner() {
  const selection = useSelection();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const desk = deskById(selection.deskId);
  const accessories = Object.values(selection.items).reduce(
    (s, n) => s + (n ?? 0),
    0,
  );

  const showNotice = (message: string) => {
    setNotice(message);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 4500);
  };

  const closeCheckout = useCallback(() => setCheckoutOpen(false), []);
  const startOver = useCallback(() => {
    actions.apply(DEFAULT_SELECTION);
    setCheckoutOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="pb-28 lg:flex lg:h-dvh lg:min-h-[28rem] lg:flex-col lg:pb-0">
      <header className="mx-auto flex w-full max-w-7xl shrink-0 items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-brand text-white">
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3 10h18M6 10v9M18 10v9M8 10V6h8v4" />
            </svg>
          </span>
          <span className="font-semibold tracking-tight">
            Workspace Designer
          </span>
        </div>
        <p className="hidden items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-sm text-muted shadow-sm sm:flex">
          <TruckIcon className="size-4 text-brand" />
          Delivered &amp; set up in Bali, as soon as tomorrow
        </p>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_420px] lg:grid-rows-[minmax(0,1fr)] lg:gap-6 lg:pb-4">
        {/* On desktop the left column scrolls on its own; the sidebar always fits the screen. */}
        <div className="contents lg:block lg:min-h-0 lg:overflow-y-auto lg:px-1 lg:pb-2">
          <div className="mb-2 lg:mb-5">
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Design your dream workspace
            </h1>
            <p className="mt-1.5 max-w-3xl text-pretty text-muted">
              Pick a desk and a chair, pile on the extras and watch it come to
              life. Happy with it? Rent it in one tap.
            </p>
          </div>

          {/* Stays in view on phones while you browse the catalog below it. */}
          <div className="sticky top-0 z-20 -mx-4 bg-canvas/90 px-4 pt-2 pb-3 backdrop-blur sm:mx-0 sm:px-0 lg:static lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <div className="relative overflow-hidden rounded-3xl border border-line bg-surface shadow-sm">
              <Scene selection={selection} className="scene block w-full" />

              {desk.standingHeight && (
                <button
                  type="button"
                  onClick={actions.toggleStanding}
                  aria-pressed={selection.standing}
                  className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white shadow-md transition hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:text-sm"
                >
                  <ArrowsUpDownIcon className="size-4" />
                  {selection.standing ? "Sit down" : "Stand up"}
                </button>
              )}

              {accessories === 0 && (
                <p className="pointer-events-none absolute inset-x-0 top-3 mx-auto w-fit max-w-[70%] rounded-full bg-surface/90 px-3 py-1.5 text-center text-xs font-medium text-muted shadow-sm sm:text-sm">
                  Add monitors, a lamp or a plant to bring it to life
                </p>
              )}

              <div
                role="status"
                aria-live="polite"
                className={`absolute inset-x-3 bottom-3 transition-all duration-300 ${
                  notice
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-2 opacity-0"
                }`}
              >
                {notice && (
                  <p className="mx-auto w-fit rounded-xl bg-ink px-3 py-2 text-center text-sm text-white shadow-lg">
                    {notice}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="order-last mt-8 lg:mt-6">
            <Presets selection={selection} />
          </div>
        </div>

        <aside
          aria-label="Build your setup"
          className="mt-3 rounded-3xl border border-line bg-surface p-4 shadow-sm sm:p-5 lg:mt-0 lg:flex lg:min-h-0 lg:flex-col"
        >
          <div className="lg:min-h-0 lg:flex-1 lg:-mx-1 lg:overflow-y-auto lg:px-1 lg:pt-2">
            <CatalogPanel
              selection={selection}
              onDeskChange={(removed, name, slots) => {
                if (removed > 0) {
                  showNotice(
                    `The ${name} fits ${slots} screen spots, so we took ${
                      removed === 1 ? "a monitor" : `${removed} monitors`
                    } off.`,
                  );
                }
              }}
            />
          </div>
          <div className="mt-4 hidden items-center justify-between gap-3 border-t border-line pt-4 lg:flex">
            <TotalBlock selection={selection} />
            <button
              type="button"
              onClick={() => setCheckoutOpen(true)}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Ready to rent
              <ArrowRightIcon />
            </button>
          </div>
        </aside>
      </main>

      {/* Mobile checkout bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <TotalBlock selection={selection} />
          <button
            type="button"
            onClick={() => setCheckoutOpen(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Ready to rent
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      {checkoutOpen && (
        <CheckoutDialog
          selection={selection}
          onClose={closeCheckout}
          onStartOver={startOver}
        />
      )}
    </div>
  );
}

function Presets({ selection }: { selection: Selection }) {
  return (
    <section aria-labelledby="presets-title">
      <div className="flex items-center justify-between gap-3">
        <h2
          id="presets-title"
          className="flex items-center gap-2 font-semibold"
        >
          <SparkleIcon className="size-4 text-coral" />
          Short on time? Start from a setup
        </h2>
        <button
          type="button"
          onClick={() => actions.clearAccessories()}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted transition hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
        >
          <ResetIcon className="size-3.5" />
          Clear extras
        </button>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        {PRESETS.map((p) => {
          const active = sameSetup(p.selection, selection);
          return (
            <li key={p.id} className="flex">
              <button
                type="button"
                onClick={() => actions.apply(p.selection)}
                aria-pressed={active}
                className={`group flex w-full flex-col overflow-hidden rounded-2xl border bg-surface text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  active
                    ? "border-brand shadow-[inset_0_0_0_1px_var(--color-brand)]"
                    : "border-line hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                <Scene
                  selection={p.selection}
                  className="block w-full bg-canvas"
                  title={`${p.name} preview`}
                />
                <span className="flex flex-1 flex-col p-3">
                  <span className="block text-sm font-semibold">{p.name}</span>
                  <span className="block text-xs text-muted">{p.tagline}</span>
                  <span className="mt-auto block pt-1 text-xs font-medium text-ink">
                    {formatUsd(weeklyTotal(p.selection))}/wk
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
