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
  TruckIcon,
} from "./icons";
import { Scene } from "./scene";
import { Button } from "@/components/ui/button";
import { focusRing, selectable } from "@/components/ui/styles";
import { cn } from "@/lib/utils";

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
      <div className="text-xs text-muted">
        {n} {n === 1 ? "item" : "items"}
      </div>
      <div
        className="text-xl font-semibold tracking-tight tabular-nums"
        aria-live="polite"
      >
        {formatUsd(weeklyTotal(selection))}
        <span className="ml-0.5 text-sm font-normal text-muted">/week</span>
      </div>
    </div>
  );
}

function RentButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="primary"
      size="lg"
      onClick={onClick}
      iconEnd={<ArrowRightIcon />}
    >
      Ready to rent
    </Button>
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

  const openCheckout = useCallback(() => setCheckoutOpen(true), []);
  const closeCheckout = useCallback(() => setCheckoutOpen(false), []);
  const startOver = useCallback(() => {
    actions.apply(DEFAULT_SELECTION);
    setCheckoutOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="pb-24 lg:flex lg:h-dvh lg:min-h-[28rem] lg:flex-col lg:pb-0">
      <header className="shrink-0 border-b border-line bg-surface">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-lg bg-ink text-white">
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.25}
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M3 10h18M6 10v9M18 10v9M8 10V6h8v4" />
              </svg>
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              Workspace Designer
            </span>
          </div>
          <p className="hidden items-center gap-2 text-sm text-muted sm:flex">
            <TruckIcon className="size-4 text-brand" />
            Delivered &amp; set up in Bali, as soon as tomorrow
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col px-4 pt-5 sm:px-6 lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_420px] lg:grid-rows-[minmax(0,1fr)] lg:gap-6 lg:pt-6 lg:pb-6">
        {/* On desktop the left column scrolls on its own; the sidebar always fits the screen. */}
        <div className="contents lg:block lg:min-h-0 lg:overflow-y-auto lg:px-1 lg:pb-2">
          <div className="mb-3 lg:mb-5">
            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-balance sm:text-[28px]">
              Design your workspace
            </h1>
            <p className="mt-1 max-w-3xl text-[15px] text-pretty text-muted">
              Pick a desk and a chair, add the extras and watch it come to life.
              Happy with it? Rent it in one tap.
            </p>
          </div>

          {/* Stays in view on phones while you browse the catalog below it. */}
          <div className="sticky top-0 z-20 -mx-4 bg-canvas/90 px-4 pt-2 pb-3 backdrop-blur sm:mx-0 sm:px-0 lg:static lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
              <Scene selection={selection} className="scene block w-full" />

              {desk.standingHeight && (
                <Button
                  onClick={actions.toggleStanding}
                  aria-pressed={selection.standing}
                  className="absolute top-3 right-3 shadow-[0_1px_2px_rgb(0_0_0/0.06)]"
                  icon={<ArrowsUpDownIcon className="size-3.5" />}
                >
                  {selection.standing ? "Sit down" : "Stand up"}
                </Button>
              )}

              {accessories === 0 && (
                <p className="pointer-events-none absolute inset-x-0 top-3 mx-auto w-fit max-w-[70%] rounded-lg border border-line bg-surface/95 px-2.5 py-1.5 text-center text-xs text-muted sm:text-[13px]">
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
                  <p className="mx-auto w-fit rounded-lg bg-ink px-3 py-2 text-center text-[13px] text-white shadow-lg">
                    {notice}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="order-last mt-8 lg:mt-8">
            <Presets selection={selection} />
          </div>
        </div>

        <aside
          aria-label="Build your setup"
          className="mt-3 rounded-2xl border border-line bg-surface p-4 sm:p-5 lg:mt-0 lg:flex lg:min-h-0 lg:flex-col"
        >
          <div className="lg:-mx-1 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:px-1">
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
            <RentButton onClick={openCheckout} />
          </div>
        </aside>
      </main>

      {/* Mobile checkout bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <TotalBlock selection={selection} />
          <RentButton onClick={openCheckout} />
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
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 id="presets-title" className="text-[15px] font-semibold">
            Start from a setup
          </h2>
          <p className="text-[13px] text-muted">
            Short on time? Pick one and make it yours.
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => actions.clearAccessories()}
          icon={<ResetIcon className="size-3.5" />}
        >
          Clear extras
        </Button>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {PRESETS.map((p) => {
          const active = sameSetup(p.selection, selection);
          return (
            <li key={p.id} className="flex">
              <button
                type="button"
                onClick={() => actions.apply(p.selection)}
                aria-pressed={active}
                className={cn(
                  "flex w-full flex-col overflow-hidden rounded-xl bg-surface text-left",
                  selectable(active),
                  focusRing,
                )}
              >
                <Scene
                  selection={p.selection}
                  className="block w-full"
                  title={`${p.name} preview`}
                />
                <span className="flex flex-1 flex-col border-t border-line px-3 py-2.5">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium">{p.name}</span>
                    <span className="text-xs text-muted tabular-nums">
                      {formatUsd(weeklyTotal(p.selection))}/wk
                    </span>
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {p.tagline}
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
